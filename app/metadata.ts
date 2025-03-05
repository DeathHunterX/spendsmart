const author = "Loi Phan Thanh";
const description =
  "SpendSmart is a personal finance tracker designed to help you manage your budget, track expenses, and gain insights into your spending habits.";
const url = "http://localhost:3000";

export const AppMetadata = {
  metadataBase: new URL(url),
  title: {
    default: "SpendSmart | Personal Finance Tracker",
    template: `%s | SpendSmart`,
  },
  description,
  icons: {
    icon: "/logo-blue.svg",
  },
  keywords: [
    "SpendSmart",
    "Personal Finance Tracker",
    "Budget App",
    "Expense Tracker",
    "Finance Management",
    "Money Tracker",
    "Spending Insights",
  ],
  creator: author,
  authors: [{ name: author, description, url }],
  openGraph: {
    title: `SpendSmart | Personal Finance Tracker`,
    description,
    url,
    siteName: `SpendSmart`,
    images: [
      {
        url: "https://spendsmart-app.com/screenshot.png",
        width: 800,
        height: 600,
        alt: "SpendSmart - Personal Finance Tracker Screenshot",
      },
      {
        url: "https://spendsmart-app.com/screenshot2.png",
        width: 1800,
        height: 1600,
        alt: "SpendSmart - Expense Overview Screenshot",
      },
    ],
    locale: "en-US",
    type: "website",
  },
};
