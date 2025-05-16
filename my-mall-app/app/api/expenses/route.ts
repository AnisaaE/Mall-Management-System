import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { query } from "@/lib/db/connection";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // eventler (unpaid)
    const events = await query(
      `SELECT event_id, start_date, end_date, cost, description, name FROM event`
    );

    // suppliers
    const suppliers = await query(`SELECT supplier_id, name FROM supplier`);

    // expenses
    const expenses = await query(
      `SELECT e.expense_id, e.amount, e.date, e.description, e.title, et.name AS expense_type_name
       FROM expenses e
       LEFT JOIN expense_type et ON e.expense_type_id = et.expense_type_id`
    );

    const salaries = await query(`
    SELECT 
    ec.employee_contract AS contract_id,
    e.name AS employee_name,
    DATE_FORMAT(d.start_date, '%Y-%m-%d') AS start_date,
    DATE_FORMAT(d.end_date, '%Y-%m-%d') AS end_date,
    ec.salary
  FROM employee_contract ec
  JOIN employee e ON ec.employee_id = e.employee_id
  JOIN duration d ON ec.duration_id = d.duration_id
  WHERE CURDATE() BETWEEN d.start_date AND d.end_date
`);


    // paidExpenses (şimdilik boş dizi olarak döndürüyoruz, kendi DB yapına göre güncelle)
    const paidExpenses: any[] = [];

    return NextResponse.json({ events, suppliers, expenses, paidExpenses,salaries });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, id } = await req.json();

    if (!type || !id) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Pay işlemi: type göre işlem
    if (type === "events") {
      // event tablosundan silme değil, bu event ile ilişkili unpaid expenses silinebilir veya
      // Bu örnekte sadece expenses tablosundaki unpaid kayıtları sil (trigger ile event -> expenses eklenmiş varsayımı)

      // expenses tablosundaki event kaynaklı unpaid kaydı silmek için:
      // varsayalım expenses.title = event.name ile ilişkilendirilmiş
      // Daha kesin bir ilişki için event_id foreign key ekleyebilirsin, biz basit yapıyoruz

      // expenses'den event adı ile eşleşeni sil
      await query(`DELETE FROM expenses WHERE title = (SELECT name FROM event WHERE event_id = ?) AND expense_type_id = (SELECT expense_type_id FROM expense_type WHERE name = 'unpaid')`, [id]);

      // event tablosundan kayıt silme istersen:
      // await query(`DELETE FROM event WHERE event_id = ?`, [id]);

    } else if (type === "suppliers") {
      // suppliers tablosunda pay sonrası işlem yok, demo olarak hiçbir şey yapma

    } else if (type === "expenses") {
      // expenses tablosundan ilgili kaydı sil
      await query(`DELETE FROM expenses WHERE expense_id = ?`, [id]);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

