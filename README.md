# Pixel Studios — Official App

> 🌐 **Live web preview:** https://useeman32-design.github.io/pixel_studios/

The digital front door of **Pixel Studios**, a modern creative & technology company based in Gusau, Zamfara State, Nigeria.

> **Design. Print. Build. Grow.** — creative, printing and technology solutions for modern businesses.

Built with **React Native + Expo** — one codebase running on **iOS, Android and Web**.

## ✨ Features

- **Home** — hero, three simple customer paths (Design / Print / Digital), featured services, popular products, portfolio preview, testimonials and CTAs
- **Services** — 7 divisions (Creative, Print, Digital, Smart, Marketing, Systems, AI) each with a full service list and instant WhatsApp enquiry
- **Shop** — product catalog with Naira (₦) pricing, options, quantity selection and ordering via WhatsApp
- **Start a Project** — guided 4-step wizard that compiles a complete project brief and delivers it straight to the Pixel Studios WhatsApp
- **Portfolio** — filterable project gallery across branding, print, packaging, web, apps, systems, NFC and marketing
- **About** — vision, mission, values, team and the "idea to business" story
- **Contact** — WhatsApp-first contact hub with phone, email, Instagram, Facebook, location and business hours

## 🚀 Running the app

```bash
npm install
npx expo start
```

Then press `w` for web, `a` for Android or `i` for iOS (or scan the QR code with Expo Go).

## 🌐 GitHub Pages deployment

The web build is deployed to GitHub Pages from the `gh-pages` branch:

```bash
npx expo export --platform web        # builds dist/ (baseUrl is set to /pixel_studios)
# push the contents of dist/ to the gh-pages branch
```

Notes:
- `app.json` sets `experiments.baseUrl: "/pixel_studios"` so all assets resolve under the repo subpath.
- Root-level route files are copied to `<route>/index.html` so deep links like `/shop/` work.
- `.nojekyll` is included so GitHub serves the `_expo` asset folder untouched.

## 📱 Builds (EAS)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview   # APK for testing
eas build --platform all --profile production    # Store builds
```

## ⚙️ Before going live

Update the placeholder contact details in `src/constants/contact.ts`:

- Phone & WhatsApp number
- Email address
- Instagram / Facebook handles
- Exact location & Google Maps link

Prices and product details live in `src/data/products.ts` — adjust freely.

## 🧱 Tech stack

- Expo SDK 57 + expo-router (file-based routing)
- TypeScript
- expo-linear-gradient, expo-font (Space Grotesk + Inter)
- WhatsApp deep links for orders, quotes and project briefs

---

© Pixel Studios — Gusau, Zamfara State, Nigeria
