# Pixel Studios — Official App

> 🌐 **Live web preview:** https://useeman32-design.github.io/pixel_studios/

The digital front door of **Pixel Studios**, a creative technology and printing company in Gusau, Zamfara State, Nigeria.

**Design. Print. Build. Grow.**

Built with **React Native + Expo** — one codebase running on **iOS, Android and Web**.

## Design

A premium, editorial, minimal creative-tech interface:

- Deep charcoal + off-white neutrals with **electric lime** reserved for primary actions, active states and brand accents
- **Outfit** geometric typeface, large confident headlines, 8pt spacing scale
- Pixel-grid **P** brand mark (app icon + in-app logo component)

## Screens

| Screen | Route |
| --- | --- |
| Home — editorial hero, quick actions, featured | `/` |
| Services — 4 visual studios | `/services` |
| Service detail | `/service/[id]` |
| Signature NFC Smart Business Card | `/nfc` |
| Shop — search, categories, products | `/shop` |
| Product detail — selectors + Add to Cart | `/product/[id]` |
| Start a Project — agency intake flow | `/start` |
| Orders + tracking timeline | `/orders`, `/order/[id]` |
| NFC digital profile | `/nfc-profile` |
| Portfolio — selected work | `/portfolio` |
| Studio chat | `/chat` |
| Profile | `/profile` |

Bottom navigation: **Home · Services · Shop · Orders · Profile** with a floating lime **Start Project** button.

## Running locally

```bash
npm install
npx expo start        # press w for web, a for Android, i for iOS
```

## Deploying the web preview

```bash
bash scripts/deploy-web.sh
```

Builds the static web export (with `baseUrl: /pixel_studios`), prepares clean-URL routes + `404.html` + `.nojekyll`, and force-pushes to the `gh-pages` branch that GitHub Pages serves.

## Before going live

Update the placeholder contact details in `src/constants/contact.ts`:

- Phone & WhatsApp number
- Email address
- Instagram / Facebook handles
- Location & Google Maps link

Prices and product copy live in `src/data/products.ts`. Demo orders in `src/data/orders.ts`.

## Tech

- Expo SDK 57 · expo-router · TypeScript
- expo-linear-gradient · expo-font (Outfit)
- WhatsApp deep links for orders, quotes and project briefs
- EAS build profiles (`eas.json`) for iOS/Android

---

© Pixel Studios — Gusau, Zamfara State, Nigeria
