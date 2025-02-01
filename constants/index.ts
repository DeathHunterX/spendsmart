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
        title: "Transfers",
        url: "/transfers",
        icon: "arrowLeftRight",
        isActive: true,
      },
      {
        title: "Recurring",
        url: "/recurring",
        icon: "clock",
        isActive: true,
      },
    ],
  },
  {
    title: "Analysis",
    isActive: true,
    items: [
      {
        title: "Spending Analysis",
        url: "/analysis/spending",
        icon: "pieChart",
        isActive: true,
      },
      {
        title: "Income Tracking",
        url: "/analysis/income",
        icon: "lineChart",
        isActive: true,
      },
      {
        title: "Categories",
        url: "/categories",
        icon: "tags",
        isActive: true,
      },
    ],
  },
  {
    title: "Planning",
    isActive: true,
    items: [
      {
        title: "Budget Planner",
        url: "/budget-planner",
        icon: "calendar",
        isActive: true,
      },
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
    isActive: true,
    items: [
      {
        title: "Monthly Report",
        url: "/report",
        icon: "fileText",
        isActive: true,
      },
    ],
  },

  {
    title: "Settings",
    isActive: true,
    items: [
      {
        title: "Wallet",
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
