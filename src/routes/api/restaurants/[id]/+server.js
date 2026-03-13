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

export async function GET({ params }) {
    const { id } = params;

    const [rows] = await pool.query(`
        SELECT 
            r.restaurant_id,
            r.name,
            c.cityname,
            cat.categoryname,
            p.price_type
        FROM restaurants r
        LEFT JOIN cities c ON r.city_id = c.cityid
        LEFT JOIN categories cat ON r.category_id = cat.categoryid
        LEFT JOIN price_ranges p ON r.priceid = p.price_id
        WHERE r.restaurant_id = ?
    `, [id]);

    if (rows.length === 0) {
        return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    return Response.json(rows[0], { status: 200 });
}
export async function PUT({ params, request }) {
    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { name, city_id, category_id, priceid } = await request.json();

    if (!name || !city_id || !category_id || !priceid) {
        return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await pool.query(
        `UPDATE restaurants 
         SET name = ?, city_id = ?, category_id = ?, priceid = ?
         WHERE restaurant_id = ?`,
        [name, city_id, category_id, priceid, id]
    );

    if (result.affectedRows === 0) {
        return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    return Response.json({ message: 'Restaurant updated' }, { status: 200 });
}