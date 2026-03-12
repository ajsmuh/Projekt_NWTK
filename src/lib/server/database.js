import mysql from 'mysql2/promise';
import {DB_NAME, DB_USER, DB_PASSWORD,DB_PORT,DB_HOST} from '$env/static/private';
export const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});
 
export default pool;
 