/**
 * Nigerian Solar Irradiance Data
 *
 * Peak Sun Hours (PSH) sourced from NASA POWER climatology dataset
 * (average over 22-year period, annual mean).
 *
 * PSH = the number of hours per day the sun shines at 1,000 W/m²
 * equivalent — i.e. the hours that actually produce rated panel output.
 *
 * Why this matters: a 400W panel in Kano (6.1 PSH) produces
 * 2,440 Wh/day. The same panel in Port Harcourt (4.1 PSH) produces
 * only 1,640 Wh/day — a 33% difference. Getting this wrong means
 * under- or over-sizing panels by a third.
 */

export interface StateData {
  name: string;
  zone: 'south' | 'middle-belt' | 'north';
  /** Annual average Peak Sun Hours (NASA POWER, kWh/m²/day) */
  peakSunHours: number;
  /**
   * Panel temperature derating factor.
   * Nigerian panels run hot. Formula:
   *   panel_temp ≈ ambient + 25°C (NOCT difference)
   *   power_loss ≈ (panel_temp - 25) × 0.004 per °C
   * Southern states: ~35°C ambient → ~60°C panel → ~14% loss → 0.86
   * Northern states: ~38°C ambient → ~63°C panel → ~15% loss → 0.85
   */
  tempDerating: number;
}

export const NIGERIA_STATES: Record<string, StateData> = {
  // ── South West ──────────────────────────────────────────────────────
  lagos:    { name: 'Lagos',    zone: 'south',       peakSunHours: 4.4, tempDerating: 0.86 },
  ogun:     { name: 'Ogun',     zone: 'south',       peakSunHours: 4.5, tempDerating: 0.86 },
  oyo:      { name: 'Oyo',      zone: 'south',       peakSunHours: 4.7, tempDerating: 0.86 },
  osun:     { name: 'Osun',     zone: 'south',       peakSunHours: 4.6, tempDerating: 0.86 },
  ondo:     { name: 'Ondo',     zone: 'south',       peakSunHours: 4.5, tempDerating: 0.86 },
  ekiti:    { name: 'Ekiti',    zone: 'south',       peakSunHours: 4.7, tempDerating: 0.86 },
  // ── South South ─────────────────────────────────────────────────────
  rivers:   { name: 'Rivers',   zone: 'south',       peakSunHours: 4.1, tempDerating: 0.87 },
  delta:    { name: 'Delta',    zone: 'south',       peakSunHours: 4.2, tempDerating: 0.87 },
  bayelsa:  { name: 'Bayelsa',  zone: 'south',       peakSunHours: 4.0, tempDerating: 0.87 },
  edo:      { name: 'Edo',      zone: 'south',       peakSunHours: 4.3, tempDerating: 0.87 },
  akwa:     { name: 'Akwa Ibom',zone: 'south',       peakSunHours: 4.1, tempDerating: 0.87 },
  crossriver: { name: 'Cross River', zone: 'south',  peakSunHours: 4.3, tempDerating: 0.87 },
  // ── South East ──────────────────────────────────────────────────────
  anambra:  { name: 'Anambra', zone: 'south',        peakSunHours: 4.5, tempDerating: 0.86 },
  enugu:    { name: 'Enugu',   zone: 'south',        peakSunHours: 4.6, tempDerating: 0.86 },
  imo:      { name: 'Imo',     zone: 'south',        peakSunHours: 4.4, tempDerating: 0.86 },
  abia:     { name: 'Abia',    zone: 'south',        peakSunHours: 4.4, tempDerating: 0.86 },
  ebonyi:   { name: 'Ebonyi',  zone: 'south',        peakSunHours: 4.6, tempDerating: 0.86 },
  // ── Middle Belt / North Central ─────────────────────────────────────
  fct:      { name: 'FCT (Abuja)', zone: 'middle-belt', peakSunHours: 5.5, tempDerating: 0.85 },
  kogi:     { name: 'Kogi',    zone: 'middle-belt',  peakSunHours: 5.2, tempDerating: 0.85 },
  benue:    { name: 'Benue',   zone: 'middle-belt',  peakSunHours: 5.0, tempDerating: 0.85 },
  plateau:  { name: 'Plateau', zone: 'middle-belt',  peakSunHours: 5.8, tempDerating: 0.86 }, // high altitude = cooler
  nasarawa: { name: 'Nasarawa', zone: 'middle-belt', peakSunHours: 5.3, tempDerating: 0.85 },
  niger:    { name: 'Niger',   zone: 'middle-belt',  peakSunHours: 5.4, tempDerating: 0.85 },
  kwara:    { name: 'Kwara',   zone: 'middle-belt',  peakSunHours: 5.0, tempDerating: 0.85 },
  // ── North West ──────────────────────────────────────────────────────
  kano:     { name: 'Kano',    zone: 'north',        peakSunHours: 6.2, tempDerating: 0.84 },
  kaduna:   { name: 'Kaduna',  zone: 'north',        peakSunHours: 5.9, tempDerating: 0.84 },
  katsina:  { name: 'Katsina', zone: 'north',        peakSunHours: 6.3, tempDerating: 0.84 },
  sokoto:   { name: 'Sokoto',  zone: 'north',        peakSunHours: 6.7, tempDerating: 0.83 }, // highest in Nigeria
  zamfara:  { name: 'Zamfara', zone: 'north',        peakSunHours: 6.4, tempDerating: 0.83 },
  kebbi:    { name: 'Kebbi',   zone: 'north',        peakSunHours: 6.3, tempDerating: 0.83 },
  // ── North East ──────────────────────────────────────────────────────
  borno:    { name: 'Borno',   zone: 'north',        peakSunHours: 6.5, tempDerating: 0.83 },
  yobe:     { name: 'Yobe',    zone: 'north',        peakSunHours: 6.4, tempDerating: 0.83 },
  bauchi:   { name: 'Bauchi',  zone: 'north',        peakSunHours: 6.1, tempDerating: 0.84 },
  gombe:    { name: 'Gombe',   zone: 'north',        peakSunHours: 6.0, tempDerating: 0.84 },
  adamawa:  { name: 'Adamawa', zone: 'north',        peakSunHours: 5.8, tempDerating: 0.84 },
  taraba:   { name: 'Taraba',  zone: 'north',        peakSunHours: 5.5, tempDerating: 0.85 },
};

/** Sorted list for dropdowns */
export const STATE_OPTIONS = Object.entries(NIGERIA_STATES)
  .map(([key, s]) => ({ key, label: s.name, zone: s.zone }))
  .sort((a, b) => a.label.localeCompare(b.label));

/** Fallback when no state is selected — mid-Nigeria average */
export const DEFAULT_STATE_KEY = 'fct';

// ─── Load factors ─────────────────────────────────────────────────────────────
/**
 * Appliances don't always draw their rated wattage.
 * These factors correct nameplate watts → real average consumption.
 *
 * Air conditioners: compressor cycles. At Nigerian ambient temps an inverter
 * AC cycles at ~65% when cooling actively. A non-inverter AC is closer to 80%
 * but we default to inverter AC assumptions (more common in new installs).
 *
 * Refrigerators: compressor cycles ~40–50% of the time.
 *
 * Everything else: 1.0 (resistive or continuous loads).
 */
export const LOAD_FACTORS: Record<string, number> = {
  'Air Conditioner 1HP':   0.65,
  'Air Conditioner 1.5HP': 0.65,
  'Air Conditioner 2HP':   0.65,
  'Refrigerator (100L)':   0.45,
  'Refrigerator (300L)':   0.45,
  'Refrigerator (500L)':   0.45,
  'Water Pump (0.5HP)':    1.0,  // intermittent but when on, full load
  'Microwave':             1.0,
  'Electric Iron':         1.0,
};

/** Default load factor for unlisted appliances */
export const DEFAULT_LOAD_FACTOR = 1.0;

// ─── Improved system sizing ───────────────────────────────────────────────────

export interface SizingInput {
  appliances: { name: string; watts: number; qty: number; hoursPerDay: number }[];
  stateKey: string;
  /** Fraction of load hours already covered by a generator (0–1). Default 0. */
  generatorCoverage?: number;
}

export interface SizingResult {
  /** Energy drawn at the AC terminals over 24 h */
  dailyLoadKwh: number;
  /** Energy the panels must generate (adds inverter + wiring losses) */
  dailyGenerationNeededKwh: number;
  /** Recommended solar panel array */
  panelKw: number;
  /** Recommended inverter/hybrid inverter size */
  inverterKw: number;
  /** How the two were combined into one system kW figure */
  systemKw: number;
  /** State-specific peak sun hours used */
  peakSunHours: number;
}

/**
 * Location-aware, load-factor-corrected solar system sizing.
 *
 * Accuracy improvements over the basic calcSystem():
 *  1. Uses real NASA POWER peak sun hours for each Nigerian state
 *  2. Applies load factors (AC duty cycle, fridge cycling)
 *  3. Applies panel temperature derating per climate zone
 *  4. Accounts for generator overlap
 *  5. Separates inverter sizing (peak load) from panel sizing (energy)
 */
export function calcSystemAccurate(input: SizingInput): SizingResult {
  const state = NIGERIA_STATES[input.stateKey] ?? NIGERIA_STATES[DEFAULT_STATE_KEY];
  const genCoverage = input.generatorCoverage ?? 0;

  // ── Step 1: Real daily load (apply load factors per appliance name) ──────
  let peakLoadW = 0;
  let dailyLoadWh = 0;

  for (const a of input.appliances) {
    if (a.qty === 0) continue;
    const lf = LOAD_FACTORS[a.name] ?? DEFAULT_LOAD_FACTOR;
    const realWatts = a.watts * a.qty * lf;
    peakLoadW += a.watts * a.qty;          // peak uses nameplate (for inverter sizing)
    dailyLoadWh += realWatts * a.hoursPerDay;
  }

  // Subtract whatever the generator already handles
  const solarLoadWh = dailyLoadWh * (1 - genCoverage);

  // ── Step 2: Panel sizing ──────────────────────────────────────────────────
  // Energy the panels must produce = solar load / (temp derating × system losses)
  const CABLE_LOSSES = 0.97;   // 3% wiring/mismatch loss
  const INVERTER_EFF = 0.94;   // modern hybrid inverter efficiency
  const systemLosses = state.tempDerating * CABLE_LOSSES * INVERTER_EFF;

  const dailyGenerationNeededKwh = solarLoadWh / 1000 / systemLosses;
  const rawPanelKw = dailyGenerationNeededKwh / state.peakSunHours;

  // Round up to nearest 0.5 kW and add 10% safety margin
  const panelKw = Math.ceil(rawPanelKw * 1.1 * 2) / 2;

  // ── Step 3: Inverter sizing ───────────────────────────────────────────────
  // Inverter must handle peak simultaneous load + 25% surge headroom
  const rawInverterKw = (peakLoadW / 1000) * 1.25;
  const inverterKw = Math.ceil(rawInverterKw * 2) / 2;

  // ── Step 4: Reported system kW (the bigger of the two) ───────────────────
  const systemKw = Math.max(panelKw, inverterKw);

  return {
    dailyLoadKwh:              Math.round(dailyLoadWh / 10) / 100,
    dailyGenerationNeededKwh:  Math.round(dailyGenerationNeededKwh * 100) / 100,
    panelKw,
    inverterKw,
    systemKw,
    peakSunHours: state.peakSunHours,
  };
}
