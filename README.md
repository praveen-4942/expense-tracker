# Orb Expense Tracker

A premium, production-ready personal finance dashboard. Dark space theme, glassmorphism UI, real-time Firestore sync, and rich analytics — built with vanilla HTML/CSS/JS and Firebase.

![Orb Expense Tracker](assets/images/screenshot-placeholder.png)

---

## Features

**Authentication**
- Email/password signup & login
- Google OAuth sign-in
- Forgot password (email reset link)
- Email verification on signup
- "Remember me" persistent login (session survives refresh)

**Expense Management**
- Add, edit, and delete income/expense transactions
- Categories, notes, amount, date, payment method, tags
- Recurring transaction flag

**Dashboard**
- Monthly spending, income, savings, budget remaining
- Today's and weekly spending
- Recent transactions feed
- Top categories breakdown with progress bars
- Quick-add expense button

**Analytics**
- Category breakdown (doughnut chart)
- Income vs. expense (bar chart)
- 6-month spending trend (bar chart)
- Weekly spending trend (line chart)
- Smooth Chart.js animations

**Calendar**
- Full monthly calendar with daily spending totals
- Click any day to see that day's transactions
- Month navigation, today highlight

**Search & Filter**
- Free-text search (notes & tags)
- Category, type, date range, and amount range filters
- Sort by newest, oldest, highest, lowest

**Settings**
- Dark / light mode toggle
- Currency selection (USD, EUR, GBP, INR, JPY)
- Monthly budget target
- Profile name editing
- Full data export (JSON)
- Account deletion

**Export**
- CSV export of filtered transactions
- PDF export (browser print-to-PDF)
- Printable report view

**Notifications & Motion**
- Animated toast notifications (success/error/warning)
- Delete confirmation dialogs
- Page/section fade-in and slide-up transitions
- Floating animated background orbs with glass blur

---

## Tech Stack

| Layer       | Technology                                   |
|-------------|-----------------------------------------------|
| Frontend    | HTML5, CSS3, Vanilla JS (ES Modules), Chart.js |
| Backend     | Firebase Authentication, Cloud Firestore, Firebase Analytics |
| Deployment  | GitHub + Vercel (or Firebase Hosting)         |

No frameworks, no Bootstrap, no Tailwind — every line of CSS and JS is hand-written.

---

## Project Structure

```
expense-tracker/
├── index.html
├── README.md
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── .vercelignore
├── .gitignore
├── css/
│   ├── style.css          # theme tokens, glassmorphism, buttons, animations
│   ├── dashboard.css       # sidebar, stats grid, panels
│   ├── auth.css            # login/signup/forgot password screens
│   ├── calendar.css        # calendar grid
│   ├── charts.css          # analytics chart layout
│   └── responsive.css      # breakpoints
├── js/
│   ├── main.js              # entry point, loads Chart.js, boots app
│   ├── app.js                # app controller — state + event wiring
│   ├── auth.js                # Firebase Auth wrapper
│   ├── db.js                  # Firestore reads/writes
│   ├── firebase-config.js     # Firebase SDK initialization
│   ├── ui.js                   # view switching, modals, loader, theme
│   ├── dashboard.js             # stat cards, recent tx, top categories
│   ├── calendar.js               # calendar rendering & navigation
│   ├── charts.js                  # Chart.js chart creation/updates
│   ├── analytics.js                # Firebase Analytics event logging
│   ├── notifications.js             # toasts + confirm dialogs
│   ├── settings.js                   # settings view logic
│   ├── helpers.js                     # pure utility functions
│   ├── storage.js                      # localStorage preferences wrapper
│   └── validation.js                    # form validation
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/orb-expense-tracker.git
cd orb-expense-tracker
```

Since this is a static ES-modules app, you just need a local web server (ES module imports won't load from `file://`):

```bash
# Option A: Node
npx serve .

# Option B: Python
python3 -m http.server 5500
```

Then open `http://localhost:5500` (or whichever port your server prints).

---

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Authentication** → Sign-in method → enable **Email/Password** and **Google**.
3. **Firestore Database** → Create database (start in production mode).
4. **Project Settings** → General → Your apps → Add a **Web app** → copy the config object.
5. Paste your config into `js/firebase-config.js`:

   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
     measurementId: "...",
   };
   ```

6. Deploy the security rules so every user can only access their own data:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init   # select Firestore, point to this folder, keep existing firestore.rules
   firebase deploy --only firestore:rules
   ```

7. (Optional) In **Authentication → Settings → Authorized domains**, add your Vercel domain once deployed.

### Firestore Data Model

```
users/{uid}
  profile: { name, email }
  settings: { theme, currency, monthlyBudget }

users/{uid}/expenses/{expenseId}
  type, amount, category, date, paymentMethod, tags, notes, recurring

users/{uid}/budgets/{budgetId}
  category, limit, period
```

---

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Or connect the GitHub repo directly at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects this as a static site, no build command needed.

### Deploy to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Orb Expense Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/orb-expense-tracker.git
git push -u origin main
```

### (Alternative) Deploy to Firebase Hosting

```bash
firebase init hosting   # public directory: . (root)
firebase deploy --only hosting
```

---

## Screenshots

> Add screenshots of the Dashboard, Analytics, Calendar, and Settings views here once deployed.

| Dashboard | Analytics | Calendar |
|-----------|-----------|----------|
| _add image_ | _add image_ | _add image_ |

---

## License

MIT License — free to use, modify, and distribute.
