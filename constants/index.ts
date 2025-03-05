export const beforeAuthNavLinks = [
  {
    route: "/",
    label: "Home",
  },
  {
    route: "/about-us",
    label: "About",
  },
  {
    route: "/services",
    label: "Services",
  },
  {
    route: "/contact-us",
    label: "Contact",
  },
];

export const navMain = [
  {
    title: "Overview",
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "dashboard",
        isActive: true,
      },
      {
        title: "Net Worth",
        url: "/net-worth",
        icon: "wallet",
        isActive: false,
      },
    ],
  },
  {
    title: "Money Management",
    isActive: true,
    items: [
      {
        title: "Transactions",
        url: "/transactions",
        icon: "receipt",
        isActive: true,
      },
      {
        title: "Recurring",
        url: "/recurring",
        icon: "clock",
        isActive: false,
      },
      {
        title: "Budgets",
        url: "/budgets",
        icon: "calendar",
        isActive: true,
      },
      {
        title: "Wallets",
        url: "/wallets",
        icon: "wallet",
        isActive: true,
      },
      {
        title: "Categories",
        url: "/categories",
        icon: "target",
        isActive: true,
      },
    ],
  },
  {
    title: "Analysis",
    isActive: false,
    items: [
      {
        title: "Spending Analysis",
        url: "/analysis/spending",
        icon: "pieChart",
        isActive: false,
      },
      {
        title: "Income Tracking",
        url: "/analysis/income",
        icon: "lineChart",
        isActive: false,
      },
    ],
  },
  {
    title: "Planning",
    isActive: false,
    items: [
      {
        title: "Saving Goals",
        url: "/saving-goals",
        icon: "target",
        isActive: true,
      },
      {
        title: "Wishlist",
        url: "/wishlist",
        icon: "gift",
        isActive: true,
      },
    ],
  },

  {
    title: "Reports",
    isActive: false,
    items: [
      {
        title: "Monthly Report",
        url: "/report",
        icon: "fileText",
        isActive: true,
      },
    ],
  },
];

export const settingsDropdown = [
  {
    title: "Account",
    url: "/settings/account",
    icon: "user",
  },
  {
    title: "Preferences",
    url: "/settings/preferences",
    icon: "preferences",
  },
  {
    title: "Notifications",
    url: "/settings/notifications",
    icon: "bell",
  },
  {
    title: "Privacy & Security",
    url: "/settings/privacy-security",
    icon: "shield",
  },
  {
    title: "Localization",
    url: "/settings/localization",
    icon: "localization",
  },
];
