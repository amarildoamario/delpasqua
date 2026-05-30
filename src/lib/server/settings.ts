import { prisma } from "@/lib/server/prisma";
import { FREE_SHIPPING_THRESHOLD_CENTS, SHIPPING_FLAT_CENTS } from "@/lib/constants";

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  shippingFlatCents: number;
  freeShippingThresholdCents: number;
  vatRatePercent: number;
  orderNotificationEmail: string;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) {
      map[r.key] = r.value;
    }
    return {
      storeName: map.storeName ?? "Del Pasqua",
      supportEmail: map.supportEmail ?? "info@delpasqua.com",
      shippingFlatCents: Number(map.shippingFlatCents ?? String(SHIPPING_FLAT_CENTS)),
      freeShippingThresholdCents: Number(map.freeShippingThresholdCents ?? String(FREE_SHIPPING_THRESHOLD_CENTS)),
      vatRatePercent: Number(map.vatRatePercent ?? "4"),
      orderNotificationEmail: map.orderNotificationEmail ?? "",
    };
  } catch (e) {
    console.error("[SETTINGS] failed to load settings, using defaults", e);
    return {
      storeName: "Del Pasqua",
      supportEmail: "info@delpasqua.com",
      shippingFlatCents: SHIPPING_FLAT_CENTS,
      freeShippingThresholdCents: FREE_SHIPPING_THRESHOLD_CENTS,
      vatRatePercent: 4,
      orderNotificationEmail: "",
    };
  }
}
export type SettingsMap = Record<string, string>;
