import pool from '$lib/server/database.js';
import { API_USER, API_PASS } from '$env/static/private';

function checkAuth(request) {
    const auth = request.headers.get('Authorization');
    if (!auth?.startsWith('Basic ')) return false;

    const base64 = auth.slice(6);
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');

    return user === API_USER && pass === API_PASS;
}
// GET ONE RESTAURANT
export async function GET({ params }) {
    const { id } = params;

    const [rows] = await pool.query(
        'SELECT * FROM restaurants WHERE restaurant_id = ?',
        [id]
    );

    if (rows.length === 0) {
        return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    return Response.json(rows[0], { status: 200 });
}

// UPDATE RESTAURANT
export async function PUT({ params, request }) {
    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { name, city, type, rating, year_built, average_price } = await request.json();

    if (!name || !city) {
        return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await pool.query(
        `UPDATE restaurants 
         SET name = ?, city = ?, type = ?, rating = ?, year_built = ?, average_price = ?
         WHERE restaurant_id = ?`,
        [name, city, type, rating, year_built, average_price, id]
    );

    if (result.affectedRows === 0) {
        return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    return Response.json({ message: 'Restaurant updated' }, { status: 200 });
}
// DELETE RESTAURANT
export async function DELETE({ params, request }) {
    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const [result] = await pool.query(
        'DELETE FROM restaurants WHERE restaurant_id = ?',
        [id]
    );

    if (result.affectedRows === 0) {
        return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
}
const { id } = params;
if (!id) {
    return Response.json({ message: 'Invalid ID' }, { status: 400 });
}