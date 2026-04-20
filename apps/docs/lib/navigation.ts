export interface NavItem {
  title: string;
  href: string;
  badge?: "new" | "beta" | "deprecated";
  description?: string;
}

export interface NavGroup {
  title: string;
  href?: string;
  items?: NavItem[];
  badge?: "new" | "beta";
}

export const navigation: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/getting-started/introduction",
        description: "What is Vestrapay and how it works",
      },
      {
        title: "Quick Start",
        href: "/getting-started/quick-start",
        description: "Make your first API call in minutes",
      },
      {
        title: "Hello World",
        href: "/getting-started/hello-world",
        description: "The fastest path to a working integration",
      },
    ],
  },
  {
    title: "Authentication",
    items: [
      {
        title: "API Keys",
        href: "/authentication",
        description: "API key types, rotation, and management",
      },
      {
        title: "Security Best Practices",
        href: "/authentication/security",
        description: "Keeping your integration secure",
      },
    ],
  },
  {
    title: "API Reference",
    items: [
      {
        title: "Overview",
        href: "/api-reference",
        description: "Base URL, versioning, and response format",
      },
      {
        title: "Payments",
        href: "/api-reference/payments",
        description: "Direct server-to-server charging via cards, USSD, and bank transfers.",
      },
      {
        title: "SDK",
        href: "/api-reference/sdk",
        description: "Advanced charging sequences engineered for mobile and web SDKs.",
      },
      {
        title: "Webhooks",
        href: "/api-reference/webhooks",
        description: "Real-time event notifications",
      },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        title: "Accept Your First Payment",
        href: "/guides/accept-payments",
        description: "End-to-end payment integration walkthrough",
      },
      {
        title: "Handle Refunds",
        href: "/guides/handle-refunds",
        description: "Full and partial refund flows",
      },
      {
        title: "Recurring Billing",
        href: "/guides/recurring-billing",
        description: "Subscriptions and scheduled charges",
        badge: "new",
      },
    ],
  },
  {
    title: "Errors & Troubleshooting",
    href: "/errors",
  },
  {
    title: "Changelog",
    href: "/changelog",
  },
];

export interface SearchResult {
  title: string;
  href: string;
  description?: string;
  section?: string;
}

export function flatNavItems(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const group of navigation) {
    if (group.href) {
      results.push({ title: group.title, href: group.href });
    }
    if (group.items) {
      for (const item of group.items) {
        results.push({
          title: item.title,
          href: item.href,
          description: item.description,
          section: group.title,
        });
      }
    }
  }
  return results;
}
