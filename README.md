# BoDiGi™ Learn & Earn Engagement App (Full System)
> Built for Replit or GitHub Copilot · Powered by MCP + Supabase · Created by Bobbie Digital™ · CPO: Boltz™

---

## 🧠 What It Builds

This project automatically builds:
- ✅ Branded digital identity
- ✅ Personalized MVP with 5 paid features
- ✅ Marketing strategy + launch materials
- ✅ Central CRM contact hub (all leads from all forms)
- ✅ Gamified Learn & Earn Loop tied to the MVP
- ✅ Checkout path to convert free users into paying customers

---

## 🧾 Core Workflow

1. **Branding Builder** – Name, niche, logo, colors, slogan
2. **MVP Builder** – Digital product + 5 paid features
3. **Marketing Builder** – Content, email, CTA assets
4. **Contact Hub** – Supabase table storing all form and purchase data
5. **Learn & Earn Loop Builder** – Quiz-to-sale conversion experience

---

## 📇 CRM + Contact Hub Features

### 1. Contact Capture at Loop Entry
- User provides name + email before first quiz question
- Stored in `contacts` table with `entry_type: learn_and_earn`

### 2. Automatic Contact Save at MVP Purchase
- When someone buys the MVP, their info is stored with:
  - `status: customer`
  - `entry_type: mvp_checkout`
  - `mvp_id`, `purchase_tier`

### 3. You (Platform Owner) Get Access to All Data
- Each contact is saved with `owner_id` to track which customer it belongs to
- Admin panel or master table view gives you full visibility across BoDiGi platform

---

## 🔁 Learn & Earn Loop Overview

- 5 sets of 3 MVP-specific questions
- Each set rewards:
  - Q1: MVP-based PDF
  - Q2: Another PDF
  - Q3: Bonus feature (from that MVP's 5 paid features)
- After each set, offer to buy MVP to unlock bonus
- Decline → harder set
- Accept → checkout w/ auto-applied bonus

Final set = bonus loss warning + Aura chat assistant.

---

## 🔐 Auth & Data Flow

- MCP Auth (A2A)
- Supabase + secure user/session tagging
- Stripe integrated for checkout + bonus redemption

---

## .env Needed

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
DATABASE_URL=
```

---

© 2025 Bobbie Digital · All rights reserved · License v1.0
