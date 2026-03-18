import pool from '$lib/server/database.js';

export async function GET() {
    const [rows] = await pool.query('SELECT * FROM restaurants');
    return Response.json(rows, { status: 200 });
}

function checkAuth(request) {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Basic ')) return false;

    const [user, pass] = atob(auth.split(' ')[1]).split(':');
    return user === 'admin' && pass === 'albania2024';
}

export async function POST({ request }) {
    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, city, type, rating, year_built, average_price } = await request.json();

    if (!name || !city) {
    return Response.json({ message: 'Name and city are required' }, { status: 400 });
}

    const [result] = await pool.query(
        `INSERT INTO restaurants 
        (name, city, type, rating, year_built, average_price) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, city, type, rating, year_built, average_price]
    );

    return Response.json(
        { message: 'Restaurant created', id: result.insertId },
        { status: 201 }
    );
}

import pool from '$lib/server/database.js';

function checkAuth(request) {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Basic ')) return false;

    const [user, pass] = atob(auth.split(' ')[1]).split(':');
    return user === 'admin' && pass === 'albania2024';
}


export async function GET() {
    const [rows] = await pool.query('SELECT * FROM restaurants');
    return Response.json(rows, { status: 200 });
}

export async function POST({ request }) {
    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, city, type, rating, year_built, average_price } = await request.json();

    if (!name || !city) {
        return Response.json({ message: 'Name and city are required' }, { status: 400 });
    }

    const [result] = await pool.query(
        `INSERT INTO restaurants 
        (name, city, type, rating, year_built, average_price) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, city, type, rating, year_built, average_price]
    );

    return Response.json(
        { message: 'Restaurant created', id: result.insertId },
        { status: 201 }
    );
}