# Pravara Infotech Frontend Content Audit

This README helps you identify **demo/placeholder content** you should review and update before considering the frontend production-ready.

Original site reference:
- https://pravarainfotech.in/Frontend/index

## Priority 1 (update first)

These are the highest-impact items that still look like template/demo behavior.

1. Testimonials with placeholder client identities on Home page
   - File: `index.html`
   - Replace names and companies like:
     - John Doe / Acme Corp
     - Jane Smith / BetaTech
     - Michael Lee / TechVentures
   - Keep only real client approvals with permission.

2. Contact form is currently demo-only (no backend submission)
   - Files: `contact.html`, `js/script.js`
   - Current behavior: form submission is intercepted in JavaScript and shows a success toast after timeout.
   - Update needed: connect to real API/email service (or server endpoint), add validation and failure handling.

3. Newsletter forms are demo-only
   - Files: all pages with `.newsletter-form`, plus `js/script.js`
   - Current behavior: prevents default submit and shows a local success toast.
   - Update needed: connect to Mailchimp/Brevo/SendGrid/custom backend.

4. Social links are placeholders
   - Files: all footer sections in HTML pages
   - Current state: `href="#"`
   - Update needed: replace with actual Facebook/LinkedIn/Instagram/X URLs or remove icons you do not use.

5. Footer policy links are placeholders
   - Files: all footer sections in HTML pages
   - Current state: `Privacy Policy`, `Terms of Service`, `Cookie Policy` all use `href="#"`
   - Update needed: create legal pages and link properly.

## Priority 2 (SEO and brand consistency)

1. Open Graph URL domain mismatch (`.com` vs `.in`)
   - Files: `index.html`, `about.html`, `career.html`, `services.html`
   - Current meta tags use `https://pravarainfotech.com...`
   - If your live domain is `.in`, update all `og:url` to `.in` paths.

2. Verify all metadata per page
   - Files: all HTML pages
   - Check: title, description, OG image, Twitter description.
   - Ensure each page has unique metadata and correct URL.

3. Year in footer
   - Files: all HTML pages
   - Current state: `2025`
   - Update to current year or server-side dynamic year.

## Priority 3 (business accuracy checks)

These may be real already, but should be verified for trust and compliance.

1. Counters/statistics
   - Files: `index.html`, `about.html`, `collaborations.html`
   - Examples: 100+ projects, 50+ clients, 95% satisfaction, CSR counts.
   - Update only to values you can defend.

2. Team profiles and images
   - File: `about.html`
   - Verify names, roles, and image rights (`team-*.jpg`).

3. Portfolio/project claims
   - File: `index.html`
   - Confirm each showcased project is genuine and approved for public display.

4. Collaboration/CSR claims
   - File: `collaborations.html`
   - Ensure partner names, outcomes, and counts are factually accurate and permitted.

5. Careers section
   - File: `career.html`
   - Verify that open positions are active and apply links go to real application flow.

## Quick search commands (to find placeholders fast)

Run from project root:

```bash
rg -n "href=\"#\"|action=\"#\"|John Doe|Jane Smith|Acme Corp|BetaTech|TechVentures|og:url|All rights reserved"
```

## Suggested rollout order

1. Replace testimonial placeholders and all `href="#"` links.
2. Connect contact/newsletter forms to real backend services.
3. Fix `og:url` domain consistency with your final live domain.
4. Validate every claim (stats, projects, collaborations, team).
5. Final pass for legal links, year, and SEO metadata.

## Optional next improvement

After content cleanup, add these for production quality:
- reCAPTCHA/hCaptcha on contact form
- analytics events for CTA clicks and form submits
- sitemap.xml and robots.txt
- canonical tags on each page
