import { query } from "@/lib/db/connection";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { contractId: string } }) {
  const contractId = params.contractId;

  try {
    await query(`DELETE FROM employee_contract WHERE employee_contract = ?`, [contractId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sözleşme silme hatası:", error);
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}
