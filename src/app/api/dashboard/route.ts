import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {currentDemoUser,canReadAll} from "@/lib/auth";
export async function GET() {
 const user=await currentDemoUser(); if(!user)return NextResponse.json({error:"Seed database first"},{status:503});
 const scope=canReadAll(user.role)?{}:{institutionId:user.institutionId||"__none__"};
 const all=await prisma.instrument.findMany({where:scope,include:{discrepancies:{where:{status:"OPEN"}}}});
 const now=Date.now(),days=(d:Date)=>Math.ceil((d.getTime()-now)/86400000);
 return NextResponse.json({
  total:all.length,totalValue:all.reduce((s,i)=>s+Number(i.amount),0),
  active:all.filter(i=>days(i.maturityDate)>30).length,
  expiring30:all.filter(i=>days(i.maturityDate)>=0&&days(i.maturityDate)<=30).length,
  matured:all.filter(i=>days(i.maturityDate)<0).length,
  openDiscrepancies:all.reduce((s,i)=>s+i.discrepancies.length,0),
  pending:all.filter(i=>["SUBMITTED","UNDER_SCRUTINY","DISCREPANCY_OPEN","RELEASE_REQUESTED"].includes(i.adminStatus)).length
 });
}
