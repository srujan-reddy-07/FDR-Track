import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {currentDemoUser} from "@/lib/auth";
import {verifyAuditChain} from "@/lib/audit";
export async function GET() {
 const user=await currentDemoUser(); if(!user || !["AUDITOR","ADMIN","SCRUTINY_OFFICER","COMPETENT_AUTHORITY"].includes(user.role))return NextResponse.json({error:"Permission denied"},{status:403});
 return NextResponse.json({entries:await prisma.auditLog.findMany({orderBy:{timestamp:"desc"},take:100}),verification:await verifyAuditChain()});
}
