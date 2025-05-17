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
            `SELECT 
    e.expense_id AS event_id , e.title AS name, e.amount AS cost ,e.description,e.date FROM expenses e
   WHERE e.is_paid = false AND e.expense_type_id=1`
        );


        // suppliers
        const suppliers = await query(`SELECT supplier_id, name FROM supplier`);

        // expenses
        const expenses = await query(
            `SELECT e.expense_id, e.amount, e.date, e.description, e.title, et.name AS expense_type_name, e.is_paid
       FROM expenses e
       LEFT JOIN expense_type et ON e.expense_type_id = et.expense_type_id
       WHERE e.is_paid=1`
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


        return NextResponse.json({ events, suppliers, expenses, salaries });
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
        const body = await req.json();
        const { type, id, supplier_id, amount, name } = body;

        console.log(type, id);
        if (!type) {
            console.log("!type and id");
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // Pay işlemi: type göre işlem
        if (type === "events") {
            console.log("entered in if event");
            // Event ile ilişkili expenses kayıtlarını "ödenmiş" olarak işaretle
            await query(`UPDATE expenses SET is_paid = true WHERE expense_id = ?`, [id]);

        }

        else if (type === "suppliers") {

            const date = new Date().toISOString().split("T")[0];

            const insertRes = await query(`
    INSERT INTO expenses (title, amount, description, expense_type_id, is_paid, supplier_id)
   VALUES (?, ?, ?, ?, ?, ?)
  `, [name, amount, "Paid to " + name, 2, 1, supplier_id]);
            const paidExpense = {
                title: (await query(`SELECT name FROM supplier WHERE supplier_id = ?`, [supplier_id]))[0].name,
                amount,
                date,
                description: 'Paid to supplier',
                expense_type_name: 'Supplier',
            };

            return NextResponse.json({ success: true, paidExpense });
        }
        else if (type === "salaries") {
            const insertRes = await query(`
    INSERT INTO expenses (title, amount, description, expense_type_id, is_paid, employee_contract)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
                name,
                amount,
                "Paid salary",
                3, 
                1,
                id
            ]);

            const paidExpense = {
                title: name,
                amount: amount,
                description: "Paid salary",
                expense_type_name: "Salary",
            };

            return NextResponse.json({ success: true, paidExpense });
        }
        else if (type === "expenses") {
            // expenses tablosundan ilgili kaydı sil
            await query(`DELETE FROM expenses WHERE expense_id = ?`, [id]);
        }
        else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

