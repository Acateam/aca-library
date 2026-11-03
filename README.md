# DOL · Aca Library

A static website deployed on **GitHub Pages**, using **Firebase Authentication (Google)** and **Cloud Firestore** for a shared, access-controlled link library. No build pipeline required.

## Roles

| Role | Browse links | Create/edit/delete | Grant/revoke admins |
|---|---|---|---|
| Member | Yes | No | No |
| Admin | Yes | Yes | No |
| Primary Admin (`owner`) | Yes | Yes | Yes |

**Members** are any verified Google accounts whose email belongs to the allowed company domain. An Admin is an account with a `roles/{email}` document with field `role: "admin"`. The Primary Admin has `role: "owner"`. Only owner can grant or revoke other admins; owner cannot remove/replace itself in the website.

## Setup (about 10 steps)

1. Create a [Firebase project](https://console.firebase.google.com/). Choose a project ID you recognize.
2. In **Project settings → Your apps**, register a **Web** app and copy the configuration object into `firebase-config.js` (replace the `REPLACE_...` values). Firebase web configuration is public; **never paste a service-account private key here**.
3. In **Authentication → Sign-in method**, enable **Google**.
4. In **Firestore Database**, create a database (production mode), then open **Rules**.
5. In both `firebase-config.js` and `firestore.rules`, replace `example.com` with the *real company email domain*, without `@`. **Important:** `firestore.rules` uses an escaped regex, e.g. `dolenglish\\.vn` in the source text. Do not accidentally retain `example.com`.
6. Paste `firestore.rules` into Firebase **Firestore → Rules** and **Publish**. The site is not secure until the rules are deployed. See Firebase's [Security Rules guide](https://firebase.google.com/docs/firestore/security/get-started).
7. Create the **first Primary Admin** exactly once in **Firestore → Data**: create collection `roles`, document ID equal to the Primary Admin's *full, lowercase company email* (e.g. `lead@your-domain.com`) and add string field `role` with value `owner`. This is a **database setup step**, not an email stored in code.
8. Create a new GitHub repository, upload everything from this folder to its root, then enable **Settings → Pages → Deploy from a branch → main / (root)**. GitHub provides a URL like `https://YOUR-USERNAME.github.io/aca-library/`.
9. In **Firebase → Authentication → Settings → Authorized domains**, add your GitHub Pages hostname (e.g. `YOUR-USERNAME.github.io`) without `https://` or any path. If using a custom domain, add it too. Note: depending on the Firebase OAuth flow / browser third-party cookie policy, GitHub Pages with Firebase popup auth may require additional OAuth configuration; test login in your actual browsers.
10. Sign in with Primary Admin's Google company account, choose **Manage Library** (gear icon) to add other admins by email. Add a category and links, then sign in with a different company account and verify that person can read but cannot edit.

### Custom domain

You can initially use the standard GitHub Pages URL. Later choose a short domain such as `library.your-company-domain.com` (illustrative only); configure GitHub Pages **Custom domain** and the DNS record, then allow that hostname in Firebase Authorized domains. You can create a `CNAME` file containing just the actual hostname.

### Test locally

Run in this folder: `python3 -m http.server 8000` and open `http://localhost:8000`. Add `localhost` to Firebase authorized domains for local login if needed. **Opening `index.html` via `file://` will not reliably work with JavaScript modules.**

## Data model

`nodes/{generatedId}` documents have: `kind` (`folder` or `link`), `parentId` (null for top-level), `name`, `url` (empty for folders), `icon`, timestamps. A folder may contain nested folders and HTTPS links. New projects start with **no categories or links**.

`roles/{lowercaseEmail}` documents contain `{ role: 'owner' | 'admin' }`. A missing role record means **Member**. The owner changes only via Firebase Console; only one owner is recommended. **Do not publicly publish internal URL lists or credentials in the GitHub repository.**

Nicknames and avatars are stored only in browser `localStorage`, not shared across devices.

## Security notes

- GitHub Pages serves **public HTML, JS, CSS**. Access protection is enforced by **Firebase Security Rules on Firestore data**, not by hiding UI controls. A signed-out viewer may inspect public source code but cannot read protected Firestore data.
- The `hd` hint sent to Google login is a *user-experience hint*, **not an access control**. The domain is verified again in application logic and in Firestore security rules.
- Cloud Firestore rules are authoritative for the Admin role. Member UI hiding is convenience only.
- Keep the Firebase project/Firestore console available to your actual IT owner as emergency recovery. Never store a Firebase Admin service account credential in GitHub.
- Protect the destination files in Google Sheets/Notion/Apps Script independently; the library does **not** grant access to those destinations.
- The small dolphin illustration in `assets/dol-mark.svg` is an **original placeholder, not a verified official DOL logo**. Replace it with the approved brand asset if available.
- The Notionists avatars are loaded from the DiceBear service and need Internet access. If you need a company-approved artwork library, host licensed graphics locally instead.
- Deleting a folder removes all nested entries. For production usage, consider automatic exports/backups. This starter is intended for an internal pilot, not a compliance-certified enterprise deployment.

## Smoke test

- [ ] Unconfigured config shows setup screen, not a fake login.
- [ ] Personal Gmail can authenticate but is denied library access.
- [ ] Company member can see library but not edit.
- [ ] Owner can grant admin; admin can create, edit, delete.
- [ ] Admin cannot grant or revoke another admin.
- [ ] New link appears after refresh and on another member's device.
- [ ] Search finds nested links and categories.
- [ ] Links open in **same tab**.
- [ ] Mobile layout is usable.
