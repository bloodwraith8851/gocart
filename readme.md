# GoCart - Multi-Tenant E-commerce Platform

<p align="center">
  <img src="assets/gs_logo.jpg" alt="GoCart Logo" width="120"/>
</p>

<p align="center">
  <b>Multi-vendor e-commerce platform for the modern web</b><br>
  <i>Shop, sell, and manage with ease. Built with Next.js, Prisma, Clerk, and more.</i>
</p>

<p align="center">
  <a href="#getting-started"><img src="https://img.shields.io/badge/Getting%20Started-blue"/></a>
  <a href="#technology-stack"><img src="https://img.shields.io/badge/Tech%20Stack-green"/></a>
  <a href="#features"><img src="https://img.shields.io/badge/Features-orange"/></a>
  <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-purple"/></a>
  <a href="#api-reference"><img src="https://img.shields.io/badge/API%20Reference-yellow"/></a>
  <a href="#contributing"><img src="https://img.shields.io/badge/Contributing-brightgreen"/></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blueviolet"/></a>
</p>

---

## 📑 Quick Links
- [Demo](#demo)
- [Getting Started](#getting-started)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Data Flow & Graphs](#data-flow--graphs)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License & Credits](#license--credits)
- [Contact](#contact)

---

## 📂 File & Data Flow Overview

```mermaid
flowchart TD
    APPLAYOUT["app/layout.jsx"]
    STOREPROVIDER["app/StoreProvider.js"]
    PUBLICLAYOUT["app/(public)/layout.jsx"]
    ADMINLAYOUT["app/admin/layout.jsx"]
    STORELAYOUT["app/store/layout.jsx"]
    PUBLICPAGES["app/(public)/*"]
    ADMINPAGES["app/admin/*"]
    STOREPAGES["app/store/*"]
    NAVBAR["components/Navbar.jsx"]
    FOOTER["components/Footer.jsx"]
    PRODUCTCARD["components/ProductCard.jsx"]
    ORDERITEM["components/OrderItem.jsx"]
    ADDRESSMODAL["components/AddressModal.jsx"]
    ADMINCOMP["components/admin/*"]
    STORECOMP["components/store/*"]
    STORE["lib/store.js"]
    CARTSLICE["lib/features/cart/cartSlice.js"]
    PRODUCTSLICE["lib/features/product/productSlice.js"]
    ADDRESSSLICE["lib/features/address/addressSlice.js"]
    RATINGS["lib/features/rating/ratingSlice.js"]
    CLERK["ClerkProvider"]
    MIDDLEWARE["middleware.ts"]
    PRISMA["lib/prisma.js"]
    SCHEMA["prisma/schema.prisma"]
    ASSETS["assets/assets.js"]
    APPLAYOUT --> CLERK
    CLERK --> STOREPROVIDER
    STOREPROVIDER --> STORE
    STORE --> CARTSLICE
    STORE --> PRODUCTSLICE
    STORE --> ADDRESSSLICE
    STORE --> RATINGS
    APPLAYOUT --> PUBLICLAYOUT
    APPLAYOUT --> ADMINLAYOUT
    APPLAYOUT --> STORELAYOUT
    PUBLICLAYOUT --> NAVBAR
    PUBLICLAYOUT --> FOOTER
    PUBLICLAYOUT --> PUBLICPAGES
    ADMINLAYOUT --> ADMINCOMP
    ADMINLAYOUT --> ADMINPAGES
    STORELAYOUT --> STORECOMP
    STORELAYOUT --> STOREPAGES
    PUBLICPAGES -->|"import/use"| PRODUCTCARD
    PUBLICPAGES -->|"import/use"| ORDERITEM
    PUBLICPAGES -->|"import/use"| ADDRESSMODAL
    ADMINPAGES -->|"import/use"| ADMINCOMP
    STOREPAGES -->|"import/use"| STORECOMP
    NAVBAR -->|"router.push"| PUBLICPAGES
    NAVBAR -->|"router.push"| PUBLICPAGES
    PUBLICPAGES -->|"useSelector"| CARTSLICE
    PUBLICPAGES -->|"useSelector"| PRODUCTSLICE
    PUBLICPAGES -->|"useSelector"| ADDRESSSLICE
    PUBLICPAGES -->|"useSelector"| RATINGS
    ADMINPAGES -->|"useSelector"| PRODUCTSLICE
    STOREPAGES -->|"useSelector"| PRODUCTSLICE
    STOREPAGES -->|"useSelector"| CARTSLICE
    STOREPAGES -->|"fetch"| ASSETS
    STOREPAGES -->|"fetch"| PRISMA
    ADMINPAGES -->|"fetch"| PRISMA
    MIDDLEWARE --> CLERK
    PRISMA --> SCHEMA
    STOREPROVIDER -->|"Provider"| PUBLICPAGES
    STOREPROVIDER -->|"Provider"| ADMINPAGES
    STOREPROVIDER -->|"Provider"| STOREPAGES
    PUBLICPAGES -->|"router.push"| PUBLICPAGES
    STOREPAGES -->|"router.push"| STOREPAGES
    ADMINPAGES -->|"router.push"| ADMINPAGES
```
*Figure: Major file/module connections, Redux state, Clerk auth, and navigation/data flow. Arrows show imports, usage, and data/API flow between files.*

## Purpose and Scope
GoCart is a sophisticated multi-vendor e-commerce platform that enables customers to shop from multiple stores, store owners to manage their own products and orders, and admins to oversee the entire marketplace. The system provides three distinct user experiences:
- **Public Interface**: Customer browsing, shopping cart management, and order placement
- **Store Owner Interface**: Product management, inventory control, and order fulfillment
- **Admin Interface**: Platform management, store approval, and system-wide analytics

The platform supports complex multi-vendor scenarios, including separate order processing per store, individual store ratings, coupon management, and comprehensive order tracking across different vendors.

---

## 🛠️ Technology Stack

GoCart leverages a modern, robust technology stack to deliver a seamless, scalable, and secure multi-vendor e-commerce experience. Each technology is carefully chosen for its strengths and role in the platform:

| Layer                | Technology            | Version     | Purpose & Why We Use It                                                                 |
|----------------------|----------------------|-------------|----------------------------------------------------------------------------------------|
| **Framework**        | Next.js              | 15.3.5      | Full-stack React framework with App Router for SSR, routing, and API routes             |
| **Frontend**         | React                | 19.0.0      | Component-based UI library for building interactive interfaces                          |
| **State Management** | Redux Toolkit        | 2.8.2       | Predictable, scalable global state management                                           |
| **Authentication**   | Clerk                | 6.32.0      | Secure, modern authentication and user/session management                               |
| **Database**         | PostgreSQL           | -           | Reliable, scalable relational database                                                 |
| **ORM**              | Prisma               | -           | Type-safe database access and schema management                                         |
| **Styling**          | Tailwind CSS         | 4.x         | Utility-first CSS for rapid, responsive, and consistent UI                              |
| **Icons**            | Lucide React         | 0.525.0     | Modern, customizable icon library                                                      |
| **Notifications**    | React Hot Toast      | 2.5.2       | Toast notifications for user feedback                                                  |
| **Charts**           | Recharts             | 3.1.2       | Data visualization for analytics and dashboards                                        |
| **Date Handling**    | Date-fns             | 4.1.0       | Modern date utility functions                                                          |

---

## 🖼️ Screenshots & GIFs

| Public Store | Store Owner Dashboard | Admin Panel |
|:---:|:---:|:---:|
| ![](assets/hero_product_img1.png) | ![](assets/hero_product_img2.png) | ![](assets/happy_store.webp) |

> _Want to showcase your store or feature? Submit your screenshots or GIFs via a pull request!_

---

## 🎯 Purpose & Scope
GoCart is a next-generation, multi-vendor e-commerce platform designed for:
- **Customers:**
  - Browse and search products across multiple stores
  - Manage shopping cart and place orders
  - Track orders and leave product/store reviews
- **Store Owners:**
  - Create and manage their own store
  - Add, edit, and manage products and inventory
  - Fulfill and track orders, view analytics
- **Admins:**
  - Approve and manage stores
  - Oversee platform-wide analytics and user management
  - Manage coupons, promotions, and platform settings

GoCart is built for scalability, modularity, and a seamless user experience, making it ideal for both small businesses and large marketplaces.

---

## ✨ Features

| Feature                        | Customer | Store Owner | Admin |
|------------------------------- |:--------:|:-----------:|:-----:|
| Product Browsing & Search      |    ✅    |      ✅      |   ✅  |
| Shopping Cart                  |    ✅    |      ✅      |   ❌  |
| Order Placement & Tracking     |    ✅    |      ✅      |   ✅  |
| Store Management               |    ❌    |      ✅      |   ✅  |
| Product Management             |    ❌    |      ✅      |   ✅  |
| Order Fulfillment              |    ❌    |      ✅      |   ✅  |
| Analytics Dashboard            |    ❌    |      ✅      |   ✅  |
| Reviews & Ratings              |    ✅    |      ✅      |   ✅  |
| Coupon Management              |    ❌    |      ❌      |   ✅  |
| Store Approval                 |    ❌    |      ❌      |   ✅  |
| User Management                |    ❌    |      ❌      |   ✅  |
| Responsive Design              |    ✅    |      ✅      |   ✅  |

---

## 🏗️ Architecture
GoCart is architected for modularity and scalability, with clear separation between public, store owner, and admin interfaces. Centralized state management and a robust database schema ensure data consistency and performance.

### High-Level System Architecture
```mermaid
flowchart TB
    subgraph Frontend
        Public["Public Interface"]
        StoreOwner["Store Owner Interface"]
        Admin["Admin Interface"]
    end
    subgraph Backend
        Redux["Redux Store"]
        Prisma["Prisma ORM"]
        DB["PostgreSQL DB"]
        Clerk["Clerk Auth"]
    end
    Public --> Redux
    StoreOwner --> Redux
    Admin --> Redux
    Redux --> Prisma
    Prisma --> DB
    Public -.-> Clerk
    StoreOwner -.-> Clerk
    Admin -.-> Clerk
    Clerk --> Redux
```
*Figure: Modular interfaces, centralized state, and authentication flow.*

### User Flow Diagram
```mermaid
flowchart TD
    Visitor["Visitor"] -->|"Sign Up / Sign In"| Clerk["Clerk Auth"]
    Clerk -->|"Authenticated"| Customer["Customer"]
    Clerk -->|"Authenticated as Store Owner"| StoreOwner["Store Owner"]
    Clerk -->|"Authenticated as Admin"| Admin["Admin"]
    Customer -->|"Browse, Shop, Order"| PublicUI["Public Interface"]
    StoreOwner -->|"Manage Store, Products, Orders"| StoreUI["Store Owner Interface"]
    Admin -->|"Approve Stores, Manage Platform"| AdminUI["Admin Interface"]
```
*Figure: User authentication and interface access flow.*

---

## 🔍 How It Works

### 1. Customer Checkout Flow
A customer browses products, adds items to the cart, and completes checkout with address and payment selection.

```mermaid
sequenceDiagram
    participant C as Customer
    participant UI as Public UI
    participant Redux as Redux Store
    participant API as API/Server Actions
    participant DB as Database
    C->>UI: Browse products
    UI->>Redux: Fetch product list
    Redux->>API: GET /api/products
    API->>DB: Query products
    DB-->>API: Products data
    API-->>Redux: Products data
    Redux-->>UI: Show products
    C->>UI: Add to cart
    UI->>Redux: Update cart state
    C->>UI: Checkout
    UI->>Redux: Collect address/payment
    Redux->>API: POST /api/orders
    API->>DB: Create order
    DB-->>API: Order confirmation
    API-->>Redux: Order confirmation
    Redux-->>UI: Show order success
```

### 2. Store Approval (Admin)
A new store is created by a user and must be approved by an admin before going live.

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Store Owner UI
    participant API as API/Server Actions
    participant DB as Database
    participant Admin as Admin UI
    U->>UI: Create store
    UI->>API: POST /api/stores
    API->>DB: Save store (pending)
    Admin->>Admin: Review pending stores
    Admin->>API: POST /api/admin/approve
    API->>DB: Update store status (active)
    Admin-->>UI: Store approved
```

### 3. Admin Analytics Flow
Admin views platform-wide analytics, including sales, orders, and store performance.

```mermaid
sequenceDiagram
    participant Admin as Admin
    participant AdminUI as Admin UI
    participant API as API/Server Actions
    participant DB as Database
    Admin->>AdminUI: Open dashboard
    AdminUI->>API: GET /api/analytics
    API->>DB: Aggregate sales/orders data
    DB-->>API: Analytics data
    API-->>AdminUI: Analytics data
    AdminUI-->>Admin: Show charts/metrics
```

---

## 🚀 Deployment Guide

### Deploying to Vercel (Recommended)
1. **Fork or clone the repository** to your GitHub account.
2. **Create a new project** on [Vercel](https://vercel.com/).
3. **Connect your GitHub repo** and import the GoCart project.
4. **Set environment variables** in the Vercel dashboard:
   - `DATABASE_URL` (your PostgreSQL connection string)
   - `DIRECT_URL` (optional, for direct DB access)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (from Clerk dashboard)
   - `CLERK_SECRET_KEY` (from Clerk dashboard)
   - Any other variables from `.env.example`
5. **Provision a PostgreSQL database** (e.g., [Neon](https://neon.tech/), [Supabase](https://supabase.com/), [Railway](https://railway.app/)).
6. **Run database migrations**:
   - You may need to run `npx prisma migrate deploy` in the Vercel dashboard or via a GitHub Action.
7. **Deploy!** Vercel will build and deploy your app automatically.

### Other Platforms
- **Netlify:** Similar steps, but ensure Next.js SSR is supported (Netlify Edge Functions or similar).
- **Custom VPS:**
  - Clone the repo, set up Node.js, install dependencies, configure environment, and use a process manager (e.g., PM2).

### Tips
- Always keep your environment variables secure.
- Use a managed PostgreSQL service for reliability.
- For production, set `NODE_ENV=production`.
- Monitor logs and errors via your hosting provider’s dashboard.

> _Need help? Open an issue or discussion on GitHub!_

---

## 👤 User Role Access Flow

```mermaid
%% User role access and permissions
flowchart TB
    U[User] -->|Browse, Shop| Public[Public Interface]
    U -->|Owns Store| StoreOwner[Store Owner Interface]
    U -->|Is Admin| Admin[Admin Interface]
    StoreOwner -->|Manages| Store[Store]
    Store -->|Sells| Product[Product]
    Public -->|Places| Order[Order]
    Admin -->|Approves| Store
    Admin -->|Manages| Coupon[Coupon]
    Admin -->|Views| Analytics[Analytics]
```
*Figure: User role flow and permissions across the platform.*

---

## 🗄️ Detailed Data Model (Entity Relationship)

```mermaid
erDiagram
    USER ||--o{ RATING : writes
    USER ||--o{ ADDRESS : has
    USER ||--o| STORE : owns
    USER ||--o{ ORDER : places
    STORE ||--o{ PRODUCT : sells
    STORE ||--o{ ORDER : receives
    PRODUCT ||--o{ RATING : receives
    PRODUCT ||--o{ ORDERITEM : included_in
    ORDER ||--o{ ORDERITEM : contains
    ORDER ||--|| ADDRESS : ships_to
    ADDRESS }o--|| USER : belongs_to
    STORE ||--o{ COUPON : offers
    ORDER ||--o| COUPON : uses
```
*Figure: Entity relationship diagram for users, stores, products, orders, and coupons.*

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bloodwraith8851/gocart.git
   cd gocart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your database URL, Clerk keys, and other environment variables.

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

### Development Workflow

1. **Database Management**
   - Use Prisma Studio: `npx prisma studio`
   - Reset database: `npx prisma migrate reset`

2. **State Management**
   - Redux DevTools integration for debugging
   - Slice-based state organization

3. **Authentication**
   - Clerk dashboard for user management
   - Middleware-based route protection

## 🔧 Configuration

### Environment Variables
```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CURRENCY_SYMBOL="$"
```

### Database Configuration [22](#0-21) 

## 📊 Data Models

### Order Status Flow [23](#0-22) 

### Payment Methods [24](#0-23) 

## 🎯 Features in Detail

### Customer Experience
- Browse products by categories
- Advanced search functionality
- Shopping cart with quantity management
- Secure checkout process
- Order tracking and history
- Product reviews and ratings

### Seller Dashboard
- Store profile management
- Product inventory control
- Order fulfillment tracking
- Sales analytics and reporting
- Customer review management

### Administrative Control
- Store approval workflow
- Platform-wide analytics
- Coupon and promotion management
- User account oversight
- Revenue tracking

## 🛡️ Security Features

- **Authentication**: Clerk-based secure authentication
- **Route Protection**: Middleware-based access control
- **Data Validation**: Prisma schema validation
- **SQL Injection Protection**: Prisma ORM safety
- **CSRF Protection**: Next.js built-in protection

## 📱 Responsive Design

- Mobile-first responsive design
- Tailwind CSS utility classes
- Flexible grid layouts
- Touch-friendly interfaces
- Progressive Web App capabilities

## 🔄 State Management Architecture

### Redux Store Structure [25](#0-24) 

The application uses Redux Toolkit for predictable state management with separate slices for different features, ensuring scalable and maintainable code architecture.

## Notes

This README provides a comprehensive overview of the GoCart e-commerce platform based on the current codebase structure. The project demonstrates modern web development practices with a focus on scalability, maintainability, and user experience. The multi-tenant architecture allows for easy expansion and customization for different business needs.

The platform currently uses dummy data for development purposes but is structured to integrate with real APIs and services for production deployment. The modular component architecture and type-safe database schema make it suitable for enterprise-level e-commerce solutions.

### Citations

**File:** app/layout.jsx (L1-7)
```javascript
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });
```

**File:** app/layout.jsx (L9-12)
```javascript
export const metadata = {
    title: "GoCart. - Shop smarter",
    description: "GoCart. - Shop smarter",
};
```

**File:** app/layout.jsx (L16-26)
```javascript
        <ClerkProvider>
            <html lang="en">
                <body className={`${outfit.className} antialiased`}>
                    <StoreProvider>
                        <Toaster />
                        {children}
                    </StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
```

**File:** lib/store.js (L1-15)
```javascript
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import productReducer from './features/product/productSlice'
import addressReducer from './features/address/addressSlice'
import ratingReducer from './features/rating/ratingSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            product: productReducer,
            address: addressReducer,
            rating: ratingReducer,
        },
    })
```

**File:** prisma/schema.prisma (L1-10)
```text
generator client {
    provider        = "prisma-client-js"
    previewFeatures = ["driverAdapters"]
}

datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
}
```

**File:** prisma/schema.prisma (L13-25)
```text
model User {
    id    String @id
    name  String
    email String
    image String
    cart  Json   @default("{}")

    // Relations
    ratings     Rating[]
    Address     Address[]
    store       Store?
    buyerOrders Order[]   @relation("BuyerRelation")
}
```

**File:** prisma/schema.prisma (L28-45)
```text
model Product {
    id          String   @id @default(cuid())
    name        String
    description String
    mrp         Float
    price       Float
    images      String[]
    category    String
    inStock     Boolean  @default(true)
    storeId     String
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt

    // Relations
    store      Store       @relation(fields: [storeId], references: [id], onDelete: Cascade)
    orderItems OrderItem[]
    rating     Rating[]
}
```

**File:** prisma/schema.prisma (L47-52)
```text
enum OrderStatus {
    ORDER_PLACED
    PROCESSING
    SHIPPED
    DELIVERED
}
```

**File:** prisma/schema.prisma (L54-57)
```text
enum PaymentMethod {
    COD
    STRIPE
}
```

**File:** prisma/schema.prisma (L60-79)
```text
model Order {
    id            String        @id @default(cuid())
    total         Float
    status        OrderStatus   @default(ORDER_PLACED)
    userId        String
    storeId       String
    addressId     String
    isPaid        Boolean       @default(false)
    paymentMethod PaymentMethod
    createdAt     DateTime      @default(now())
    updatedAt     DateTime      @updatedAt
    isCouponUsed  Boolean       @default(false)
    coupon        Json          @default("{}")
    orderItems    OrderItem[]

    // Relations
    user    User    @relation("BuyerRelation", fields: [userId], references: [id])
    store   Store   @relation(fields: [storeId], references: [id])
    address Address @relation(fields: [addressId], references: [id])
}
```

**File:** prisma/schema.prisma (L145-162)
```text
model Store {
    id          String   @id @default(cuid())
    userId      String   @unique
    name        String
    description String
    username    String   @unique
    address     String
    status      String   @default("pending")
    isActive    Boolean  @default(false)
    logo        String
    email       String
    contact     String
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt

    Product Product[]
    Order   Order[]
    user    User      @relation(fields: [userId], references: [id])
```

**File:** middleware.ts (L1-12)
```typescript
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

**File:** app/(public)/layout.jsx (L6-16)
```javascript
export default function PublicLayout({ children }) {

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
```

**File:** app/(public)/page.jsx (L8-18)
```javascript
export default function Home() {
    return (
        <div>
            <Hero />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
```

**File:** components/Navbar.jsx (L24-52)
```javascript
    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/">About</Link>
                        <Link href="/">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>
```

**File:** app/store/page.jsx (L23-28)
```javascript
    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Total Earnings', value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Total Ratings', value: dashboardData.ratings.length, icon: StarIcon },
    ]
```

**File:** components/store/StoreLayout.jsx (L29-39)
```javascript
    ) : isSeller ? (
        <div className="flex flex-col h-screen">
            <SellerNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <SellerSidebar storeInfo={storeInfo} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
```

**File:** app/admin/page.jsx (L21-26)
```javascript
    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]
```

**File:** components/admin/AdminLayout.jsx (L26-34)
```javascript
        <div className="flex flex-col h-screen">
            <AdminNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <AdminSidebar />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
```

**File:** lib/features/cart/cartSlice.js (L3-15)
```javascript
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
```

**File:** assets/assets.js (L31-31)
```javascript
export const categories = ["Headphones", "Speakers", "Watch", "Earbuds", "Mouse", "Decoration"];
```

**File:** app/StoreProvider.js (L6-13)
```javascript
export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
```

---

## 📚 API Reference
GoCart exposes a set of RESTful API endpoints and server actions for data access and management. Below are some example endpoints (expand as you add more):

| Endpoint                | Method | Description                        | Request Body / Params         | Response Example              |
|-------------------------|--------|------------------------------------|-------------------------------|-------------------------------|
| `/api/products`         | GET    | Get all products                   | -                             | `[ { id, name, price, ...} ]` |
| `/api/products/:id`     | GET    | Get product by ID                  | `id` (URL param)              | `{ id, name, price, ... }`    |
| `/api/orders`           | POST   | Create a new order                 | `{ cart, address, payment }`  | `{ orderId, status, ... }`    |
| `/api/orders/:id`       | GET    | Get order details                  | `id` (URL param)              | `{ orderId, items, ... }`     |
| `/api/stores`           | POST   | Create a new store                 | `{ name, description, ... }`  | `{ storeId, status, ... }`    |
| `/api/admin/approve`    | POST   | Approve a store (admin only)       | `{ storeId }`                 | `{ success: true }`           |

> _For a full list of endpoints and server actions, see the `/app/api/` directory and server action files._

---

## 🗺️ Roadmap
- [ ] RESTful API endpoints for all resources
- [ ] Real payment gateway integration (Stripe, PayPal, etc.)
- [ ] Storefront themes and customization
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Multi-language and localization support
- [ ] More admin controls and moderation tools
- [ ] Automated tests & CI/CD integration
- [ ] Webhooks and third-party integrations
- [ ] Performance and accessibility improvements

---

## 📝 License & Credits

<p align="left">
  <img src="https://img.shields.io/badge/License-MIT-blueviolet" alt="MIT License"/>
</p>

- **License:** MIT — see [LICENSE](LICENSE) for details.
- **Credits:**
  - Built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [Clerk](https://clerk.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), [Recharts](https://recharts.org/), [Date-fns](https://date-fns.org/), and more.
  - Project by [bloodwraith8851](https://github.com/bloodwraith8851) and contributors.

---

## 📬 Contact

- **Email:** [your-email@example.com](mailto:your-email@example.com)
- **GitHub Issues:** [Open an issue](https://github.com/bloodwraith8851/gocart/issues)
- **Twitter:** [@yourhandle](https://twitter.com/yourhandle)
- **Project Repo:** [GoCart on GitHub](https://github.com/bloodwraith8851/gocart)

> _We welcome feedback, questions, and collaboration!_

---

## ⚡ Performance & Security Notes

**Performance:**
- Uses Next.js Server-Side Rendering (SSR) for fast, SEO-friendly pages.
- Centralized state management with Redux Toolkit for efficient UI updates.
- Modular codebase and code-splitting for faster load times.
- Supports caching strategies for API/data fetching (can be extended for production).

**Security:**
- Clerk authentication for secure user/session management.
- Prisma ORM for type-safe, injection-resistant database access.
- Middleware-based route protection for admin/store areas.
- Data validation on both client and server.
- Environment variables for sensitive config (never hard-coded).

> _Always keep dependencies up to date and monitor for security advisories!_

---

## 📝 Changelog

| Version   | Date         | Changes                                      |
|-----------|--------------|----------------------------------------------|
| 1.0.0     | 2025-09-16   | Initial release: core features, multi-vendor |
| 1.1.0     | 2025-09-18   | Added admin dashboard, store approval        |
| 1.2.0     | 2025-09-20   | Improved documentation, added diagrams       |
| 1.3.0     | 2025-09-22   | Added deployment guide, FAQ, and roadmap     |

> _Contributors: Please update the changelog with each significant PR!_

---

## 🌟 Showcase / Used By

| Project/Company      | Description                        | Link                        |
|----------------------|------------------------------------|-----------------------------|
| _Your Project Here!_ | Example: Electronics marketplace   | [Demo](https://example.com) |

> _Are you using GoCart in production? Add your site here via a pull request!_

---

## 🌐 Internationalization (i18n)

GoCart is designed with future support for multiple languages in mind. To add or improve internationalization:

- **Recommended Libraries:**
  - [next-intl](https://github.com/amannn/next-intl) for Next.js projects
  - [react-i18next](https://react.i18next.com/) for React components
- **Translation Structure:**
  - Store translation files (e.g., `en.json`, `es.json`) in a `/locales` directory
  - Use language keys in all UI components
  - Detect and switch languages based on user preference or browser settings
- **Contributing:**
  - Want to add a new language? Fork the repo and submit your translation files via PR!

> _Help make GoCart accessible to users around the world!_

---
