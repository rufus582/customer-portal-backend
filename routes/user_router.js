const express = require('express');

const app = express();

const db = require("../db/db")

app.post('/api/user/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error checking username:', err.message);
            return res.status(500).json({ success: false, message: 'An error occurred.' });
        }

        if (row) {
            return res.status(409).json({ success: false, message: 'Username already exists.' });
        }

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err) {
            if (err) {
                console.error('Error inserting user:', err.message);
                return res.status(500).json({ success: false, message: 'An error occurred.' });
            }

            console.log(`User with ID ${this.lastID} inserted into the database.`);
            return res.status(201).json({ success: true, message: 'User registered successfully.' });
        });
    });
});

app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    db.get('SELECT * FROM users WHERE username = ? and password = ?', [username, password], (err, row) => {
        if (err) {
            console.error('Error checking user details:', err.message);
            return res.status(500).json({ success: false, message: 'An error occurred.' });
        }

        if (row) {
            res.cookie('user', username);
            return res.status(200).json({ success: true, message: 'Logged in.' });
        } else {
            return res.status(500).json({ success: false, message: 'Username or password is wrong!!!.' });
        }
    });
});

module.exports = app