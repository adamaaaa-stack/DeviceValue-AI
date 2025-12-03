# DeviceValue AI

AI-powered device valuation platform built with Next.js, Supabase, and Google Gemini AI.

![DeviceValue AI](https://via.placeholder.com/1200x630/0f172a/10b981?text=DeviceValue+AI)

## Features

- 🤖 **AI-Powered Valuation** - Uses Google Gemini AI to analyze device photos and specs
- 📸 **Photo Analysis** - Upload device photos for damage detection
- 📊 **Market Comparison** - Real-time pricing data from multiple marketplaces
- 📄 **PDF Export** - Generate professional valuation reports
- 🔗 **Social Sharing** - Share your valuations on TikTok, Instagram, and X
- 🔐 **Authentication** - Secure login/signup with Supabase

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 1.5 Flash
- **PDF**: jsPDF

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google AI API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  profile_pic TEXT,
  clout_score INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  storage TEXT,
  ram TEXT,
  accessories TEXT,
  photos TEXT[] DEFAULT '{}',
  ai_value_min NUMERIC,
  ai_value_max NUMERIC,
  confidence INTEGER,
  damage_analysis TEXT,
  suggested_listing TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- History table
CREATE TABLE history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id),
  valuation_result JSONB,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard table
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  clout_score INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for device photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('device-photos', 'device-photos', true);
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── signup/route.ts
│   │   ├── device/
│   │   │   ├── history/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── valuate/route.ts
│   │   ├── leaderboard/route.ts
│   │   ├── market/comparison/route.ts
│   │   └── share/route.ts
│   ├── dashboard/page.tsx
│   ├── login/page.tsx
│   ├── market/page.tsx
│   ├── settings/page.tsx
│   ├── signup/page.tsx
│   ├── upload/page.tsx
│   ├── valuation/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CloutLeaderboard.tsx
│   ├── MarketComparisonTable.tsx
│   ├── Navbar.tsx
│   ├── PDFExportButton.tsx
│   ├── PhotoUpload.tsx
│   ├── SocialShareButtons.tsx
│   ├── SpecsForm.tsx
│   └── ValuationCard.tsx
├── context/
│   └── AuthContext.tsx
└── lib/
    ├── gemini.ts
    └── supabase.ts
```

## Pages

1. **Landing Page** (`/`) - Hero section, features, CTA
2. **Login** (`/login`) - User authentication
3. **Signup** (`/signup`) - New user registration
4. **Upload** (`/upload`) - Device photo & specs input
5. **Valuation** (`/valuation`) - AI valuation results
6. **Market** (`/market`) - Market comparison data
7. **Dashboard** (`/dashboard`) - User profile, devices, leaderboard
8. **Settings** (`/settings`) - Account & notification settings

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/signup` | POST | Create new user |
| `/api/auth/login` | POST | User login |
| `/api/device/upload` | POST | Upload device photo & specs |
| `/api/device/valuate` | POST | AI valuation via Gemini |
| `/api/device/history` | GET | Fetch user's devices |
| `/api/market/comparison` | GET | Market price data |
| `/api/leaderboard` | GET | Global rankings |
| `/api/share` | POST | Generate share content |

## License

MIT

