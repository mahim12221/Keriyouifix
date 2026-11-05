/** Single source of truth: old production route → redesigned demo route. Used by the Demo Navigator and the Hub. */
export type PageEntry = { group: string; old: string; to: string; name: string; note: string; file: string };

export const pages: PageEntry[] = [
  // Storefront
  { group: "Storefront", old: "/", to: "/", name: "Home", note: "Splash hand-off, hero, categories, fresh drops, best sellers, trust strip", file: "pages/store/Home.tsx" },
  { group: "Storefront", old: "/collection", to: "/collection", name: "Collection", note: "Sticky filter rail, sort, active chips, empty state", file: "pages/store/Collection.tsx" },
  { group: "Storefront", old: "/product/:productId", to: "/product/edc-clicker-titanium", name: "Product details", note: "Gallery + lightbox, variants, sticky buy bar, reviews, related", file: "pages/store/Product.tsx" },
  { group: "Storefront", old: "/cart", to: "/cart", name: "Cart", note: "Line items, summary, empty state; also a slide-over drawer", file: "pages/store/Cart.tsx" },
  { group: "Storefront", old: "/place-order", to: "/place-order", name: "Checkout (cart)", note: "Single-page Bangla checkout, courier, bKash/Nagad/COD, OTP dialog", file: "pages/store/Checkout.tsx" },
  { group: "Storefront", old: "/checkout/:productId", to: "/checkout/edc-clicker-titanium", name: "Express checkout", note: "Buy-now flow reusing the same checkout form", file: "pages/store/Checkout.tsx" },
  { group: "Storefront", old: "/about", to: "/about", name: "About", note: "Founder story + three promises", file: "pages/store/Info.tsx" },
  { group: "Storefront", old: "/contact", to: "/contact", name: "Contact", note: "Hotlines, WhatsApp, hours, message form", file: "pages/store/Info.tsx" },
  { group: "Storefront", old: "/privacy-policy", to: "/privacy-policy", name: "Privacy policy", note: "Readable long-form layout with section index", file: "pages/store/Info.tsx" },
  { group: "Storefront", old: "/brand-assets", to: "/brand-assets", name: "Brand assets", note: "Logo variants, colour + type tokens, download/copy SVG", file: "pages/store/BrandAssets.tsx" },
  // Account
  { group: "Account", old: "/login", to: "/login", name: "Sign in / Register", note: "Sign in, create account with email OTP, forgot password", file: "pages/store/Login.tsx" },
  { group: "Account", old: "/profile", to: "/profile", name: "Profile", note: "Summary, personal info, address, security", file: "pages/store/Profile.tsx" },
  { group: "Account", old: "/orders", to: "/orders", name: "My orders", note: "Order cards with timeline, pay-due, cancel dialog", file: "pages/store/Orders.tsx" },
  // Admin
  { group: "Admin", old: "/admin-portal (login)", to: "/admin-login", name: "Admin sign-in", note: "Split-screen sign-in", file: "pages/panel/Auth.tsx" },
  { group: "Admin", old: "dashboard tab", to: "/admin/dashboard", name: "Dashboard", note: "KPIs, activity chart, pipeline, regions, heatmap", file: "pages/admin/Dashboard.tsx" },
  { group: "Admin", old: "orders tab", to: "/admin/orders", name: "Web orders", note: "Filterable table + order drawer with dispatch", file: "pages/admin/Orders.tsx" },
  { group: "Admin", old: "add-order", to: "/admin/add-order", name: "Add order", note: "Manual / phone order builder", file: "pages/admin/AddOrder.tsx" },
  { group: "Admin", old: "inventory tab", to: "/admin/inventory", name: "Inventory", note: "Stock value, low stock, bulk adjust, tracker", file: "pages/admin/Inventory.tsx" },
  { group: "Admin", old: "products tab", to: "/admin/products", name: "Products", note: "Catalog table, add/edit dialog, upsells", file: "pages/admin/Products.tsx" },
  { group: "Admin", old: "categories tab", to: "/admin/categories", name: "Categories", note: "4-level menu tree editor", file: "pages/admin/Categories.tsx" },
  { group: "Admin", old: "payments (MFS)", to: "/admin/payments", name: "Payments", note: "bKash / Nagad TrxID verification queue", file: "pages/admin/Payments.tsx" },
  { group: "Admin", old: "couriers / steadfast", to: "/admin/couriers", name: "Couriers", note: "Steadfast, Pathao, RedX hub + barcode scan", file: "pages/admin/Couriers.tsx" },
  { group: "Admin", old: "inspection / blacklist", to: "/admin/fraud", name: "Fraud & security", note: "Phone inspection, blacklist, complaints, rules", file: "pages/admin/Fraud.tsx" },
  { group: "Admin", old: "abandoned carts", to: "/admin/abandoned", name: "Abandoned carts", note: "Recovery funnel and SMS offer", file: "pages/admin/Marketing.tsx" },
  { group: "Admin", old: "sms", to: "/admin/sms", name: "SMS center", note: "Automation toggles, templates, logs", file: "pages/admin/Marketing.tsx" },
  { group: "Admin", old: "email", to: "/admin/email", name: "Email", note: "SMTP sender, test mail, logs", file: "pages/admin/Marketing.tsx" },
  { group: "Admin", old: "accounting", to: "/admin/finance", name: "Finance (P&L)", note: "Gross, COGS, expenses, net profit ledger", file: "pages/admin/Finance.tsx" },
  { group: "Admin", old: "reports", to: "/admin/reports", name: "Reports", note: "Sales, staff performance, velocity", file: "pages/admin/Finance.tsx" },
  { group: "Admin", old: "staff tab", to: "/admin/staff", name: "Staff & approvals", note: "Requests, proposals diff, team", file: "pages/admin/Team.tsx" },
  { group: "Admin", old: "chat", to: "/admin/chats", name: "Live chats", note: "Conversation list, thread, profile panel", file: "pages/admin/Team.tsx" },
  { group: "Admin", old: "users", to: "/admin/customers", name: "Customers", note: "Read-only customer directory", file: "pages/admin/Team.tsx" },
  { group: "Admin", old: "settings", to: "/admin/system", name: "System", note: "Env + database diagnostics", file: "pages/admin/Team.tsx" },
  // Staff
  { group: "Staff", old: "/staff-login", to: "/staff-login", name: "Staff sign-in / request", note: "Sign in or request access", file: "pages/panel/Auth.tsx" },
  { group: "Staff", old: "/staff (home)", to: "/staff/dashboard", name: "My workspace", note: "Assigned queue, performance, notifications", file: "pages/staff/Staff.tsx" },
  { group: "Staff", old: "/staff orders", to: "/staff/orders", name: "Orders", note: "Claim, note and advance orders", file: "pages/staff/Staff.tsx" },
  { group: "Staff", old: "/staff products", to: "/staff/products", name: "Product proposals", note: "Propose edits for admin approval", file: "pages/staff/Staff.tsx" },
  { group: "Staff", old: "/staff chats", to: "/staff/chats", name: "Chats", note: "Customer conversations", file: "pages/staff/Staff.tsx" },
  { group: "Staff", old: "/staff fraud", to: "/staff/fraud", name: "Fraud check", note: "Phone delivery history lookup", file: "pages/staff/Staff.tsx" },
  // Hub
  { group: "Design hub", old: "—", to: "/hub", name: "Audit & design system", note: "Audit, tokens, components, motion, mapping, integration", file: "pages/Hub.tsx" },
];
