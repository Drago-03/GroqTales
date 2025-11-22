# Security Policy

## Supported Versions

GroqTales follows a rolling support window for the latest minor line plus the two previous patch
releases. Older minors are considered End of Security Support (EoSS) once two newer minor versions
ship or critical architectural changes occur.

| Version | Status               | Support Level                 | Notes                        |
| ------- | -------------------- | ----------------------------- | ---------------------------- |
| 1.2.5   | ✅ Active (Latest)   | Full (features + security)    | Current production release   |
| 1.2.4   | ✅ Active (Previous) | Security & critical bug fixes | Upgrade recommended          |
| 1.2.3   | ✅ Maintained        | Security (critical only)      | Upgrade to 1.2.5             |
| 1.2.2   | ⚠️ Limited Support   | Critical security only        | Upgrade to 1.2.5 recommended |
| < 1.2.0 | ❌ EoSS              | No updates                    | Please upgrade immediately   |

Note: Version 1.2.x series introduces extensive story customization features (70+ parameters),
improved UI/UX, and important bug fixes. Upgrading to 1.2.5 is strongly recommended for the best
experience.

## Reporting a Vulnerability

If you discover a security vulnerability in GroqTales, we appreciate your help in disclosing it to
us in a responsible manner. Please follow these steps to report a vulnerability:

1. **Do Not Publicly Disclose**: Do not report security vulnerabilities through public GitHub
   issues, social media, or other public forums.
2. **Contact Us Privately**: Email us at [mantejarora@gmail.com](mailto:mantejarora@gmail.com) with
   details of the vulnerability. Please include:
   - A detailed description of the issue.
   - Steps to reproduce the vulnerability.
   - Any potential impact of the vulnerability.
   - Suggestions for mitigation, if any.
3. **Response Time**: We will acknowledge your report within 48 hours and strive to provide a
   detailed response within 7 days, including our assessment and planned next steps.
4. **Disclosure Policy**: After the vulnerability is addressed, we will coordinate with you to
   publicly disclose the issue if necessary, giving credit for the discovery unless you prefer to
   remain anonymous.

## Scope

Security reporting covers: backend API routes, smart contracts in `contracts/`, build & deployment
scripts, server-side rendering logic, authentication/session handling, NFT minting flows, and
storage of user-generated content. Frontend cosmetic issues, denial of service via intentionally
excessive legitimate usage, or vulnerabilities in experimental / clearly marked “disabled” Web3 code
paths are out of scope unless they lead to data exposure or privilege escalation.

## Vulnerability Handling Process

1. Report received (private email)
2. Triage & severity classification (see table below) – target within 48h
3. Reproduction + impact assessment
4. Patch development on private branch
5. Optional coordinated disclosure window (up to 30 days for High/Critical if complex)
6. Release new patched version & update CHANGELOG (Security section)
7. Public disclosure (if warranted) and reporter credit

### Severity Classification (OWASP Inspired)

| Severity      | Example Impact                                       | Target Fix Window |
| ------------- | ---------------------------------------------------- | ----------------- |
| Critical      | Remote code execution, private key compromise        | 24–72h            |
| High          | Auth bypass, privilege escalation, data exfiltration | 3–5 days          |
| Medium        | Stored XSS, SSRF with limited scope                  | < 14 days         |
| Low           | Reflected XSS, minor info disclosure                 | < 30 days         |
| Informational | Best practice deviation                              | As capacity       |

## Security Practices

- We regularly update dependencies to address known vulnerabilities.
- We employ secure coding practices and conduct code reviews with a focus on security.
- We use automated tools to scan for vulnerabilities in our codebase and dependencies.
- We encourage the use of secure development lifecycle practices among our contributors.

## Protecting Your Data

GroqTales takes the security of user data seriously. We implement industry-standard measures to
protect data both in transit and at rest. If you have concerns about data privacy or security,
please refer to our Privacy & Data Handling documentation (coming soon) or contact us directly.

## Third-Party & Dependency Security

- Dependencies are monitored during routine dependency update cycles.
- High/Critical advisories trigger an expedited patch release.
- Smart contract dependencies and compiler versions are pinned in `foundry.toml` / related config.

If you find a vulnerability in a third-party package we use that directly affects GroqTales, you may
still report it—include the upstream advisory if available.

## Secure Development Guidelines (Abbreviated)

- Principle of Least Privilege in service/API keys
- Input validation & output encoding for user content rendering
- Separation of client/server only data (no secrets in client bundles)
- Avoid dynamic `eval` / code generation in runtime paths
- Rate limiting and basic abuse detection for public endpoints

Full secure coding checklist will be published in future documentation.

Thank you for helping keep GroqTales and our community safe!
