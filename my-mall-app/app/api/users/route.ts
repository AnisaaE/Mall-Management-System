import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { query } from "@/lib/db/connection";
import {hash} from 'bcrypt';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Взимаме всички потребители
        const users = await query("SELECT * FROM user");
        
        // Взимаме мениджъри без потребителски акаунт
        const managers = await query(`
            SELECT 
                m.manager_id, 
                m.name, 
                c.mail, 
                c.phone 
            FROM manager m
            JOIN contact c ON m.contact_id = c.contact_id
            WHERE m.username IS NULL
        `);
        
        // Взимаме счетоводители без потребителски акаунт
        const accountants = await query(`
            SELECT 
                e.employee_id, 
                e.name, 
                e.surname, 
                p.position_name as position
            FROM employee e
            JOIN positions p ON e.position_id = p.position_id
            WHERE e.username IS NULL AND p.position_name= 'accountant'
        `);

        return NextResponse.json({ 
            users: users || [],
            managers: managers || [],
            accountants: accountants || []
        });
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
        const { username, password, role, managerId, employeeId } = body;

        if (!username || !password || !role) {
            return NextResponse.json(
                { error: "Username, password and role are required" },
                { status: 400 }
            );
        }

        const userExists = await query(
            "SELECT * FROM user WHERE username = ?",
            [username]
        );
        
        if (userExists.length > 0) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 400 }
            );
        }

          const saltRounds = 10;
        const password_hash = await hash(password, saltRounds);


    
        await query("START TRANSACTION");

        
        await query(
            "INSERT INTO user (username, password_hash, role) VALUES (?, ?, ?)",
            [username, password_hash, role]
        );

        if (role === "manager" && managerId) {
            await query(
                "UPDATE manager SET username = ? WHERE manager_id = ?",
                [username, managerId]
            );
        }

        if (role === "accountant" && employeeId) {
            await query(
                "UPDATE employee SET username = ? WHERE employee_id = ?",
                [username, employeeId]
            );
        }

        await query("COMMIT");

        return NextResponse.json({ success: true });
    } catch (error) {
        await query("ROLLBACK");
        console.error(error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        // Започваме транзакция
        await query("START TRANSACTION");

        // 1. Проверяваме дали потребителят е мениджър
        const manager = await query(
            "SELECT manager_id FROM manager WHERE username = ?",
            [username]
        );

        if (manager.length > 0) {
            await query(
                "UPDATE manager SET username = NULL WHERE username = ?",
                [username]
            );
        }

        // 2. Проверяваме дали потребителят е служител
        const employee = await query(
            "SELECT employee_id FROM employee WHERE username = ?",
            [username]
        );

        if (employee.length > 0) {
            await query(
                "UPDATE employee SET username = NULL WHERE username = ?",
                [username]
            );
        }

        // 3. Изтриваме потребителя
        await query(
            "DELETE FROM user WHERE username = ?",
            [username]
        );

        // Приключваме транзакцията
        await query("COMMIT");

        return NextResponse.json({ success: true });
    } catch (error) {
        // Отменяме транзакцията при грешка
        await query("ROLLBACK");
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
