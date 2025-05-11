import { query } from '@/lib/db/connection';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name ) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    await query('START TRANSACTION');

    let contactId = null;
    if (body.phone || body.email) {
      const contactResult = await query(
        'INSERT INTO contact (phone, mail) VALUES (?, ?)',
        [body.phone || null, body.email || null]
      );
      contactId = contactResult.insertId;
    }

    const managerResult = await query(
      'INSERT INTO manager (name, contact_id) VALUES (?, ?)',
      [body.name,  contactId]
    );

    await query('COMMIT');
console.log
    return NextResponse.json({ 
      success: true,
      manager_id: managerResult.insertId
    });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Erorr creating manager:', error);
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}