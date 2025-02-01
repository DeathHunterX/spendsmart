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

## Technology Stack

- Next.js 15
- React 19
- Tailwind CSS
- NextAuth
- Shadcn/ui
- lucide-react
- Logoipsum
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
