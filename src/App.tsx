import { useEffect, useState, type ReactNode } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { BarChart3, Boxes, CreditCard, FolderTree, Hourglass, Landmark, LayoutDashboard, Mail, MessageSquare, MessagesSquare, Package, PlusCircle, Server, ShieldAlert, ShoppingCart, Truck, UserCog, Users, Search, Settings } from "lucide-react";
import { ToastProvider } from "./keriyo/ui";
import { CartProvider } from "./keriyo/store/cart";
import { StoreLayout } from "./keriyo/layout/StoreLayout";
import { PanelLayout, type NavGroup } from "./keriyo/layout/PanelLayout";
import { ChatWidget } from "./keriyo/layout/ChatWidget";
import { DemoDock } from "./keriyo/layout/DemoDock";
import { Splash } from "./keriyo/layout/Splash";

import Home from "./keriyo/pages/store/Home";
import Collection from "./keriyo/pages/store/Collection";
import Product from "./keriyo/pages/store/Product";
import Cart from "./keriyo/pages/store/Cart";
import Checkout from "./keriyo/pages/store/Checkout";
import Login from "./keriyo/pages/store/Login";
import Profile from "./keriyo/pages/store/Profile";
import Orders from "./keriyo/pages/store/Orders";
import { About, Contact, Privacy } from "./keriyo/pages/store/Info";
import BrandAssets from "./keriyo/pages/store/BrandAssets";
import { AdminLogin, StaffLogin } from "./keriyo/pages/panel/Auth";
import Dashboard from "./keriyo/pages/admin/Dashboard";
import AdminOrders from "./keriyo/pages/admin/Orders";
import AddOrder from "./keriyo/pages/admin/AddOrder";
import Inventory from "./keriyo/pages/admin/Inventory";
import Products from "./keriyo/pages/admin/Products";
import Categories from "./keriyo/pages/admin/Categories";
import Payments from "./keriyo/pages/admin/Payments";
import Couriers from "./keriyo/pages/admin/Couriers";
import Fraud from "./keriyo/pages/admin/Fraud";
import { Abandoned, Email, Sms } from "./keriyo/pages/admin/Marketing";
import { Finance, Reports } from "./keriyo/pages/admin/Finance";
import { Chats, Customers, Staff, System } from "./keriyo/pages/admin/Team";
import { StaffChats, StaffDashboard, StaffFraud, StaffOrders, StaffProducts } from "./keriyo/pages/staff/Staff";
import Hub from "./keriyo/pages/Hub";

const adminNav: NavGroup[] = [
  { items: [{ to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Sales", items: [{ to: "/admin/orders", label: "Web orders", icon: ShoppingCart, badge: "18" }, { to: "/admin/add-order", label: "Add order", icon: PlusCircle }, { to: "/admin/payments", label: "Payments", icon: CreditCard, badge: "2" }, { to: "/admin/abandoned", label: "Abandoned carts", icon: Hourglass }] },
  { label: "Catalog", items: [{ to: "/admin/products", label: "Products", icon: Package }, { to: "/admin/inventory", label: "Inventory", icon: Boxes }, { to: "/admin/categories", label: "Categories", icon: FolderTree }] },
  { label: "Fulfilment", items: [{ to: "/admin/couriers", label: "Couriers", icon: Truck }, { to: "/admin/fraud", label: "Fraud & security", icon: ShieldAlert }] },
  { label: "Communication", items: [{ to: "/admin/chats", label: "Live chats", icon: MessagesSquare, badge: "3" }, { to: "/admin/sms", label: "SMS center", icon: MessageSquare }, { to: "/admin/email", label: "Email", icon: Mail }] },
  { label: "Finance", items: [{ to: "/admin/finance", label: "Finance", icon: Landmark }, { to: "/admin/reports", label: "Reports", icon: BarChart3 }] },
  { label: "People & system", items: [{ to: "/admin/customers", label: "Customers", icon: Users }, { to: "/admin/staff", label: "Staff", icon: UserCog, badge: "1" }, { to: "/admin/system", label: "System", icon: Server }] },
];
const staffNav: NavGroup[] = [
  { items: [{ to: "/staff/dashboard", label: "My workspace", icon: LayoutDashboard }, { to: "/staff/orders", label: "Orders", icon: ShoppingCart }, { to: "/staff/products", label: "Product proposals", icon: Package }, { to: "/staff/chats", label: "Chats", icon: MessagesSquare, badge: "3" }, { to: "/staff/fraud", label: "Fraud check", icon: Search }] },
];

const adminPages: Record<string, ReactNode> = {
  dashboard: <Dashboard />, orders: <AdminOrders />, "add-order": <AddOrder />, inventory: <Inventory />, products: <Products />, categories: <Categories />,
  payments: <Payments />, couriers: <Couriers />, fraud: <Fraud />, abandoned: <Abandoned />, sms: <Sms />, email: <Email />, finance: <Finance />, reports: <Reports />,
  staff: <Staff />, chats: <Chats />, customers: <Customers />, system: <System />,
};
const staffPages: Record<string, ReactNode> = { dashboard: <StaffDashboard />, orders: <StaffOrders />, products: <StaffProducts />, chats: <StaffChats />, fraud: <StaffFraud /> };

function AdminShell() {
  const { section = "dashboard" } = useParams();
  return <PanelLayout groups={adminNav} role="Admin" user={{ name: "Executive Admin", sub: "admin@keriyo.com" }}>{adminPages[section] ?? <Navigate to="/admin/dashboard" replace />}</PanelLayout>;
}
function StaffShell() {
  const { section = "dashboard" } = useParams();
  return <PanelLayout groups={staffNav} role="Staff" user={{ name: "Rafi Hasan", sub: "Sales Executive" }}>{staffPages[section] ?? <Navigate to="/staff/dashboard" replace />}</PanelLayout>;
}
const Store = ({ children }: { children: ReactNode }) => (<><StoreLayout>{children}</StoreLayout><ChatWidget /></>);

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);
  return null;
}

function Shell() {
  // Splash: only when landing on the home route, once per session, skipped for reduced motion.
  const [splash, setSplash] = useState(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const home = (window.location.hash || "#/").replace("#", "") === "/" || window.location.hash === "";
    const show = home && !reduced && !sessionStorage.getItem("k-splash");
    if (show) document.documentElement.dataset.intro = "playing";
    return show;
  });
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Store><Home /></Store>} />
        <Route path="/collection" element={<Store><Collection /></Store>} />
        <Route path="/product/:id" element={<Store><Product /></Store>} />
        <Route path="/cart" element={<Store><Cart /></Store>} />
        <Route path="/place-order" element={<Store><Checkout /></Store>} />
        <Route path="/checkout/:productId" element={<Store><Checkout /></Store>} />
        <Route path="/orders" element={<Store><Orders /></Store>} />
        <Route path="/profile" element={<Store><Profile /></Store>} />
        <Route path="/about" element={<Store><About /></Store>} />
        <Route path="/contact" element={<Store><Contact /></Store>} />
        <Route path="/privacy-policy" element={<Store><Privacy /></Store>} />
        <Route path="/brand-assets" element={<Store><BrandAssets /></Store>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/:section" element={<AdminShell />} />
        <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/staff/:section" element={<StaffShell />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DemoDock />
      {splash && (
        <Splash
          onDone={() => {
            sessionStorage.setItem("k-splash", "1");
            setSplash(false);
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <CartProvider>
          <Shell />
        </CartProvider>
      </ToastProvider>
    </HashRouter>
  );
}
export { Settings };
