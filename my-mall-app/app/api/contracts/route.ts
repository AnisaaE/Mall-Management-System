import { query } from '@/lib/db/connection';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация на данните
    if (!body.shop_id || !body.start_date || !body.end_date || !body.rent_amount) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    // Проверка за валидни дати
    if (new Date(body.start_date) >= new Date(body.end_date)) {
      return NextResponse.json(
        { error: 'The start date must be before the end date' },
        { status: 400 }
      );
    }

    // A transaction is like a "package" of several database 
    // requests that must be executed either all together successfully, or none of them.
    await query('START TRANSACTION');

    const durationResult = await query(
      'INSERT INTO duration (start_date, end_date) VALUES (?, ?)',
      [body.start_date, body.end_date]
    );
    
    await query(
      `INSERT INTO shop_contract 
       (shop_id, duration_id, rent_amount, manager_id) 
       VALUES (?, ?, ?, ?)`,
      [
        body.shop_id,
        durationResult.insertId,
        parseFloat(body.rent_amount),
        body.manager_id || null
      ]
    );

    // Confirming the transaction
    await query('COMMIT');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Cancelling the transaction
    await query('ROLLBACK');
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}