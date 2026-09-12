# Audio Den - Flagship Electronics & Home Appliances E-Commerce

Audio Den is a modern, high-performance e-commerce platform for flagship smartphones, 4K Smart TVs, luxury sound systems, refrigerators, air conditioners, and home appliances.

## 🌟 Key Features

- **Official Business Information**:
  - **GSTIN**: `09AGHPG2164L1Z8`
  - **PAN**: `AGHPG2164L`
  - **Store**: 82/55/2 A Road, Tripathi Chauraha, New Katra, Prayagraj, UP - 211002
  - **Phone**: +91 9935102727
- **0% Interest Brand Finance Available**:
  - Full support for 13 finance partners: Bajaj Finance, HDB Finance, Poonawalla Finance, TVS Finance, DMI Finance, Chola Finance, IDFC Finance, Axio Finance, Home Credit, Benow Finance, Pine Labs, Innoviti Link, and Paytm.
  - Interactive EMI calculator for 3, 6, 9, and 12-month tenures.
  - 1-click WhatsApp showroom inquiry with pre-filled product details.
- **Real-Time Database & Multi-Tab Synchronization**:
  - Supabase Realtime synchronization and BroadcastChannel integration.
  - Instant catalog and category updates when admin adds or updates products.
- **Admin Dashboard**:
  - Product catalog management with custom on-the-fly categories and brands.
  - Live order management, customer inquiries, and banner management.
  - GST invoice generation with print preview.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, Framer Motion, Lucide Icons
- **State Management**: Zustand
- **Database / Realtime**: Supabase Client + IndexedDB / BroadcastChannel fallback
- **Routing**: React Router v7

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your credentials:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## 📦 Deployment

Run the automated packager for Hostinger or cloud hosting:
```powershell
powershell -ExecutionPolicy Bypass -File .\package-deploy.ps1
```
This produces:
- `audioden_hostinger_web.zip` (for direct upload to `public_html`)
- `audioden_full_deployment.zip` (full project bundle)
