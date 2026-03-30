// ─── Types ────────────────────────────────────────────────────────────────────

export type ApplianceCategory =
  | 'lighting'
  | 'cooling'
  | 'kitchen'
  | 'entertainment'
  | 'office'
  | 'water'
  | 'other';

export interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  active: boolean; // whether it shows on the customer calculator
  category?: ApplianceCategory;
}

export interface CalcConfig {
  slug: string;
  businessName: string;
  headline: string;
  subtext: string;
  pricePerKW: number; // ₦ per kW installed
  contactWhatsapp: string; // installer's WhatsApp for customer to reach out
  /**
   * Wattage overrides keyed by CATALOG_APPLIANCES ID (e.g. 'c7').
   * When set, the customer calculator uses this wattage instead of the
   * catalog default. Allows installers to tune values to their market.
   * e.g. { c7: 900 } means "my 1HP ACs draw 900W, not 750W"
   */
  wattageOverrides: Record<string, number>;
  appliances: Appliance[];
  published: boolean;
}

export interface LeadAppliance {
  name: string;
  watts: number;
  qty: number;
  hoursPerDay: number;
}

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  appliances: LeadAppliance[];
  dailyKWh: number;
  systemKW: number;
  estimatedCost: number;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

// ─── Full Nigerian household appliance catalog ────────────────────────────────
// Customers see this entire list — grouped by category — regardless of installer config.
// Wattages based on common Nigerian market equipment specs.

export const CATALOG_APPLIANCES: (Omit<Appliance, 'active'> & { category: ApplianceCategory })[] = [
  // ── Lighting ──────────────────────────────────────────────────────────────
  { id: 'c1',  name: 'LED Bulb (9W)',          watts: 9,    hoursPerDay: 8,   category: 'lighting' },
  { id: 'c2',  name: 'LED Bulb (15W)',         watts: 15,   hoursPerDay: 8,   category: 'lighting' },
  { id: 'c3',  name: 'Fluorescent Tube (20W)', watts: 20,   hoursPerDay: 8,   category: 'lighting' },
  { id: 'c4',  name: 'Security / Floodlight',  watts: 50,   hoursPerDay: 12,  category: 'lighting' },
  // ── Cooling ───────────────────────────────────────────────────────────────
  { id: 'c5',  name: 'Ceiling Fan',            watts: 75,   hoursPerDay: 8,   category: 'cooling' },
  { id: 'c6',  name: 'Standing Fan',           watts: 50,   hoursPerDay: 8,   category: 'cooling' },
  { id: 'c7',  name: 'Air Conditioner 1HP',    watts: 750,  hoursPerDay: 8,   category: 'cooling' },
  { id: 'c8',  name: 'Air Conditioner 1.5HP',  watts: 1100, hoursPerDay: 8,   category: 'cooling' },
  { id: 'c9',  name: 'Air Conditioner 2HP',    watts: 1500, hoursPerDay: 8,   category: 'cooling' },
  // ── Kitchen ───────────────────────────────────────────────────────────────
  { id: 'c10', name: 'Refrigerator (100L)',    watts: 80,   hoursPerDay: 24,  category: 'kitchen' },
  { id: 'c11', name: 'Refrigerator (300L)',    watts: 150,  hoursPerDay: 24,  category: 'kitchen' },
  { id: 'c12', name: 'Refrigerator (500L)',    watts: 200,  hoursPerDay: 24,  category: 'kitchen' },
  { id: 'c13', name: 'Chest Freezer (200L)',   watts: 150,  hoursPerDay: 24,  category: 'kitchen' },
  { id: 'c14', name: 'Microwave',              watts: 1200, hoursPerDay: 0.5, category: 'kitchen' },
  { id: 'c15', name: 'Electric Kettle',        watts: 1500, hoursPerDay: 0.5, category: 'kitchen' },
  { id: 'c16', name: 'Blender',                watts: 400,  hoursPerDay: 0.5, category: 'kitchen' },
  { id: 'c17', name: 'Electric Iron',          watts: 1000, hoursPerDay: 1,   category: 'kitchen' },
  { id: 'c18', name: 'Washing Machine',        watts: 500,  hoursPerDay: 1,   category: 'kitchen' },
  { id: 'c19', name: 'Food Warmer',            watts: 600,  hoursPerDay: 2,   category: 'kitchen' },
  // ── Entertainment ─────────────────────────────────────────────────────────
  { id: 'c20', name: 'Smart TV 32"',           watts: 50,   hoursPerDay: 5,   category: 'entertainment' },
  { id: 'c21', name: 'Smart TV 43"',           watts: 80,   hoursPerDay: 5,   category: 'entertainment' },
  { id: 'c22', name: 'Smart TV 55"',           watts: 120,  hoursPerDay: 5,   category: 'entertainment' },
  { id: 'c23', name: 'DSTV / GoTV Decoder',    watts: 25,   hoursPerDay: 5,   category: 'entertainment' },
  { id: 'c24', name: 'Sound System',           watts: 100,  hoursPerDay: 3,   category: 'entertainment' },
  { id: 'c25', name: 'Projector',              watts: 200,  hoursPerDay: 3,   category: 'entertainment' },
  // ── Office & Devices ──────────────────────────────────────────────────────
  { id: 'c26', name: 'Laptop',                 watts: 65,   hoursPerDay: 6,   category: 'office' },
  { id: 'c27', name: 'Desktop PC',             watts: 250,  hoursPerDay: 6,   category: 'office' },
  { id: 'c28', name: 'Phone Charger',          watts: 20,   hoursPerDay: 4,   category: 'office' },
  { id: 'c29', name: 'WiFi Router',            watts: 15,   hoursPerDay: 24,  category: 'office' },
  { id: 'c30', name: 'Printer',                watts: 150,  hoursPerDay: 1,   category: 'office' },
  { id: 'c31', name: 'CCTV (4 cameras + DVR)', watts: 40,   hoursPerDay: 24,  category: 'office' },
  // ── Water ─────────────────────────────────────────────────────────────────
  { id: 'c32', name: 'Water Pump (0.5HP)',      watts: 375,  hoursPerDay: 2,   category: 'water' },
  { id: 'c33', name: 'Water Pump (1HP)',        watts: 750,  hoursPerDay: 2,   category: 'water' },
  { id: 'c34', name: 'Borehole Submersible',    watts: 1500, hoursPerDay: 1,   category: 'water' },
  // ── Other ─────────────────────────────────────────────────────────────────
  { id: 'c35', name: 'Hair Dryer',             watts: 1200, hoursPerDay: 0.5, category: 'other' },
  { id: 'c36', name: 'Electric Shaver',        watts: 15,   hoursPerDay: 0.5, category: 'other' },
  { id: 'c37', name: 'Sewing Machine',         watts: 100,  hoursPerDay: 4,   category: 'other' },
  { id: 'c38', name: 'Power Tool (Drill)',      watts: 500,  hoursPerDay: 1,   category: 'other' },
];

export const CATEGORY_LABELS: Record<ApplianceCategory, string> = {
  lighting:      'Lighting',
  cooling:       'Cooling',
  kitchen:       'Kitchen',
  entertainment: 'Entertainment',
  office:        'Devices',
  water:         'Water',
  other:         'Other',
};

export const CATEGORY_ORDER: ApplianceCategory[] = [
  'lighting', 'cooling', 'kitchen', 'entertainment', 'office', 'water', 'other',
];

// ─── Installer appliance config (for installer dashboard) ─────────────────────
// Kept separate from CATALOG_APPLIANCES — installer can still customize pricing
// and surface specific appliances, but customers always see the full catalog.

export const PRESET_APPLIANCES: Appliance[] = [
  { id: 'p1',  name: 'LED Bulb (9W)',         watts: 9,    hoursPerDay: 8,   active: true,  category: 'lighting'  },
  { id: 'p2',  name: 'Ceiling Fan',            watts: 75,   hoursPerDay: 8,   active: true,  category: 'cooling'   },
  { id: 'p3',  name: 'Standing Fan',           watts: 50,   hoursPerDay: 8,   active: true,  category: 'cooling'   },
  { id: 'p4',  name: 'Laptop',                 watts: 65,   hoursPerDay: 6,   active: true,  category: 'office'    },
  { id: 'p5',  name: 'Desktop PC',             watts: 250,  hoursPerDay: 6,   active: false, category: 'office'    },
  { id: 'p6',  name: 'Smart TV 43"',           watts: 80,   hoursPerDay: 5,   active: true,  category: 'entertainment' },
  { id: 'p7',  name: 'Smart TV 55"',           watts: 120,  hoursPerDay: 5,   active: false, category: 'entertainment' },
  { id: 'p8',  name: 'Refrigerator (100L)',    watts: 80,   hoursPerDay: 24,  active: true,  category: 'kitchen'   },
  { id: 'p9',  name: 'Refrigerator (300L)',    watts: 150,  hoursPerDay: 24,  active: false, category: 'kitchen'   },
  { id: 'p10', name: 'Water Pump (0.5HP)',     watts: 375,  hoursPerDay: 2,   active: false, category: 'water'     },
  { id: 'p11', name: 'Air Conditioner 1HP',   watts: 750,  hoursPerDay: 8,   active: false, category: 'cooling'   },
  { id: 'p12', name: 'Air Conditioner 1.5HP', watts: 1100, hoursPerDay: 8,   active: false, category: 'cooling'   },
  { id: 'p13', name: 'DSTV Decoder',           watts: 25,   hoursPerDay: 5,   active: true,  category: 'entertainment' },
  { id: 'p14', name: 'Phone Charger',          watts: 20,   hoursPerDay: 4,   active: true,  category: 'office'    },
  { id: 'p15', name: 'Security Light (LED)',   watts: 15,   hoursPerDay: 12,  active: false, category: 'lighting'  },
  { id: 'p16', name: 'Electric Iron',          watts: 1000, hoursPerDay: 1,   active: false, category: 'kitchen'   },
  { id: 'p17', name: 'Microwave',              watts: 1200, hoursPerDay: 0.5, active: false, category: 'kitchen'   },
  { id: 'p18', name: 'Washing Machine',        watts: 500,  hoursPerDay: 1,   active: false, category: 'kitchen'   },
];

export const DEFAULT_CONFIG: CalcConfig = {
  slug: 'mybrand',
  businessName: 'MyBrand Solar',
  headline: 'Get Your Free Solar Quote',
  subtext: 'Select every appliance in your home and we\'ll size a solar system specifically for you.',
  pricePerKW: 500000,
  contactWhatsapp: '',
  wattageOverrides: {},
  appliances: PRESET_APPLIANCES,
  published: true,
};

// ─── Calculation engine ───────────────────────────────────────────────────────

export function calcSystem(selections: { watts: number; qty: number; hoursPerDay: number }[]) {
  const dailyWh = selections.reduce((s, a) => s + a.watts * a.qty * a.hoursPerDay, 0);
  const dailyKWh = dailyWh / 1000;
  const peakLoadW = selections.reduce((s, a) => s + a.watts * a.qty, 0);

  // Inverter size: peak load + 25% safety margin
  const inverterKW = (peakLoadW / 1000) * 1.25;
  // Solar panels: daily kWh ÷ (4.5 peak sun hours × 0.75 derating factor)
  const panelKW = dailyKWh / (4.5 * 0.75);
  // Take the larger of the two, round up to nearest 0.5 kW
  const rawKW = Math.max(inverterKW, panelKW, 0.5);
  const systemKW = Math.ceil(rawKW * 2) / 2;

  return { dailyKWh: Math.round(dailyKWh * 100) / 100, systemKW };
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatNaira(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${Math.round(amount / 1_000)}k`;
  return `₦${amount.toLocaleString()}`;
}

export function formatNairaFull(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG');
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

export function getConfig(): CalcConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem('solarsas_calc_config');
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: CalcConfig): void {
  localStorage.setItem('solarsas_calc_config', JSON.stringify(config));
}

export function getLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('solarsas_leads');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function addLead(lead: Lead): void {
  const leads = getLeads();
  leads.unshift(lead);
  localStorage.setItem('solarsas_leads', JSON.stringify(leads));
}

export function updateLeadStatus(id: string, status: Lead['status']): void {
  const leads = getLeads();
  const i = leads.findIndex((l) => l.id === id);
  if (i !== -1) {
    leads[i].status = status;
    localStorage.setItem('solarsas_leads', JSON.stringify(leads));
  }
}

// ─── Notification read state ──────────────────────────────────────────────────
const NOTIF_KEY = 'solarsas_notifs_read_at';

export function getUnreadLeadCount(): number {
  if (typeof window === 'undefined') return 0;
  const lastRead = Number(localStorage.getItem(NOTIF_KEY) ?? 0);
  return getLeads().filter((l) => new Date(l.createdAt).getTime() > lastRead).length;
}

export function markNotifsRead(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIF_KEY, String(Date.now()));
}

// ─── Chat / Support ───────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  from: 'customer' | 'installer';
  text: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  customerName: string;
  messages: ChatMessage[];
  status: 'open' | 'closed';
  createdAt: string;
  lastMessageAt: string;
  unreadByInstaller: number;
}

const CHATS_KEY = 'solarsas_chats';

export function getChats(): Chat[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (raw) return JSON.parse(raw) as Chat[];
  } catch { /* ignore */ }
  return [];
}

function saveChats(chats: Chat[]): void {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function createChat(customerName: string, firstMessage: string): Chat {
  const now = new Date().toISOString();
  const chat: Chat = {
    id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    customerName,
    messages: [{ id: `m_${Date.now()}`, from: 'customer', text: firstMessage, createdAt: now }],
    status: 'open',
    createdAt: now,
    lastMessageAt: now,
    unreadByInstaller: 1,
  };
  const chats = getChats();
  chats.unshift(chat);
  saveChats(chats);
  return chat;
}

export function addMessageToChat(chatId: string, from: 'customer' | 'installer', text: string): void {
  const chats = getChats();
  const i = chats.findIndex((c) => c.id === chatId);
  if (i === -1) return;
  const now = new Date().toISOString();
  chats[i].messages.push({ id: `m_${Date.now()}`, from, text, createdAt: now });
  chats[i].lastMessageAt = now;
  if (from === 'customer') chats[i].unreadByInstaller += 1;
  saveChats(chats);
}

export function markChatRead(chatId: string): void {
  const chats = getChats();
  const i = chats.findIndex((c) => c.id === chatId);
  if (i !== -1) { chats[i].unreadByInstaller = 0; saveChats(chats); }
}

export function getUnreadChatCount(): number {
  if (typeof window === 'undefined') return 0;
  return getChats().reduce((sum, c) => sum + c.unreadByInstaller, 0);
}
