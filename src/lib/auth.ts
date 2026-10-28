import { cookies } from "next/headers";
import { prisma } from "./prisma";
export async function currentDemoUser() {
  const jar = await cookies();
  const id = jar.get("fdr-demo-user")?.value;
  if (id) { const user = await prisma.user.findUnique({where:{id}}); if (user) return user; }
  return prisma.user.findFirst({where:{role:"ADMIN"}});
}
export function canReadAll(role:string) { return ["SCRUTINY_OFFICER","COMPETENT_AUTHORITY","AUDITOR","ADMIN"].includes(role); }
export function canMutate(role:string) { return ["SCRUTINY_OFFICER","COMPETENT_AUTHORITY","ADMIN"].includes(role); }
