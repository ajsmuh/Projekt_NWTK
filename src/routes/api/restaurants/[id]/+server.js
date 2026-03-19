// Import der Datenbankverbindung (Connection Pool)
import pool from '$lib/server/database.js';

// Import von Benutzername und Passwort aus den privaten Umgebungsvariablen
import { API_USER, API_PASS } from '$env/static/private';
/**
 * Überprüft die Basic-Auth-Header im Request.
 * @param {Request} request - Der eingehende Request.
 * @returns {boolean} - true, wenn Benutzername und Passwort korrekt sind.
 */

// Funktion zur Überprüfung der Basic Authentication
function checkAuth(request) {
    // Authorization-Header aus der Anfrage holen
    const auth = request.headers.get('Authorization');

    // Prüfen, ob der Header existiert und mit "Basic " beginnt
    if (!auth?.startsWith('Basic ')) return false;

    // Base64-Teil des Headers extrahieren (nach "Basic ")
    const base64 = auth.slice(6);

    // Base64 dekodieren → ergibt "username:password"
    const decoded = atob(base64);

    // Benutzername und Passwort trennen
    const [user, pass] = decoded.split(':');

    // Vergleich mit den gespeicherten Zugangsdaten
    return user === API_USER && pass === API_PASS;
}


// GET-Methode → Einzelnes Restaurant anhand der ID abrufen
export async function GET({ params }) {
    const { id } = params;

    // SQL-Abfrage: Restaurant mit bestimmter ID suchen
    const [rows] = await pool.query(
        'SELECT * FROM restaurants WHERE restaurant_id = ?',
        [id]
    );

    // Falls kein Restaurant gefunden wurde → 404 Fehler
    if (rows.length === 0) {
        return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    // Gefundenes Restaurant zurückgeben
    return Response.json(rows[0], { status: 200 });
}


// PUT-Methode → Restaurant aktualisieren
export async function PUT({ params, request }) {

    // Zugriff nur erlaubt, wenn Authentifizierung erfolgreich ist
    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Daten aus dem Request-Body lesen
    const { name, city, type, rating, year_built, average_price } = await request.json();

    // Prüfen, ob Pflichtfelder vorhanden sind
    if (!name || !city) {
        return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // SQL-Update durchführen
    const [result] = await pool.query(
        `UPDATE restaurants 
         SET name = ?, city = ?, type = ?, rating = ?, year_built = ?, average_price = ?
         WHERE restaurant_id = ?`,
        [name, city, type, rating, year_built, average_price, id]
    );

    // Falls keine Zeile geändert wurde → Restaurant existiert nicht
    if (result.affectedRows === 0) {
        return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    // Erfolgreiche Aktualisierung
    return Response.json({ message: 'Restaurant updated' }, { status: 200 });
}


// DELETE-Methode → Restaurant löschen
export async function DELETE({ params, request }) {

    // Zugriff nur mit gültiger Authentifizierung
    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // SQL-Delete ausführen
    const [result] = await pool.query(
        'DELETE FROM restaurants WHERE restaurant_id = ?',
        [id]
    );

    // Falls kein Datensatz gelöscht wurde → nicht gefunden
    if (result.affectedRows === 0) {
        return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    // Erfolgreich gelöscht → kein Inhalt zurückgeben (204)
    return new Response(null, { status: 204 });
}

 