// ─── Constants ────────────────────────────────────────────────────────────────

const INVERTER_EFFICIENCY = 0.85; // AC output / DC input (typical quality inverter)
const TUBULAR_DOD         = 0.5;  // Lead-acid: never drain below 50% — kills cycle life
const LITHIUM_DOD         = 0.8;  // LiFePO4: safe to 80% DoD
const TUBULAR_CAPACITY_WH = 2400; // 12V × 200Ah
const LITHIUM_CAPACITY_WH = 4800; // 48V × 100Ah

// ─── Types ────────────────────────────────────────────────────────────────────

export type BatteryPreference = 'TUBULAR_12V_200AH' | 'LITHIUM_48V_100AH';

export interface BatteryParams {
  totalLoadWatts: number;
  backupHours: number;
  batteryPreference: BatteryPreference;
}

export interface BatteryResult {
  /** Total energy the load consumes over the backup window */
  dailyEnergyKwh: number;
  /** Number of physical battery units to purchase */
  recommendedBatteryCount: number;
  /** Human-readable battery name for display */
  batteryTypeLabel: string;
  /**
   * DC bus voltage of the battery bank.
   * Tubular banks are wired in series to match the inverter:
   *   ≤1.5 kW load → 12 V  (1 × 12 V battery per string)
   *   1.5–3 kW     → 24 V  (2 × 12 V batteries in series)
   *   > 3 kW       → 48 V  (4 × 12 V batteries in series)
   * Lithium packs are always 48 V.
   */
  totalSystemVoltage: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Infer the inverter DC bus voltage from peak load for a tubular (12 V) bank.
 * Nigerian market practice: inverter voltage tier scales with load size.
 */
function inferTubularSystemVoltage(totalLoadWatts: number): number {
  if (totalLoadWatts <= 1500) return 12;
  if (totalLoadWatts <= 3000) return 24;
  return 48;
}

// ─── Main utility ─────────────────────────────────────────────────────────────

/**
 * Calculate the number of batteries required to power a given load for a
 * specified backup window, accounting for inverter losses and battery DoD.
 *
 * @example
 * calculateBatteryRequirements({
 *   totalLoadWatts: 2000,
 *   backupHours: 6,
 *   batteryPreference: 'TUBULAR_12V_200AH',
 * });
 * // → { dailyEnergyKwh: 12, recommendedBatteryCount: 6, ... }
 */
export function calculateBatteryRequirements(params: BatteryParams): BatteryResult {
  const { totalLoadWatts, backupHours, batteryPreference } = params;

  // Step 1 — Raw energy the load needs over the backup window
  const dailyEnergyWh = totalLoadWatts * backupHours;

  // Step 2 — Gross energy the battery bank must deliver (inverter isn't 100% efficient)
  const realEnergyNeededWh = dailyEnergyWh / INVERTER_EFFICIENCY;

  // Step 3 — Total nameplate capacity required, factoring in the DoD ceiling
  //          (you can only use a fraction of each battery's nameplate capacity)
  const isLithium = batteryPreference === 'LITHIUM_48V_100AH';
  const dod = isLithium ? LITHIUM_DOD : TUBULAR_DOD;
  const batteryCapacityWh = isLithium ? LITHIUM_CAPACITY_WH : TUBULAR_CAPACITY_WH;
  const requiredTotalCapacityWh = realEnergyNeededWh / dod;

  // Step 4 — Number of physical battery units (always round up — never undersize)
  const recommendedBatteryCount = Math.ceil(requiredTotalCapacityWh / batteryCapacityWh);

  // Output metadata
  const batteryTypeLabel = isLithium
    ? 'Lithium (LiFePO4) 48 V / 100 Ah'
    : 'Tubular Lead-Acid 12 V / 200 Ah';

  const totalSystemVoltage = isLithium
    ? 48
    : inferTubularSystemVoltage(totalLoadWatts);

  return {
    dailyEnergyKwh: Math.round((dailyEnergyWh / 1000) * 100) / 100,
    recommendedBatteryCount,
    batteryTypeLabel,
    totalSystemVoltage,
  };
}
