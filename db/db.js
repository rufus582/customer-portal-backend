const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./portal.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');

        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                c_code text not null, 
                c_name text not null,
                c_shortName text not null, 
                c_type text not null, 
                c_salesPerson text not null, 
                c_territory text not null, 
                c_consignee text not null, 
                c_status text not null, 
                c_vendorNo text not null, 
                c_city text not null, 
                c_website text not null
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            c_code text not null,
            line1 text not null,
            line2 text not null,
            line3 text,
            city text not null
            )
        `);
    }
});

module.exports = db
