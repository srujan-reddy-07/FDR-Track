import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {currentDemoUser} from "@/lib/auth";
export async function GET(){
 const users=await prisma.user.findMany({select:{id:true,name:true,role:true,institutionId:true},orderBy:{role:"asc"}});
 const current=await currentDemoUser();
 return NextResponse.json({users,current:current?{id:current.id,name:current.name,role:current.role,institutionId:current.institutionId}:null});
}
