# CMS SECURITY SPECIFICATION

## 1. Security & XSS Prevention

1. **HTML & Rich-Text Sanitization**:
   - All CMS content summaries and broadcast message bodies are sanitized server-side to prevent XSS (Cross-Site Scripting) or malicious script injections.
2. **Server-Side RBAC Enforcement**:
   - Non-admin client publish or broadcast attempts are rejected with `HTTP 403 Forbidden`.
