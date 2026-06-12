HEAD
# 🛒 GreenCart – Fresh Grocery E-Commerce App

A full-featured grocery e-commerce web app built with **React 18**, **Tailwind CSS 3**, and **React Router v6**.

---

## 📁 Project Structure

```
greencart/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── cart/
│   │   │   └── CartSidebar.jsx        # Slide-in cart drawer
│   │   ├── checkout/
│   │   │   └── CheckoutPage.jsx       # 4-step checkout flow
│   │   ├── home/
│   │   │   └── HomePage.jsx           # Hero, categories, featured products
│   │   ├── layout/
│   │   │   ├── Navbar.jsx             # Fixed top navbar with search
│   │   │   └── Footer.jsx             # Footer with links + newsletter
│   │   └── product/
│   │       ├── ProductCard.jsx        # Reusable product card
│   │       ├── ShopPage.jsx           # Product listing with filters
│   │       └── ProductDetailPage.jsx  # Full product detail view
│   ├── context/
│   │   └── AppContext.jsx             # Global state (cart, search, wishlist)
│   ├── data/
│   │   └── products.js                # 28 mock products across 7 categories
│   ├── pages/
│   │   ├── AccountPage.jsx            # Auth + profile
│   │   └── WishlistPage.jsx           # Saved products
│   ├── App.jsx                        # Router + layout setup
│   ├── index.js                       # React entry point
│   └── index.css                      # Tailwind + custom styles
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **Homepage** | Auto-rotating hero banner, category grid, featured/organic/fresh product sections, testimonials |
| **Shop Page** | Category filter sidebar (desktop), horizontal tabs (mobile), sort options, search results |
| **Product Detail** | Full info, quantity selector, add to cart / buy now, wishlist, related products |
| **Cart Sidebar** | Slide-in drawer, quantity controls, delivery progress bar, totals |
| **Checkout** | 4-step flow: Review → Address → Payment → Confirmation |
| **Wishlist** | Heart toggle on all cards, dedicated wishlist page |
| **Account** | Mock login/signup, profile editor, orders & addresses tabs |
| **Search** | Full-text search across name, category, description |
| **Persistence** | Cart + wishlist saved in localStorage |

---

## 🛠 Tech Stack

- **React 18** – hooks (useReducer, useContext, useEffect, useState)
- **React Router v6** – file-based routing with URL param sync
- **Tailwind CSS 3** – utility-first responsive styling
- **Context API** – global state (no Redux needed)
- **react-hot-toast** – toast notifications
- **LocalStorage** – client-side persistence

---

## 📦 Mock Data

`src/data/products.js` contains:
- **28 products** across 7 categories (Fruits, Vegetables, Dairy, Bakery, Snacks, Beverages, Organic)
- Each product has: name, price, originalPrice, unit, stock, rating, reviews, image, badge, description, tags
- 3 hero banner slides
- 4 feature highlights
- 3 customer testimonials

---

## 🎨 Design Tokens

| Token | Value |
|---|---|
| Primary green | `#16a34a` (Tailwind `primary-600`) |
| Accent orange | `#FF6B35` |
| Font | Inter (Google Fonts) |
| Card radius | `1rem` (rounded-2xl) |
| Card shadow | `shadow-sm` with `hover:shadow-lg` |

---

## 🔌 Backend / API Integration

This project uses mock data. To connect a real backend:

1. Replace `src/data/products.js` exports with `fetch()` calls to your API
2. Update `AppContext.jsx` → replace `PRODUCTS` import with async data fetching
3. Add a `useEffect` + loading/error states to `ShopPage` and `HomePage`
4. Wire the checkout form to a real payment gateway (Razorpay, Stripe, etc.)

Example API swap in `AppContext.jsx`:
```js
useEffect(() => {
  fetch('/api/products')
    .then(r => r.json())
    .then(data => setProducts(data));
}, []);
```
