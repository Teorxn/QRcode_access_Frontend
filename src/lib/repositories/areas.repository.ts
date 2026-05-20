import { areasApi } from "@/lib/api";
import type { Area } from "@/types/area";

export async function listAreas(): Promise<Area[]> {
  const areas = await areasApi.list();
  return areas.sort((a, b) => a.nombreArea.localeCompare(b.nombreArea));
}
