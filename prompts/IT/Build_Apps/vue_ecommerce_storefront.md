# Vue E-Commerce Storefront

Build a modern, high-performance E-Commerce Storefront using Vue.js designed for speed, SEO, and seamless user experience.

---

## Role & Context

You are a senior frontend engineer specializing in Vue 3 and modern web performance, tasked with creating a headless commerce frontend.

**Tech Stack (Fixed):**
- **Frontend:** Vue 3 (Composition API), Nuxt 3 (SSR), Tailwind CSS
- **State Management:** Pinia
- **Backend (Headless):** Shopify Storefront API or a mock REST/GraphQL API
- **Deployment:** Vercel or Netlify (Edge Functions)

---

## Product Requirements

### Core Features

#### 1) Product Catalog & Search
Enable users to find products quickly.
- Dynamic homepage with featured products and categories.
- Product Listing Page (PLP) with server-side pagination, sorting, and faceted filtering (price, size, color).
- Full-text search with auto-suggest dropdown.

#### 2) Product Details & Cart
Drive conversions through clear information.
- Product Detail Page (PDP) with image galleries, variant selection, and customer reviews.
- Slide-out shopping cart (mini-cart) accessible from anywhere.
- Add/Remove items, update quantities, and display real-time subtotal calculations.

#### 3) Checkout Flow
Streamline the purchase process.
- Multi-step checkout (Shipping, Payment, Review) or integration with a hosted checkout (e.g., Shopify Checkout).
- Guest checkout and user account creation.
- Order confirmation page with summary.

---

## Technical Requirements

### Architecture
A Nuxt 3 application utilizing Server-Side Rendering (SSR) for the initial load to ensure excellent SEO and performance (Core Web Vitals). Subsequent navigation will be handled as a Single Page Application (SPA). Pinia handles global state like the Cart and User Session.

### Data Model (Frontend Representation)
- **Product:** ID, Handle (Slug), Title, Description, Images[], PriceRange, Variants[]
- **Variant:** ID, Title, Price, SKU, AvailableForSale, SelectedOptions[]
- **Cart:** ID, Lines[], EstimatedTotal, CheckoutUrl
- **LineItem:** ID, Quantity, Merchandise (Variant)

### API Design (GraphQL expected)
- `products(first: 10, query: $query)` - Fetch catalog.
- `productByHandle(handle: $handle)` - Fetch PDP data.
- `cartCreate(input: $input)` - Initialize a new cart session.
- `cartLinesAdd(cartId: $id, lines: $lines)` - Add items.

### Security Requirements
- Securely store API tokens (Storefront API is public, but admin tokens must remain on the server).
- Prevent XSS by sanitizing any user-generated content (e.g., reviews).
- Implement CSRF protection for any form submissions.

### Performance Requirements
- Lighthouse score of 90+ for Performance, Accessibility, and SEO.
- Implement lazy loading for images (using Nuxt Image) and components below the fold.

---

## Implementation Details

### Nuxt 3 Features
Leverage Nuxt 3's built-in capabilities:
- Auto-imports for components and composables.
- `useFetch` and `useAsyncData` for server-side data fetching.
- File-based routing (`pages/index.vue`, `pages/products/[handle].vue`).

### Styling & UI
Use Tailwind CSS and headless UI components.
- Configure Tailwind for custom brand colors and typography.
- Build reusable UI primitives: `Button`, `Input`, `Modal`, `Accordion`.

---

## UI/UX Requirements

### Key Pages/Views
1. **Homepage:** Hero banner, promotional grids, 'New Arrivals' carousel.
2. **PLP (Category Page):** Sidebar filters, grid layout for products, pagination controls.
3. **PDP (Product Page):** Large image viewer, sticky 'Add to Cart' bar on mobile.
4. **Checkout:** Clean, distraction-free form layout.

### Design Principles
- Mobile-first approach. 70%+ of traffic will be mobile.
- High-quality, optimized product imagery.
- Clear visual hierarchy guiding the user to the primary CTA (Add to Cart/Checkout).

---

## Testing & Validation

### Unit Tests
- Test Pinia store logic (cart calculations) using Vitest.
- Test reusable UI components using Vue Test Utils.

### E2E Tests
- Use Playwright to test critical user journeys: Searching for a product -> Adding to cart -> Proceeding to checkout.

---

## Deployment & Operations

### Environment Setup
- `.env` file containing `NUXT_PUBLIC_SHOPIFY_DOMAIN` and `NUXT_PUBLIC_STOREFRONT_TOKEN`.

### Deployment Steps
1. Push to GitHub to trigger Vercel/Netlify build.
2. Configure build command (`npm run build`) and output directory (`.output/public`).
3. Setup custom domain and SSL.

### Monitoring & Logging
- Integrate Vercel Analytics (or similar) for real-user monitoring (RUM).

---

## Documentation Requirements

Generate:
- [ ] README.md with setup instructions
- [ ] Tailwind configuration documentation (design system)
- [ ] Lighthouse performance report summary
- [ ] Deployment checklist

---

## Constraints & Limitations

- Application bundle size must be minimized (use dynamic imports for heavy libraries).
- Maximum of 3 third-party scripts loaded on the initial page load.

---

## Success Criteria

The project is complete when:
- [ ] Users can browse categories and view product details via SSR.
- [ ] Users can add items to their cart, and state persists across reloads.
- [ ] Lighthouse scores exceed 90 across all categories.
- [ ] The site is responsive and functional on major browsers and mobile devices.
- [ ] Deployment to Vercel/Netlify succeeds.

---

## Tags

`#project` `#vue` `#nuxt` `#ecommerce` `#frontend` `#build` `#ssr`

---

**Version:** 1.0 | **Created:** 2024-03-05 | **Updated:** 2024-03-05