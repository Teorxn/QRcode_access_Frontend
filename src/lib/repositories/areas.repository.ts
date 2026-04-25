import { mockDb } from "@/lib/mock/database";
import type { Area } from "@/types/area";

export async function listAreas(): Promise<Area[]> {
  return mockDb.getAreas().sort((a, b) => a.nombreArea.localeCompare(b.nombreArea));
}
