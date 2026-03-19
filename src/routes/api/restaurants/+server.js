// Import der Datenbankverbindung
import pool from '$lib/server/database.js';

// Import von Benutzername und Passwort aus den privaten Umgebungsvariablen
import {API_PASS, API_USER} from '$env/static/private';

/**
 * Überprüft die Basic-Auth-Header im Request.
 * @param {Request} request - Der eingehende Request.
 * @returns {boolean} - true, wenn Benutzername und Passwort korrekt sind.
 */

// GET-Methode → Alle Restaurants abrufen
export async function GET() {
    // SQL-Abfrage: Alle Einträge aus der Tabelle holen
    const [rows] = await pool.query('SELECT * FROM restaurants');

    // Ergebnis als JSON zurückgeben
    return Response.json(rows, { status: 200 });
}


// Funktion zur Überprüfung der Basic Authentication
function checkAuth(request) {
    // Authorization-Header holen
    const auth = request.headers.get('Authorization');

    // Prüfen, ob Header vorhanden ist und korrekt beginnt
    if (!auth || !auth.startsWith('Basic ')) return false;

    // Base64 dekodieren und in Benutzername + Passwort aufteilen
    const [user, pass] = atob(auth.split(' ')[1]).split(':');

    //Vergleichen mit den Umgebungsvariablen
    return user == API_USER && pass === API_PASS;

}


// POST-Methode → Neues Restaurant erstellen
export async function POST({ request }) {

    // Zugriff nur mit gültiger Authentifizierung
    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Daten aus dem Request-Body lesen
    const { name, city, type, rating, year_built, average_price } = await request.json();

    // Pflichtfelder prüfen
    if (!name || !city) {
        return Response.json({ message: 'Name and city are required' }, { status: 400 });
    }

    // SQL-Insert: Neues Restaurant speichern
    const [result] = await pool.query(
        `INSERT INTO restaurants 
        (name, city, type, rating, year_built, average_price) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, city, type, rating, year_built, average_price]
    );

    // Erfolgreiche Erstellung zurückgeben (inkl. ID)
    return Response.json(
        { message: 'Restaurant created', id: result.insertId },
        { status: 201 }
    );
}