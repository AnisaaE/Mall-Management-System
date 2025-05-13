import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

type Data = {
  error?: string;
  success?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { name, surname, position_id, username } = req.body;

    if (!name || !surname || !position_id || !username) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Database connection settings
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

    try {
      const connection = await mysql.createConnection(dbConfig);

      // Check if the user exists
      const [userRows] = await connection.execute('SELECT * FROM user WHERE username = ?', [username]);
      if ((userRows as any).length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the position exists
      const [positionRows] = await connection.execute('SELECT * FROM positions WHERE position_id = ?', [position_id]);
      if ((positionRows as any).length === 0) {
        return res.status(404).json({ error: 'Position not found' });
      }

      // Insert the new employee
      const [result] = await connection.execute(
        'INSERT INTO employee (name, surname, position_id, username) VALUES (?, ?, ?, ?)',
        [name, surname, position_id, username]
      );

      // Check the result of the INSERT operation
      if ((result as any).affectedRows > 0) {
        return res.status(201).json({ success: 'Employee created successfully' });
      } else {
        return res.status(500).json({ error: 'Failed to create employee' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

