# Recommended Security Headers

For deployments (Vercel / Nginx) configure the following:

| Header | Value |
| --- | --- |
| Content-Security-Policy | `default-src ${SELF}` (tighten per asset origins) |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `geolocation=(), microphone=()` |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` |

These mitigate clickjacking, MIME sniffing, and mixed-content risks.

## Example: vercel.json

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

## Rolling out CSP safely
Start with `Content-Security-Policy-Report-Only` to collect violations without
breaking the site, review reports, then switch to the enforcing header once the
policy is clean.
