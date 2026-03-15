You are a senior full-stack software engineer and system architect. Your task is to build a production-ready SaaS platform called **TradeReportz**—an AI-powered trading journal and performance analytics platform that helps traders track trades, analyze behavior, and improve performance through AI-generated insights.

The codebase must be production-ready, secure, scalable, and follow clean modular architecture with no technical debt.

---

## TECH STACK (Non-Negotiable)

**Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn UI  
**Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)  
**AI:** HuggingFace Inference API (free models)  
**Payments:** Razorpay  
**Email:** Resend  
**Deployment:** Vercel (frontend), Supabase hosted (backend)

---

## PROJECT STRUCTURE (Enforce This Exactly)

```
app/
  dashboard/
  trades/
  analytics/
  reports/
  settings/

components/
  ui/
  charts/
  forms/

lib/
  supabaseClient.ts
  aiClient.ts
  utils.ts

services/
  tradeService.ts
  analyticsService.ts
  aiService.ts
  reportService.ts

api/
  trades/
  reports/
  analytics/
```

---

## DATABASE SCHEMA

Create these PostgreSQL tables in Supabase:

**Users**
- id (UUID, primary key)
- email (TEXT)
- name (TEXT)
- subscription_plan (TEXT)
- currency (TEXT)
- timezone (TEXT)
- created_at (TIMESTAMP)

**Trades**
- id (UUID, primary key)
- user_id (UUID, foreign key → users.id)
- symbol, asset_type, direction (TEXT)
- entry_price, exit_price, stop_loss, take_profit, position_size, risk_percent (NUMERIC)
- strategy, setup_tag, timeframe, session (TEXT)
- emotion_before, emotion_after, mistakes, notes (TEXT)
- pnl (NUMERIC, auto-calculated)
- trade_date (DATE)
- created_at (TIMESTAMP)

**Trade_Screenshots**
- id (UUID, primary key)
- trade_id (UUID, foreign key → trades.id)
- image_url (TEXT)

**AI_Reports**
- id (UUID, primary key)
- user_id (UUID, foreign key → users.id)
- report_type (TEXT)
- report_content (JSONB)
- created_at (TIMESTAMP)

**Goals**
- id (UUID, primary key)
- user_id (UUID, foreign key → users.id)
- goal_type, goal_value (TEXT, NUMERIC)
- created_at (TIMESTAMP)

**Achievements**
- id (UUID, primary key)
- user_id (UUID, foreign key → users.id)
- achievement_type (TEXT)
- achieved_at (TIMESTAMP)

**Subscriptions**
- id (UUID, primary key)
- user_id (UUID, foreign key → users.id)
- plan, status (TEXT)
- razorpay_customer_id, razorpay_subscription_id (TEXT)
- created_at (TIMESTAMP)

---

## SECURITY & ROW LEVEL SECURITY (RLS)

**Enable RLS on all tables.**

**Policies:**
- Trades table: Users can only read/write trades where `user_id = auth.uid()`
- AI_Reports table: Users can only read reports where `user_id = auth.uid()`
- Goals, Achievements, Subscriptions: Same user isolation pattern

**Storage Bucket:** `trade_screenshots` with RLS enabled

**Additional Security:**
- Validate all inputs server-side
- Rate limit API endpoints
- Sanitize user input to prevent SQL injection
- Protect API keys in environment variables
- Use HTTPS for all communications

---

## AUTHENTICATION

Use Supabase Auth with these methods:
- Email signup/login
- Google OAuth

**Requirements:**
- Sessions must persist across page refresh
- Protected routes: `/dashboard`, `/trades`, `/analytics`, `/reports` (redirect to login if unauthenticated)
- Implement proper logout that clears session

---

## CORE FEATURES

### 1. Trade Journal
Users must be able to create, edit, delete, and duplicate trades. Fields include: symbol, asset type, direction, entry, exit, stop loss, take profit, position size, risk %, strategy, setup tag, session, timeframe, emotions, mistakes, notes.

**Auto-calculations:** Profit/Loss and Risk/Reward Ratio

### 2. Trade Import
Allow CSV and Excel uploads with this workflow:
1. User uploads file
2. System parses file and validates data
3. Show preview to user
4. User confirms import
5. Save trades to database

### 3. Analytics Dashboard
Display metrics: total trades, win rate, profit factor, average RRR, drawdown.

**Charts:** Equity curve, weekly performance, monthly performance, strategy performance, asset performance. Default interval = weekly.

### 4. AI Journal Assistant
AI expands short trade notes into structured journal entries. Example: User note "Exited early due to fear" → AI generates psychology explanation, possible mistakes, improvement suggestions.

### 5. AI Trade Analysis
Analyze user's trades and generate insights: overtrading detection, revenge trading detection, strategy performance, risk discipline analysis.

### 6. Weekly AI Report
Automatically generated report containing: weekly performance, best/worst trades, behavior analysis, improvement suggestions.

### 7. Monthly AI Report
Deep analysis: strategy evaluation, psychology patterns, risk management quality, behavior trends.

### 8. Export System
Users export trades, analytics, and reports in PDF, CSV, or Excel formats.

### 9. Goal Tracking
Users define goals (e.g., max trades per day, max risk per trade). System calculates compliance.

### 10. Gamification
Achievements: first 10 trades, 100 trades, first profitable month, consistency badge.

### 11. Admin Panel
Admin can: view users, view subscriptions, manage reports, suspend users.

---

## AI INTEGRATION (HuggingFace)

**Endpoint:** `POST https://api-inference.huggingface.co/models/google/flan-t5-large`

**Headers:** `Authorization: Bearer {HUGGINGFACE_API_KEY}`

**Example Prompt:** "Analyze the following trading journal data and generate insights: [data]. Provide psychology patterns, risk discipline analysis, and specific improvement suggestions."

Implement error handling for API failures and rate limiting. Cache responses where appropriate.

---

## SUBSCRIPTION PLANS

**FREE PLAN:** Max 200 trades, basic analytics, no AI reports

**PRO PLAN:** Unlimited trades, AI reports, advanced analytics, exports (pricing: $9/month example)

**Razorpay Integration:**
- Create subscription checkout flow
- Handle webhook events: `subscription.activated`, `subscription.paused`, `subscription.cancelled`
- Update subscription table accordingly
- Implement plan enforcement (block features for free users)

---

## NOTIFICATIONS

Send emails via Resend for: weekly report, monthly report, achievements.

---

## SEO REQUIREMENTS

Create:
- Landing page (with CTAs for signup)
- Pricing page
- Blog section

Include:
- Meta tags (title, description, OG tags)
- Schema markup (for SaaS, pricing, FAQs)
- Sitemap

---

## UI/UX REQUIREMENTS

- Modern SaaS dashboard aesthetic
- Dark mode support
- Fully responsive design (mobile, tablet, desktop)
- Clean, professional analytics charts with Shadcn components
- Consistent component library using Shadcn UI

---

## ENVIRONMENT VARIABLES

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
HUGGINGFACE_API_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RESEND_API_KEY
```

---

## DEPLOYMENT

**Frontend:** Deploy on Vercel with automatic deployments from main branch.

**Backend:** Supabase hosted (PostgreSQL, Auth, Edge Functions).

**Database Migrations:** Use Supabase migrations for schema version control.

---

## DELIVERABLES

Generate the complete, production-ready codebase including:

1. Complete frontend with all pages, components, and routing
2. Database schema with RLS policies
3. API services and server actions for trade management, analytics, and reporting
4. AI integration layer with HuggingFace API calls
5. Authentication system with protected routes and session management
6. Razorpay subscription billing system with plan enforcement
7. Analytics dashboard with calculated metrics and charts
8. Trade journal CRUD system with auto-calculations
9. Email notification system via Resend
10. Admin panel for user/subscription management
11. Export functionality (PDF, CSV, Excel)
12. SEO-optimized landing, pricing, and blog pages
13. Environment configuration and deployment instructions

**Code Quality Standards:**
- No console.errors or console.logs in production code
- Proper error handling throughout
- TypeScript strict mode enforced
- Unit tests for critical business logic (calculations, validations)
- Clear, documented code with JSDoc comments for complex functions
- Modular service layer separating business logic from components

---

**Start building. Create a complete, working application ready for production deployment.**