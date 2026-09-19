# STOREFRONT MASTER TEMPLATE — DESIGN & ARCHITECTURE SYSTEM (DESIGN.md)

> **Document Version:** 1.0.0  
> **Target Framework:** Static HTML5 + TailwindCSS + Vanilla JS + Google Apps Script Backend  
> **Reference Aesthetic:** Motion.ai Minimalist Premium / Apple Modern High-Tech Studio

---

## 1. Executive Summary & Architecture Overview

This project serves as a **Master Blueprint** for building high-converting, low-maintenance digital storefronts. It operates with **zero recurring server costs**, requires no heavy backend frameworks, and automates order intake, inventory synchronization, customer emails, and order tracking via **Google Sheets & Google Apps Script**.

### High-Level Architecture
```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND STOREFRONT                  │
│  (Vercel / Netlify / Cloudflare Pages / Static CDN)    │
│  - Single-Page Application (index.html)                │
│  - Full-Width Responsive Edge-to-Edge Design           │
│  - Motion Prompt Card Hero & Instant Search            │
│  - Multi-Currency Crypto Checkout (USDT, SOL, BNB)     │
│  - Live Order Tracking & Status Modal                  │
└──────────────────────────┬─────────────────────────────┘
                           │ (fetch JSON / CORS)
                           ▼
┌────────────────────────────────────────────────────────┐
│                 SERVERLESS BACKEND API                 │
│         (Google Apps Script Web App Deployment)         │
│  - doGet: Live Catalog & Stock Sync + Order Tracking   │
│  - doPost: Order Intake, Stock Decrement & Email Alert │
│  - MailApp: Automated Credentials Delivery to Buyer   │
└──────────────────────────┬─────────────────────────────┘
                           │ (read/write)
                           ▼
┌────────────────────────────────────────────────────────┐
│                 DATABASE ENGINE (SHEETS)                │
│             (Google Spreadsheet Database)              │
│  - Tab 1: 'Products' (Live Inventory, Pricing, Copy)   │
│  - Tab 2: 'Orders' (Transactions, TxID, Status)       │
│  - Custom Admin Menu: 1-Click Verification & Dispatch  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Design Philosophy & Aesthetic Principles

1. **Full-Width Edge-to-Edge Layout**:
   - Never constrain the master container to narrow boxes (e.g. `max-w-7xl` or `1280px`).
   - Use fluid edge-to-edge widths (`w-full px-4 sm:px-8 lg:px-12 xl:px-16`) so wide laptop and desktop displays breathe naturally without awkward blank margins.
2. **Logo & Navigation Alignment ("Mepet ke Pinggir")**:
   - **Far Left**: Brand Logo icon pinned to the left edge margin.
   - **Center**: Clean, minimal navigation links with balanced spacing.
   - **Far Right**: Primary CTA / Cart pill button pinned to the right edge margin.
3. **Typography & Hierarchy**:
   - **Display Font**: Modern sans-serif (Inter or system Apple font stack).
   - **Display Headline Rule**: Strictly **2 lines** on laptop/desktop viewports. Never end display titles with trailing periods.
   - **Descender Clipping Prevention**: When using text gradients (`-webkit-background-clip: text`), always apply `padding-bottom: 0.12em;` and line-height `leading-[1.2]` so descender characters (`g`, `y`, `p`, `j`, `q`) never clip at the bottom.
4. **Editorial Anti-Slop Policy**:
   - **Strictly No Dashes in Copy**: Do not use em-dashes (`—`) or en-dashes (`–`) in public sales copywriting or headers.
   - Keep copywriting direct, confident, and 100% English.

---

## 3. Color Palette & Design Tokens

| Token | Class / Value | Purpose |
| :--- | :--- | :--- |
| **Brand Primary** | `#000000` / `#161617` / `#1D1D1F` | Deep contrast text, primary buttons, borders |
| **Brand Secondary** | `#52525B` / `#6E6E73` | Subtitles, secondary descriptions, body text |
| **Brand Tertiary** | `#86868B` / `#A1A1AA` | Captions, micro-labels, dates, metadata |
| **Brand Surface** | `#F5F5F7` / `#FAFAFA` | Soft card backgrounds, badges, inputs |
| **Brand Background**| `#FAFAFA` to `#FFFFFF` | Page base background |
| **Border Neutral** | `#E5E5E7` / `#E4E4E7` | Subtle divider lines and card borders |
| **Success Emerald** | `#10B981` / `#D4EDDA` | Order completed, live active stock |
| **Warning Amber** | `#F59E0B` / `#FFF3CD` | Pending payment verification |

### Key Gradients
- **Apple Heading Gradient**:
  ```css
  background: linear-gradient(180deg, #1D1D1F 35%, #56565A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-bottom: 0.12em;
  ```
- **Simple Access Gradient** (Multi-color rainbow accent):
  ```css
  background: linear-gradient(90deg, #FF2D2D 0%, #FF6A00 22%, #FFD21F 42%, #55E6FF 62%, #168BFF 82%, #302CFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-bottom: 0.12em;
  ```
- **Ambient Glow Background** (Slow motion floating orb layer):
  ```css
  background: radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.07) 0%, rgba(236, 72, 153, 0.05) 35%, transparent 70%);
  ```

---

## 4. Layout & Component Specifications

### 4.1 Header (`#main-header`)
- **Sticky Blur**: `sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/50`.
- **Layout**: `w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-18 py-3.5 flex items-center justify-between`.
- **Elements**:
  - Left: Logo icon (`h-8 sm:h-9 w-auto`). No extraneous subtitle text.
  - Center: Nav links (`Products`, `How It Works`, `FAQ`, `Order History`).
  - Right: Black pill button (`Cart (0) →`), hamburger toggle for mobile.

### 4.2 Hero Section
- **Spacing**: Compact `pt-10 pb-8 md:pt-14 md:pb-10` to guarantee the 4 trust cards below stay **above the fold**.
- **Display Headline**:
  ```html
  <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.2]">
    <span class="block apple-heading-gradient md:whitespace-nowrap pb-1.5">Premium digital products</span>
    <span class="block simple-access-gradient font-extrabold tracking-tight pb-1.5 mt-0.5 sm:mt-1">Simple access</span>
  </h1>
  ```
- **Motion-Style Prompt Card**:
  - Large rounded container: `max-w-3xl mx-auto rounded-3xl bg-white/95 backdrop-blur-md border border-neutral-200/90 p-4 sm:p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)]`.
  - Top: Spacious search input with clear / browse action.
  - Bottom: Internal toolbar with `+` category picker on left, `Track Order` and circular submit arrow button `↑`/`→` on right.

### 4.3 Centered Value Trust Cards (Above The Fold)
- **Container**: `grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center`.
- **Card Styling**: `flex flex-col items-center justify-center text-center p-3.5 sm:p-4 rounded-2xl bg-neutral-50/60 hover:bg-neutral-50 border border-neutral-100 transition-all`.
- **4 Key Pillars**:
  1. ⚡ **Fast Delivery**: Direct to your email
  2. 🔒 **Secure Checkout**: USDT, SOL, BNB, BTC
  3. 🛡️ **100% Guaranteed**: Full term replacement
  4. 📦 **Live Order Tracking**: Real-time status check

### 4.4 Product Catalog Grid (`#products`)
- **Grid Layout**: Fluid responsive columns:
  - Mobile: `grid-cols-1`
  - Small Tablets: `sm:grid-cols-2`
  - Desktops: `md:grid-cols-3 lg:grid-cols-4`
  - Ultra-Wide Displays: `2xl:grid-cols-5`
- **Features**: Live text filter, category pills (`AI Video`, `Text & Code`, `Productivity`, `Streaming`), sorting (Featured, Price Low/High, Stock Availability).

### 4.5 Checkout Drawer & Modal
- Slide-over cart drawer with direct crypto selection (USDT BEP20, Solana, BNB, Bitcoin).
- Direct wallet address copying + QR code visualization.
- Mandatory Customer Email + TxID input.
- Real-time client-side total recalculation.

### 4.6 Footer
- Clean copyright: `© 2026 BRAND STORE. All rights reserved.`
- Subtle trust badge: `● Verified Instant Digital Delivery`.
- **Strictly No Public Admin Links**: Never expose database sync buttons, sheet URLs, or developer options to public visitors.

---

## 5. Google Sheets Database Schema

The database relies on a single Google Spreadsheet with two essential tabs:

### Tab 1: `Products`
| Column | Header | Data Type | Description / Example |
| :---: | :--- | :--- | :--- |
| **A** | `id` | String | Unique product slug (`chatgpt-plus`, `claude-max`) |
| **B** | `name` | String | Product display name (`ChatGPT Pro 20x`) |
| **C** | `category` | String | `video`, `text-code`, `productivity`, or `streaming` |
| **D** | `duration` | String | Plan term (`1 Month`, `6 Month • Full Warranty`) |
| **E** | `price` | Number | Integer USD price (`35`, `80`, `120`) |
| **F** | `stock` | Number | Quantity remaining (`15`, `0` = Out of Stock) |
| **G** | `description`| String | Value proposition copy |
| **H** | `image` | URL | Direct image link (`https://...png`) |
| **I** | `featured` | Boolean | `TRUE` or `FALSE` (highlights card) |
| **J** | `access_info`| String | Default template credentials for buyer |

### Tab 2: `Orders`
| Column | Header | Data Type | Description / Example |
| :---: | :--- | :--- | :--- |
| **A** | `Timestamp` | DateTime | Auto-recorded order time |
| **B** | `Order ID` | String | 6-character unique ID (`NOL-A9F2`) |
| **C** | `Customer Email` | String | Customer's delivery email |
| **D** | `Payment Method` | String | Crypto network (`USDT (BEP20)`, `Solana`) |
| **E** | `Items Summary` | String | Formatted items ordered + quantities |
| **F** | `Total Amount` | String | Total USD paid (`$80.00`) |
| **G** | `TxID / Hash` | String | Blockchain transaction ID submitted by buyer |
| **H** | `Wallet Sent To` | String | Receiving wallet address |
| **I** | `Status` | String | `Pending Verification` or `Completed (Delivered)` |
| **J** | `Delivered Access Details` | String | Credentials sent to buyer email & order history |

---

## 6. How to Clone This Master for a New Website

Follow this step-by-step checklist to launch a new brand from this template in under 15 minutes:

### Step 1: Duplicate Repository & Files
1. Copy the folder `nole-shop/` to a new directory (e.g., `brand-store/`).
2. Open `index.html` and perform a global replacement:
   - Replace brand name: `NOLE STORE` ➔ `YOUR BRAND STORE`
   - Replace email: `support@nolestore.com` ➔ `support@yourbrand.com`
   - Replace crypto receiving wallet addresses in the `WALLETS` JS object.
   - Replace logo image URLs in the header and footer (`<img src="...">`).

### Step 2: Setup New Google Sheet Database
1. Open [Google Sheets](https://sheets.new) and name your new spreadsheet.
2. Go to menu **Extensions ➔ Apps Script**.
3. Replace the entire editor contents with the code from `google-apps-script.js`.
4. In the Apps Script toolbar dropdown, select function `setupInitialDatabase` and click **Run**.
   - *Authorize permissions when prompted.*
   - Two formatted tabs (`Products` and `Orders`) will be created automatically.
5. In the toolbar dropdown, select function `onOpen` and click **Run**.
   - Return to your Google Sheet: the **`🚀 YOUR BRAND ADMIN`** menu is now active.

### Step 3: Deploy Backend Web App
1. In the Apps Script editor, click **Deploy ➔ New deployment**.
2. Select type **Web app**.
   - **Description**: `Production Storefront API`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(crucial for checkout & stock sync without login)*
3. Click **Deploy** and copy the resulting Web App URL (`https://script.google.com/macros/s/.../exec`).

### Step 4: Link Web App URL to Frontend
1. In `index.html`, locate line ~1475:
   ```javascript
   const DEFAULT_SHEET_API_URL = "PASTE_YOUR_NEW_DEPLOYMENT_URL_HERE";
   ```
2. Save the file. The frontend will now automatically sync inventory, record orders, and query order status against your new spreadsheet.

### Step 5: Publish Publicly (Vercel)
1. Initialize git and push to a new GitHub repository:
   ```cmd
   git init
   git add .
   git commit -m "Initial store deployment"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```
2. Import the repository into [Vercel.com](https://vercel.com) and click **Deploy**.
3. Under **Settings ➔ Domains**, attach your custom domain from Hostinger, Cloudflare, or GoDaddy.

---

## 7. Master Admin Operation Workflow

1. **Customer Places Order**:
   - Customer submits checkout with their email and Blockchain TxID.
   - Order is instantly recorded into row of `Orders` tab with yellow status `Pending Verification`.
   - Customer receives automated "Order Received" confirmation email.
2. **Admin Verifies Payment**:
   - Admin checks incoming transaction on blockchain wallet/explorer.
   - Admin opens Google Sheet, clicks the order row in tab `Orders`.
   - Admin enters the product credentials in Column J (*Delivered Access Details*).
   - Admin clicks menu: **`🚀 BRAND ADMIN` ➔ `✅ Approve & Deliver Access (Selected Row)`**.
3. **Instant Auto-Delivery**:
   - Customer receives official branded credentials email automatically.
   - Sheet status turns green: `Completed (Delivered)`.
   - Customer tracking their order on the website immediately sees green status and can 1-click copy their access details.
