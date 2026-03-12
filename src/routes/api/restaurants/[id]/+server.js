import pool from '$lib/server/database.js';

function checkAuth(request) {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Basic ')) return false;

    const [user, pass] = atob(auth.split(' ')[1]).split(':');
    return user === 'admin' && pass === 'albania2024';
}

// GET all restaurants
export async function GET() {
    const [rows] = await pool.query(`
        SELECT r.restaurant_id, r.name,
               c.cityname,
               cat.categoryname,
               p.price_type
        FROM restaurants r
        JOIN cities c ON r.city_id = c.cityid
        JOIN categories cat ON r.category_id = cat.categoryid
        JOIN price_ranges p ON r.priceid = p.price_id
    `);

    return Response.json(rows, { status: 200 });
}

// CREATE new restaurant
export async function POST({ request }) {

    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, city_id, category_id, priceid } = await request.json();

    if (!name || !city_id || !category_id || !priceid) {
        return Response.json(
            { message: 'Missing required fields' },
            { status: 400 }
        );
    }

    const [result] = await pool.query(
        `INSERT INTO restaurants (name, city_id, category_id, priceid)
         VALUES (?, ?, ?, ?)`,
        [name, city_id, category_id, priceid]
    );

    return Response.json(
        { message: 'Restaurant created', id: result.insertId },
        { status: 201 }
    );
}