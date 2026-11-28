package internal

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestLoadConfigDefaults(t *testing.T) {
	dir := t.TempDir()
	old, _ := os.Getwd()
	defer os.Chdir(old) //nolint:errcheck
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	cfg, err := LoadConfig("", "")
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Backend == "" || cfg.Mode != "changes" {
		t.Fatalf("defaults = %+v", cfg)
	}
}

func TestLoadConfigFlagsOverrideEnv(t *testing.T) {
	t.Setenv("PG_BACKEND", "http://env")
	t.Setenv("PG_MODE", "full")
	cfg, err := LoadConfig("http://flag", "changes")
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Backend != "http://flag" || cfg.Mode != "changes" {
		t.Fatalf("flags should win: %+v", cfg)
	}
}

func TestLoadConfigEnvOverridesFile(t *testing.T) {
	dir := t.TempDir()
	old, _ := os.Getwd()
	defer os.Chdir(old) //nolint:errcheck
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(".pg.yaml", []byte("backend: http://file\nmode: full\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	t.Setenv("PG_BACKEND", "http://env")
	cfg, err := LoadConfig("", "")
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Backend != "http://env" || cfg.Mode != "full" {
		t.Fatalf("env/file merge = %+v", cfg)
	}
}

func TestLoadConfigRejectsBadMode(t *testing.T) {
	if _, err := LoadConfig("", "bogus"); err == nil {
		t.Fatal("expected error for invalid mode")
	}
}

func TestLoadConfigRejectsBadYAML(t *testing.T) {
	dir := t.TempDir()
	old, _ := os.Getwd()
	defer os.Chdir(old) //nolint:errcheck
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(".pg.yaml", []byte("backend: [unclosed"), 0o644); err != nil {
		t.Fatal(err)
	}
	if _, err := LoadConfig("", ""); err == nil {
		t.Fatal("expected error for invalid YAML")
	}
}

func TestShouldExcludePath(t *testing.T) {
	ex := ExcludeConfig{
		Files: []string{"*.lock", "secrets.txt"},
		Paths: []string{"vendor/", "dist/"},
	}
	cases := []struct {
		path string
		want bool
	}{
		{"app/main.go", false},
		{"pnpm-lock.yaml", false}, // *.lock does not match .yaml
		{"go.sum.lock", true},
		{"config/secrets.txt", true},
		{"vendor/lib/x.go", true},
		{"dist/bundle.js", true},
		{"vendorx/file.go", false}, // prefix must match path segment start
	}
	for _, c := range cases {
		if got := shouldExcludePath(c.path, ex); got != c.want {
			t.Errorf("shouldExcludePath(%q) = %v, want %v", c.path, got, c.want)
		}
	}
}

func TestParseDiffMultipleHunksAndFiles(t *testing.T) {
	diff := strings.Join([]string{
		"diff --git a/a.go b/a.go",
		"+++ b/a.go",
		"@@ -1,1 +1,2 @@",
		" ctx",
		"+added1",
		"+added2",
		"diff --git a/b.py b/b.py",
		"+++ b/b.py",
		"@@ -10,0 +11,1 @@",
		"+added3",
		"-removed",
	}, "\n")
	got := parseDiff(diff)
	if len(got) != 3 {
		t.Fatalf("parseDiff() = %d lines, want 3: %#v", len(got), got)
	}
	if got[0].File != "a.go" || got[0].Line != 2 {
		t.Errorf("got[0] = %#v", got[0])
	}
	if got[2].File != "b.py" || got[2].Line != 11 {
		t.Errorf("got[2] = %#v", got[2])
	}
}

func TestParseDiffIgnoresAddedLinesBeforeFileHeader(t *testing.T) {
	diff := "+orphan\n+++ b/x.go\n@@ -0,0 +1 @@\n+real\n"
	got := parseDiff(diff)
	if len(got) != 1 || got[0].Text != "real" {
		t.Fatalf("parseDiff() = %#v", got)
	}
}

func TestParseDiffDeletedFileStillTracks(t *testing.T) {
	diff := "diff --git a/old.go b/old.go\n+++ /dev/null\n@@ -1 +0,0 @@\n-gone\n"
	got := parseDiff(diff)
	if len(got) != 0 {
		t.Fatalf("parseDiff() = %#v, want no added lines", got)
	}
}

func TestScanEntropySkipsContextAndRemovedLines(t *testing.T) {
	// 40 chars from the entropy scanner's [A-Za-z0-9+/=] alphabet with wide
	// character distribution keeps Shannon entropy above the 3.5 threshold
	// (repeating "aB3$x" scores ~3.48 and is skipped).
	long := "kQ9mZ2vL8xR4pT7wN1cY6sD3fH0bG5jK8lP2"
	diff := strings.Join([]string{
		"+++ b/f.txt",
		"@@ -1 +1 @@",
		" " + long,  // context line: not counted
		"-" + long, // removed: not counted
		"+" + long, // added: counted
	}, "\n")
	violations := ScanEntropy(diff)
	if len(violations) != 1 {
		t.Fatalf("ScanEntropy() = %d violations, want 1: %#v", len(violations), violations)
	}
}

func TestScanEntropyCommonTokenSkipped(t *testing.T) {
	token := "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" // 30 a's, common token prefix
	diff := "+++ b/f\n@@ -0,0 +1 @@\n+" + token + "\n"
	if got := ScanEntropy(diff); len(got) != 0 {
		t.Fatalf("ScanEntropy() = %#v, want none for common token", got)
	}
}

func TestLoadScannablePatternsFallsBackToHardcoded(t *testing.T) {
	dir := t.TempDir()
	old, _ := os.Getwd()
	defer os.Chdir(old) //nolint:errcheck
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	patterns, err := LoadScannablePatterns(
		filepath.Join(dir, "missing-manifest.yaml"),
		filepath.Join(dir, "missing-builtin.yaml"),
	)
	if err != nil {
		t.Fatal(err)
	}
	if len(patterns) != 2 {
		t.Fatalf("hardcoded fallback = %d patterns, want 2", len(patterns))
	}
}

func TestWriteYAMLFileCreatesParentDirs(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "nested", "deep", "out.yaml")
	if err := writeYAMLFile(path, map[string]string{"k": "v"}); err != nil {
		t.Fatal(err)
	}
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(data), "k: v") {
		t.Fatalf("yaml = %q", data)
	}
}
