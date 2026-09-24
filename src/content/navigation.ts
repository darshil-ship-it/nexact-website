export const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Growth Partner", href: "/growth-partner" },
  { label: "AI Consultancy", href: "/ai-consultancy" },
  { label: "About", href: "/about" },
];
export const primaryAction = { label: "Book a Meeting", href: "/book-meeting" };
export const footerGroups = [
  { label: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }] },
  { label: "Explore", links: [{ label: "Services", href: "/services" }, { label: "Solutions", href: "/solutions" }] },
  { label: "Specialized", links: navigation.slice(3, 5) },
  { label: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
];
// Add these to navigation only once implemented; no dead footer links.
export const futureRoutes = ["/products", "/projects", "/insights", "/impact"] as const;
