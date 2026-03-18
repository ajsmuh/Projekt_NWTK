import pool from '$lib/server/database.js';
''
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