export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Welcomer",
  description:
    "Join Welcomer beta and get early access to the most powerful discord bot for welcoming new members. Welcomer is a bot that helps you welcome new members to your server and helps you manage your server. Welcome new members with a fully customisable welcome message, custom image backgrounds, custom fonts, and more.",
  logo: "/logo.svg",
  
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Help",
      href: "/help",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Help & Feedback",
      href: "/help",
    },
  ],
  links: {
    github: "https://github.com/welcomer-bot/welcomer",
    docs: "https://imperiator.gitbook.io/welcomer-bot/",
    discord: "https://discord.gg/7TGc5ZZ7aM",
  },
};
