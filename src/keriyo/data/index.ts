import clicker from "../assets/clicker.jpg";
import earbuds from "../assets/earbuds.jpg";
import watch from "../assets/watch.jpg";
import charger from "../assets/charger.jpg";
import fidget from "../assets/fidget.jpg";

/**
 * Demo data.
 * Items flagged `real: true` come from the live Keriyo catalog (/api/product/list).
 * Everything else is illustrative sample content — replace with API data in the real project.
 */
const CDN = "https://res.cloudinary.com/mtbtgxjj/image/upload/";

export type Product = {
  id: string;
  name: string;
  price: number; // list price (BDT)
  discount: number; // percent
  category: string;
  sub: string;
  img: string;
  stock: number;
  best?: boolean;
  isNew?: boolean;
  rating: number;
  reviews: number;
  colors?: { name: string; hex: string }[];
  options?: string[];
  blurb: string;
  specs: [string, string][];
  real?: boolean;
};

export const products: Product[] = [
  {
    id: "edc-clicker-titanium",
    name: "Cyberpunk EDC Clicker Titanium",
    price: 2450,
    discount: 10,
    category: "EDC Tools & Tactile Gadgets",
    sub: "Fidget Sliders",
    img: clicker,
    stock: 30,
    best: true,
    rating: 4.9,
    reviews: 38,
    colors: [
      { name: "Titanium", hex: "#a8a29e" },
      { name: "Cyan", hex: "#06b6d4" },
      { name: "Graphite", hex: "#44403c" },
    ],
    blurb: "Tactile haptic magnetic fidget slider clicker. Machined to feel as good as it sounds.",
    specs: [
      ["Material", "Machined titanium alloy"],
      ["Mechanism", "Neodymium magnetic slider"],
      ["Weight", "62 g"],
      ["Finish", "Brushed, anodised accent"],
    ],
    real: true,
  },
  {
    id: "edifier-g2-ii",
    name: "Edifier G2 II Virtual 7.1 Surround Sound Gaming Headset",
    price: 4200,
    discount: 5,
    category: "Headphones",
    sub: "Gaming Headphones",
    img: CDN + "v1790832369/slidakr7hh5kvxuftwgq.jpg",
    stock: 22,
    best: true,
    rating: 4.8,
    reviews: 64,
    colors: [{ name: "Black", hex: "#1c1917" }],
    options: ["Standard"],
    blurb: "Virtual 7.1 surround, 50 mm drivers and a detachable noise-cancelling mic.",
    specs: [
      ["Drivers", "50 mm"],
      ["Surround", "Virtual 7.1"],
      ["Connection", "USB"],
      ["Warranty", "7-day replacement"],
    ],
    real: true,
  },
  {
    id: "geometric-tpu-iphone",
    name: "Keriyo Geometric Pattern Soft TPU Case for iPhone",
    price: 1800,
    discount: 5,
    category: "Phone Covers",
    sub: "iPhone",
    img: CDN + "v1790832606/u34hsxvts8yiqsktivk1.jpg",
    stock: 21,
    isNew: true,
    rating: 4.7,
    reviews: 21,
    options: ["Standard"],
    blurb: "Soft-touch matte TPU with an embossed geometric grip and raised camera bezel.",
    specs: [
      ["Material", "High-grade flexible TPU"],
      ["Compatibility", "iPhone series"],
      ["Protection", "Shock-absorbent frame"],
      ["Package", "1× Keriyo TPU case"],
    ],
    real: true,
  },
  {
    id: "frosted-matte-iphone",
    name: "Keriyo Frosted Matte Shockproof Case for iPhone",
    price: 1800,
    discount: 10,
    category: "Phone Covers",
    sub: "iPhone",
    img: CDN + "v1790083244/tl95r9c5nojtclz1sfgr.jpg",
    stock: 15,
    isNew: true,
    rating: 4.6,
    reviews: 17,
    colors: [{ name: "Frost", hex: "#d6d3d1" }],
    options: ["Standard"],
    blurb: "Frosted back, shockproof corners and a fingerprint-resistant finish.",
    specs: [
      ["Material", "Frosted PC + TPU bumper"],
      ["Compatibility", "iPhone series"],
      ["Drop rating", "Shockproof corners"],
      ["Package", "1× case"],
    ],
    real: true,
  },
  {
    id: "air-buds-pro",
    name: "Keriyo Air Buds Pro — Wireless Earbuds",
    price: 3200,
    discount: 12,
    category: "Headphones",
    sub: "Earbuds",
    img: earbuds,
    stock: 40,
    best: true,
    isNew: true,
    rating: 4.7,
    reviews: 52,
    colors: [
      { name: "White", hex: "#f5f5f4" },
      { name: "Black", hex: "#1c1917" },
    ],
    blurb: "Bluetooth 5.3, low-latency game mode and 28-hour total battery life.",
    specs: [
      ["Bluetooth", "5.3"],
      ["Battery", "28 h with case"],
      ["Charging", "USB-C"],
      ["Water rating", "IPX4"],
    ],
  },
  {
    id: "pulse-watch-s2",
    name: "Pulse Smartwatch S2 — AMOLED",
    price: 5900,
    discount: 8,
    category: "Smart Gadgets",
    sub: "Smartwatches",
    img: watch,
    stock: 14,
    rating: 4.5,
    reviews: 29,
    colors: [
      { name: "Black", hex: "#1c1917" },
      { name: "Silver", hex: "#d6d3d1" },
    ],
    blurb: "1.85″ AMOLED display, Bluetooth calling, heart-rate and sleep tracking.",
    specs: [
      ["Display", "1.85″ AMOLED"],
      ["Battery", "Up to 7 days"],
      ["Calling", "Bluetooth"],
      ["Water rating", "IP68"],
    ],
  },
  {
    id: "gan-65w",
    name: "65W GaN Fast Charger + Braided USB-C Cable",
    price: 2100,
    discount: 0,
    category: "Smart Gadgets",
    sub: "Chargers & Cables",
    img: charger,
    stock: 3,
    rating: 4.8,
    reviews: 44,
    blurb: "Compact 65W GaN charger that powers a laptop and a phone at once.",
    specs: [
      ["Output", "65W max"],
      ["Ports", "2× USB-C, 1× USB-A"],
      ["Cable", "1.5 m braided"],
      ["Safety", "Over-heat protection"],
    ],
  },
  {
    id: "orbit-fidget-set",
    name: "Orbit Precision Fidget Set — Spinner, Cube & Ring",
    price: 1400,
    discount: 15,
    category: "Toys",
    sub: "Fidget Toys",
    img: fidget,
    stock: 0,
    rating: 4.9,
    reviews: 73,
    blurb: "Three precision-machined metal fidgets in one set. Quiet, smooth and satisfying.",
    specs: [
      ["Material", "CNC aluminium"],
      ["Includes", "Spinner, magnetic cube, ring"],
      ["Finish", "Matte black / silver"],
      ["Age", "12+"],
    ],
  },
];

export const salePrice = (p: Product) => Math.round(p.price * (1 - p.discount / 100));
export const getProduct = (id?: string) => products.find((p) => p.id === id);

/** Real category tree from /api/category/list (+ two sample branches). */
export type Cat = { name: string; children?: Cat[] };
export const categories: Cat[] = [
  { name: "Phone Covers", children: [{ name: "iPhone", children: [{ name: "iPhone 17" }, { name: "iPhone 18" }] }, { name: "Samsung" }, { name: "Vivo" }] },
  { name: "Headphones", children: [{ name: "Gaming Headphones" }, { name: "Earphones" }, { name: "Earbuds" }] },
  { name: "EDC Tools & Tactile Gadgets", children: [{ name: "Fidget Sliders" }] },
  { name: "Toys", children: [{ name: "Fidget Toys" }] },
  { name: "Smart Gadgets", children: [{ name: "Smartwatches" }, { name: "Chargers & Cables" }] },
];

/* ------------------------------------------------------------- Orders */
export type Order = {
  id: string;
  date: string;
  customer: string;
  phone: string;
  address: string;
  district: string;
  items: { id: string; qty: number }[];
  delivery: number;
  advance: number;
  payment: "COD" | "bKash" | "Nagad";
  status: "Order Placed" | "Confirmed" | "Packaging" | "In Courier" | "Out for delivery" | "Delivered" | "Cancelled" | "Returned";
  courier?: string;
  tracking?: string;
  note?: string;
  staff?: string;
  trx?: string;
  trxState?: "Pending" | "Verified" | "Rejected";
  risk: number; // delivery success rate %
};
export const orders: Order[] = [
  { id: "KR-10482", date: "Today, 11:42 AM", customer: "Tanvir Ahmed", phone: "01711 223344", address: "House 12/A, Road 4, Sector 7, Uttara", district: "Dhaka", items: [{ id: "edc-clicker-titanium", qty: 1 }, { id: "gan-65w", qty: 1 }], delivery: 80, advance: 0, payment: "COD", status: "Order Placed", risk: 92, note: "Call before delivery" },
  { id: "KR-10481", date: "Today, 10:15 AM", customer: "Nusrat Jahan", phone: "01822 334455", address: "Flat 5B, Agrabad C/A", district: "Chattogram", items: [{ id: "air-buds-pro", qty: 1 }], delivery: 130, advance: 130, payment: "bKash", status: "Confirmed", staff: "Rafi Hasan", trx: "9J3K8L2P1X", trxState: "Pending", risk: 88 },
  { id: "KR-10480", date: "Today, 9:03 AM", customer: "Md Jakir Hossain", phone: "01933 556677", address: "Zindabazar Point, Sylhet Sadar", district: "Sylhet", items: [{ id: "geometric-tpu-iphone", qty: 2 }], delivery: 130, advance: 0, payment: "COD", status: "Packaging", staff: "Rafi Hasan", risk: 71 },
  { id: "KR-10479", date: "Yesterday", customer: "Sadia Rahman", phone: "01644 778899", address: "Mirpur 10, Block C, Road 2", district: "Dhaka", items: [{ id: "pulse-watch-s2", qty: 1 }], delivery: 80, advance: 5500, payment: "Nagad", status: "In Courier", courier: "Steadfast", tracking: "SF-88420191", staff: "Mim Akter", trx: "NG55K29QZ", trxState: "Verified", risk: 95 },
  { id: "KR-10478", date: "Yesterday", customer: "Arif Chowdhury", phone: "01555 990011", address: "Rajshahi Sadar, Shaheb Bazar", district: "Rajshahi", items: [{ id: "edifier-g2-ii", qty: 1 }], delivery: 130, advance: 0, payment: "COD", status: "Out for delivery", courier: "Steadfast", tracking: "SF-88419870", staff: "Mim Akter", risk: 84 },
  { id: "KR-10477", date: "2 days ago", customer: "Farhana Islam", phone: "01788 112233", address: "Khulna Sadar, KDA Avenue", district: "Khulna", items: [{ id: "frosted-matte-iphone", qty: 1 }, { id: "gan-65w", qty: 1 }], delivery: 130, advance: 0, payment: "COD", status: "Delivered", courier: "Steadfast", tracking: "SF-88417702", staff: "Rafi Hasan", risk: 90 },
  { id: "KR-10476", date: "2 days ago", customer: "Rakib Hasan", phone: "01911 445566", address: "Cumilla Town, Kandirpar", district: "Cumilla", items: [{ id: "orbit-fidget-set", qty: 1 }], delivery: 130, advance: 0, payment: "COD", status: "Returned", courier: "Steadfast", tracking: "SF-88416310", staff: "Mim Akter", risk: 38, note: "Phone switched off" },
  { id: "KR-10475", date: "3 days ago", customer: "Mehedi Hasan", phone: "01322 667788", address: "Bogura Sadar, Jhawtala", district: "Bogura", items: [{ id: "air-buds-pro", qty: 1 }, { id: "edc-clicker-titanium", qty: 1 }], delivery: 130, advance: 130, payment: "bKash", status: "Delivered", courier: "Steadfast", tracking: "SF-88412540", staff: "Rafi Hasan", trx: "8H2M1Q7TZ0", trxState: "Verified", risk: 93 },
  { id: "KR-10474", date: "3 days ago", customer: "Lamia Akter", phone: "01477 332211", address: "Dhanmondi 27, House 9", district: "Dhaka", items: [{ id: "geometric-tpu-iphone", qty: 1 }], delivery: 80, advance: 0, payment: "COD", status: "Cancelled", staff: "Mim Akter", risk: 55, note: "Customer changed mind" },
];
export const orderTotal = (o: Order) => o.items.reduce((a, i) => a + salePrice(getProduct(i.id)!) * i.qty, 0) + o.delivery;
export const orderItemsTotal = (o: Order) => o.items.reduce((a, i) => a + salePrice(getProduct(i.id)!) * i.qty, 0);
export const ORDER_STEPS = ["Order Placed", "Confirmed", "Packaging", "In Courier", "Out for delivery", "Delivered"] as const;

/* ----------------------------------------------------- People & misc */
export const customers = [
  { name: "Tanvir Ahmed", email: "tanvir@example.com", phone: "01711 223344", orders: 4, logins: 12, joined: "Jan 2026", address: "House 12/A, Road 4, Sector 7, Uttara" },
  { name: "Nusrat Jahan", email: "nusrat@example.com", phone: "01822 334455", orders: 2, logins: 6, joined: "Feb 2026", address: "Flat 5B, Agrabad C/A, Chattogram" },
  { name: "Sadia Rahman", email: "sadia@example.com", phone: "01644 778899", orders: 7, logins: 21, joined: "Nov 2025", address: "Mirpur 10, Block C, Dhaka" },
  { name: "Arif Chowdhury", email: "arif@example.com", phone: "01555 990011", orders: 1, logins: 3, joined: "Mar 2026", address: "Shaheb Bazar, Rajshahi" },
  { name: "Mehedi Hasan", email: "mehedi@example.com", phone: "01322 667788", orders: 3, logins: 9, joined: "Dec 2025", address: "Jhawtala, Bogura" },
];
export const staffMembers = [
  { name: "Rafi Hasan", email: "rafi@keriyo.com", phone: "01822 334455", role: "Sales Executive", assigned: 148, ratio: 91 },
  { name: "Mim Akter", email: "mim@keriyo.com", phone: "01711 220099", role: "Courier Support Agent", assigned: 121, ratio: 87 },
  { name: "Sajid Karim", email: "sajid@keriyo.com", phone: "01933 441122", role: "Product Content Staff", assigned: 0, ratio: 0 },
];
export const pendingStaff = [{ name: "Al-Amin Chowdhury", email: "alamin@keriyo.com", phone: "01711 223344", role: "Sales Executive", when: "2 h ago" }];
export const proposals = [
  { id: "p1", staff: "Sajid Karim", product: "Air Buds Pro", field: "Price", from: "৳3,600", to: "৳3,200", when: "Today, 9:40 AM", desc: "Lowered price for the Eid campaign." },
  { id: "p2", staff: "Sajid Karim", product: "Pulse Smartwatch S2", field: "Description & stock", from: "Stock 10 · short copy", to: "Stock 14 · expanded copy", when: "Yesterday", desc: "Added IP68 rating and Bluetooth calling details." },
];
export const abandoned = [
  { phone: "01712 003344", name: "Imran Khan", items: "Air Buds Pro × 1", value: 2816, last: "12 min ago", status: "Pending" },
  { phone: "01833 556600", name: "Ayesha Siddika", items: "Pulse Smartwatch S2 × 1", value: 5428, last: "1 h ago", status: "Contacted" },
  { phone: "01922 118877", name: "Shuvo Das", items: "65W GaN Charger × 2", value: 4200, last: "Yesterday", status: "Recovered" },
  { phone: "01544 770022", name: "Mou Akter", items: "Orbit Fidget Set × 1", value: 1190, last: "2 days ago", status: "Lost" },
];
export const smsLogs = [
  { time: "11:42 AM", to: "Tanvir Ahmed", phone: "01711 223344", type: "Order placed", msg: "Hi Tanvir, your Keriyo order KR-10482 (৳4,435) is received.", status: "Delivered" },
  { time: "10:30 AM", to: "Sadia Rahman", phone: "01644 778899", type: "Tracking", msg: "Your parcel is with Steadfast. Track: SF-88420191", status: "Delivered" },
  { time: "9:12 AM", to: "Imran Khan", phone: "01712 003344", type: "Recovery", msg: "Still thinking? Take 5% off Air Buds Pro today.", status: "Delivered" },
  { time: "Yesterday", to: "Unknown", phone: "01600 000000", type: "OTP", msg: "Your Keriyo OTP is 4821.", status: "Failed" },
];
export const expenses = [
  { title: "Facebook Ads Campaign #4", cat: "Facebook Ad Spend", amount: 18500, date: "12 May" },
  { title: "Courier return charges", cat: "Courier Return Charges", amount: 2340, date: "11 May" },
  { title: "Poly mailers & stickers", cat: "Packaging & Labels", amount: 6200, date: "09 May" },
  { title: "Staff commission — April", cat: "Staff Salary & Commission", amount: 14000, date: "05 May" },
];
export const thread = [
  { from: "customer", text: "Hi, is the titanium clicker back in stock in cyan?", t: "11:20" },
  { from: "agent", text: "Hello Tanvir! Yes — the cyan one is available and ships today from Dhaka.", t: "11:22" },
  { from: "customer", text: "Great, can I get it with cash on delivery?", t: "11:23" },
];
export const revenue30 = [18, 24, 21, 30, 28, 36, 33, 41, 38, 46, 44, 52, 49, 58, 54, 61, 57, 66, 63, 72, 68, 77, 74, 82, 79, 88, 85, 93, 90, 98].map((n) => n * 1000);
export const days30 = Array.from({ length: 30 }, (_, i) => `${i + 1} Apr`.replace(/^(\d+) Apr$/, (_, d) => (Number(d) > 30 ? `${Number(d) - 30} May` : `${d} Apr`)));
export const hourly = [1, 0, 0, 0, 1, 2, 3, 5, 8, 11, 9, 12, 10, 8, 7, 9, 11, 14, 17, 19, 16, 12, 7, 3];
export const regions = [
  { name: "Dhaka", n: 412, pct: 46 },
  { name: "Chattogram", n: 168, pct: 19 },
  { name: "Sylhet", n: 96, pct: 11 },
  { name: "Rajshahi", n: 74, pct: 8 },
  { name: "Khulna", n: 61, pct: 7 },
  { name: "Others", n: 83, pct: 9 },
];
