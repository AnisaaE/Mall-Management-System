import { query } from "@/lib/db/connection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const employee_id = formData.get("employee_id");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  const salary = parseFloat(formData.get("salary") as string);

  try {
    // 1. Süreyi duration tablosuna ekle
    const durationResult = await query(
      `INSERT INTO duration (start_date, end_date) VALUES (?, ?)`,
      [start_date, end_date]
    );

    // 2. Oluşan duration_id'yi al
    const duration_id = durationResult.insertId;

    if (!duration_id) {
      console.error("❌ duration_id alınamadı:", durationResult);
      return NextResponse.json({ error: "Süre eklenemedi" }, { status: 500 });
    }

    // 3. Sözleşmeyi employee_contract tablosuna ekle
    await query(
      `INSERT INTO employee_contract (employee_id, duration_id, salary) VALUES (?, ?, ?)`,
      [employee_id, duration_id, salary]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Sözleşme ekleme hatası:", error);
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
