# Deployment

## Purpose

Velocity Success Factor career readiness engine for CV-to-JD scoring, five-dimension gap analysis, and personalised learning paths.

## Production

- Production URL: https://zencloudau.github.io/vsf-match/
- Deployment platform: GitHub Pages
- Source branch: main
- Build command: npm run build
- Output directory: dist
- Ecosystem role: Career readiness and learning-path routing tool

## Notes

This repo currently uses a GitHub Actions Pages workflow. The workflow also commits generated root assets back into the repository. That strategy works but should be reviewed before standardising the estate.

## Health Check

- Confirm GitHub Pages deployment remains healthy after workflow runs.
- Review whether generated assets should continue to be committed to source.
- Confirm API keys are only provided through repository secrets.
- Confirm the public landing page clearly routes to the match experience.
