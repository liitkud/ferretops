package cmd

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"

	"github.com/liitkud/ferretops-cli/internal"
)

func TestDetermineLocalVerdictMidSeverityIsUncertain(t *testing.T) {
	verdict, reason := determineLocalVerdict(
		[]internal.LocalViolation{{Severity: "MID"}}, false,
	)
	if verdict != "uncertain" || reason != "Mid-risk findings require backend review" {
		t.Fatalf("determineLocalVerdict() = %q, %q", verdict, reason)
	}
}

func TestDetermineLocalVerdictGitleaksFlagBlocks(t *testing.T) {
	verdict, _ := determineLocalVerdict(nil, true)
	if verdict != "block" {
		t.Fatalf("determineLocalVerdict() = %q, want block", verdict)
	}
}

func TestDetermineLocalVerdictEmptyAllows(t *testing.T) {
	verdict, _ := determineLocalVerdict(nil, false)
	if verdict != "allow" {
		t.Fatalf("determineLocalVerdict() = %q, want allow", verdict)
	}
}

func TestExecuteVerdictBlockJSON(t *testing.T) {
	err := executeVerdict(
		"block",
		[]internal.LocalViolation{{Severity: "HIGH", File: "a.go", Line: 3, Pattern: "p"}},
		"test reason",
		true,
	)
	if err == nil || err.Error() != "push blocked" {
		t.Fatalf("executeVerdict() error = %v, want push blocked", err)
	}
}

func TestExecuteVerdictAllowJSON(t *testing.T) {
	if err := executeVerdict("allow", nil, "ok", true); err != nil {
		t.Fatalf("executeVerdict() error = %v", err)
	}
}

func TestExecuteVerdictUnknownReturnsError(t *testing.T) {
	// Non-JSON path hits the switch default for unknown verdicts.
	if err := executeVerdict("bogus", nil, "", false); err == nil {
		t.Fatal("executeVerdict() expected error for unknown verdict")
	}
}

// offloadToValidate polls /validate/{id}; the fake server returns a LOW
// verdict on first poll so the loop exits after one GET.
func TestOffloadToValidateReturnsLowVerdict(t *testing.T) {
	var gotSubmit ValidateRequest
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case r.Method == http.MethodPost && r.URL.Path == "/validate":
			if err := json.NewDecoder(r.Body).Decode(&gotSubmit); err != nil {
				t.Errorf("decode submit: %v", err)
			}
			w.Header().Set("Content-Type", "application/json")
			_ = json.NewEncoder(w).Encode(map[string]string{
				"validation_id": "v-1",
				"status":        "pending",
			})
		case r.Method == http.MethodGet && r.URL.Path == "/validate/v-1":
			w.Header().Set("Content-Type", "application/json")
			_ = json.NewEncoder(w).Encode(map[string]string{
				"validation_id": "v-1",
				"verdict":       "LOW",
				"reasoning":     "clean",
				"status":        "complete",
			})
		default:
			t.Errorf("unexpected request %s %s", r.Method, r.URL.Path)
			w.WriteHeader(http.StatusNotFound)
		}
	}))
	defer server.Close()

	verdict, violations, reason, err := offloadToValidate(server.URL, "diff --git a/x b/x")
	if err != nil {
		t.Fatalf("offloadToValidate() error = %v", err)
	}
	if verdict != "allow" {
		t.Fatalf("verdict = %q, want allow", verdict)
	}
	if violations != nil {
		t.Fatalf("violations = %v, want nil", violations)
	}
	if reason != "clean" {
		t.Fatalf("reason = %q", reason)
	}
	if gotSubmit.RuleID != "auto" || gotSubmit.CodeSnippet == "" {
		t.Fatalf("submit payload = %+v", gotSubmit)
	}
}

func TestOffloadToValidateHighVerdictBlocks(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method == http.MethodPost {
			_ = json.NewEncoder(w).Encode(map[string]string{"validation_id": "v-2", "status": "pending"})
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]string{
			"validation_id": "v-2",
			"verdict":       "HIGH",
			"reasoning":     "violation",
			"status":        "complete",
		})
	}))
	defer server.Close()

	verdict, _, reason, err := offloadToValidate(server.URL, "diff")
	if err != nil {
		t.Fatalf("offloadToValidate() error = %v", err)
	}
	if verdict != "block" || reason != "violation" {
		t.Fatalf("verdict=%q reason=%q", verdict, reason)
	}
}

func TestOffloadToValidateApprovedStatusAllows(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method == http.MethodPost {
			_ = json.NewEncoder(w).Encode(map[string]string{"validation_id": "v-3", "status": "pending"})
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]string{
			"validation_id": "v-3",
			"verdict":       "MID",
			"reasoning":     "approved by officer",
			"status":        "approved",
		})
	}))
	defer server.Close()

	verdict, _, reason, err := offloadToValidate(server.URL, "diff")
	if err != nil {
		t.Fatalf("offloadToValidate() error = %v", err)
	}
	if verdict != "allow" || !strings.Contains(reason, "approved by officer") {
		t.Fatalf("verdict=%q reason=%q", verdict, reason)
	}
}

func TestOffloadToValidateRejectedStatusBlocks(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method == http.MethodPost {
			_ = json.NewEncoder(w).Encode(map[string]string{"validation_id": "v-4", "status": "pending"})
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]string{
			"validation_id": "v-4",
			"verdict":       "MID",
			"reasoning":     "denied by officer",
			"status":        "rejected",
		})
	}))
	defer server.Close()

	verdict, _, reason, err := offloadToValidate(server.URL, "diff")
	if err != nil {
		t.Fatalf("offloadToValidate() error = %v", err)
	}
	if verdict != "block" || !strings.Contains(reason, "denied") {
		t.Fatalf("verdict=%q reason=%q", verdict, reason)
	}
}

func TestOffloadToValidateUnreachableBackend(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	url := server.URL
	server.Close() // now unreachable

	_, _, _, err := offloadToValidate(url, "diff")
	if err == nil {
		t.Fatal("expected error for unreachable backend")
	}
}

func TestOffloadToValidateNon200Submit(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
	}))
	defer server.Close()

	_, _, _, err := offloadToValidate(server.URL, "diff")
	if err == nil || !strings.Contains(err.Error(), "HTTP 500") {
		t.Fatalf("error = %v, want HTTP 500", err)
	}
}

func TestGetGitDiffOutsideRepo(t *testing.T) {
	dir := t.TempDir()
	old, _ := os.Getwd()
	defer os.Chdir(old) //nolint:errcheck
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	if _, err := getGitDiff("changes"); err == nil {
		t.Fatal("expected error outside git repo")
	}
}

func TestGitContextOutsideRepo(t *testing.T) {
	dir := t.TempDir()
	old, _ := os.Getwd()
	defer os.Chdir(old) //nolint:errcheck
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	repo, _ := gitContext()
	if repo == "" {
		t.Fatal("repo should fall back to 'unknown', got empty")
	}
}

func TestScanInEmptyRepoAllows(t *testing.T) {
	dir := t.TempDir()
	run := func(args ...string) {
		out, err := exec.Command("git", append([]string{"-C", dir}, args...)...).CombinedOutput()
		if err != nil {
			t.Fatalf("git %v: %v\n%s", args, err, out)
		}
	}
	run("init", "-q")
	old, _ := os.Getwd()
	defer os.Chdir(old) //nolint:errcheck
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	// No staged changes -> empty diff -> allow verdict printed, nil error.
	if err := Scan([]string{"--backend", "http://127.0.0.1:1", "--json"}); err != nil {
		t.Fatalf("Scan() error = %v", err)
	}
}

func TestScanDetectsStagedSecretAndBlocks(t *testing.T) {
	dir := t.TempDir()
	run := func(args ...string) {
		out, err := exec.Command("git", append([]string{"-C", dir}, args...)...).CombinedOutput()
		if err != nil {
			t.Fatalf("git %v: %v\n%s", args, err, out)
		}
	}
	run("init", "-q")
	if err := os.WriteFile(filepath.Join(dir, "secret.txt"), []byte("password = \"hunter2\"\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	run("add", ".")
	old, _ := os.Getwd()
	defer os.Chdir(old) //nolint:errcheck
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	// Hardcoded-password builtin pattern fires on staged content -> HIGH ->
	// local block without needing a backend.
	err := Scan([]string{"--backend", "http://127.0.0.1:1", "--json"})
	if err == nil || !strings.Contains(err.Error(), "push blocked") {
		t.Fatalf("Scan() error = %v, want push blocked", err)
	}
}

func TestFetchWritesCacheFiles(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"buckets": map[string]any{
				"A1": []map[string]any{{
					"id": "r1", "rule_name": "R", "pattern": "X",
					"logic": "REGEX", "remediation": "fix",
				}},
			},
		})
	}))
	defer server.Close()

	dir := t.TempDir()
	old, _ := os.Getwd()
	defer os.Chdir(old) //nolint:errcheck
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	if err := Fetch([]string{"--backend", server.URL}); err != nil {
		t.Fatalf("Fetch() error = %v", err)
	}
	for _, f := range []string{".pg/cache/manifest.yaml", ".pg/cache/builtin.yaml"} {
		if _, err := os.Stat(filepath.Join(dir, f)); err != nil {
			t.Fatalf("expected %s to exist: %v", f, err)
		}
	}
}
