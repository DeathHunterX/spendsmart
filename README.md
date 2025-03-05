# SpendSmart Project

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Screenshot](#screenshot)
8. [Template References for Research](#template-references-for-research)

## Introduction

## Features

1. 🏠 Comprehensive Dashboard: View a snapshot of your financial health, including recent transactions, budgets, and account balances.
2. 💳 Transaction Management: Easily add, edit, and track all of your transactions in one place.
3. 🔄 Recurring Transactions: Set up recurring payments or income (e.g., subscriptions, bills) and automate tracking.
4. 📊 Categories & Budgets: Create and manage spending categories and set budgets to track progress throughout the month.
5. 🏦 Wallet Management: Manage multiple wallets or accounts, monitor balances, and review transaction history.
6. 👥 Expense Splitting: Track and split shared expenses with friends, roommates, or travel companions.
7. 🧾 Bill Payments: Set up bill payment reminders or automate bill management to avoid missed payments.
8. 📈 Reports & Analytics: Generate detailed reports to analyze your spending patterns, income, and overall financial trends.
9. 🧠 Financial Insights: Get personalized tips and insights based on your spending behavior to improve financial health.
   10.💰 Net Worth Tracking: Monitor your total net worth by combining your assets (savings, investments) and liabilities (loans, debts).
10. 🏦 Savings Planner: Set up and track savings goals (e.g., vacations, emergency funds) with progress indicators.
11. 📅 Loans & Debts Management: Track loans and debts, repayment schedules, and set up reminders for due payments.
12. 💼 Income Tracker: Categorize and track income from various sources like salary, side projects, and freelance work.
13. 🎯 Milestones: Set and achieve financial milestones, like paying off debt or reaching a savings goal.
14. 📥 Transaction Import/Export: Import transactions from CSV or bank API and export transaction data for record-keeping or tax purposes.
15. 🧾 Tax Preparation: Organize tax-related transactions and generate reports for easier tax filing.
16. 🛡️ Audit Log: Maintain a detailed log of all changes made to transactions and budgets for accountability.
17. ❓ Help Center: Access tutorials, guides, and FAQs to get help using SpendSmart’s features.
18. 💬 In-App Support Chat: Reach out for real-time help through a live chat or chatbot feature.
19. 👤 Profile Management: Edit your personal details like name, email, and password in your user profile.
20. 🔔 Notification Preferences: Set and manage notifications for spending alerts, bill reminders, and budget updates.
21. 🌙 Dark Mode & Themes: Customize the app’s appearance with dark mode and custom themes.
22. 🔐 Privacy & Security: Detailed information on how your data is handled with strong security measures in place.

## Technology Stack

- Next.js 15
- React 19
- Tailwind CSS
- NextAuth
- Shadcn/ui
- lucide-react
- Logoipsum
- tanstack/react-query
- Drizzle
- NeonDB

## Project Structure

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository:**

```bash
  git clone https://github.com/DeathHunterX/spendsmart
  cd spebdsnart

```

2. **Initialize the libraries installation:**

- For npm:

```bash
  npm insall --force
  #or
  npm install --legacy-peer-deps
```

- For bun:

```bash
  bun install
```

3. **Set up .env.local file**

```
  AUTH_SECRET=
  AUTH_GITHUB_ID=
  AUTH_GITHUB_SECRET=

  AUTH_GOOGLE_ID=
  AUTH_GOOGLE_SECRET=

  DATABASE_URL=

  NEXT_PUBLIC_APP_URL=

  RESEND_API_KEY=
```

4. **Set up Drizzle**

- For npm

```

```

- For bun

```
  bun run db:generate
  bun run db:migrate
  bun run db:studio     # Optional: If you want to check data
```

5. **Run the App:**
   <br />Start the development server

```bash
  npm run dev
```

- For bun

```bash
  bun run dev
```

4: **Access the App:**
<br />Open your web browser and go to http://localhost:3000

## Usage

## Screenshot

## Template References for Research
