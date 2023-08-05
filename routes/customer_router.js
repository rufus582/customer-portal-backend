const express = require('express');

const app = express();

const db = require("../db/db")

app.post('/api/customer/new', (req, res) => {
    const { c_code, c_name, c_shortName, c_type, c_salesPerson, c_territory, c_consignee, c_status, c_vendorNo, c_city, c_website, addresses } = req.body;
    const error = undefined


    db.run('INSERT INTO customers (c_code, c_name, c_shortName, c_type, c_salesPerson, c_territory, c_consignee, c_status, c_vendorNo, c_city, c_website) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [c_code, c_name, c_shortName, c_type, c_salesPerson, c_territory, c_consignee, c_status, c_vendorNo, c_city, c_website], function (err) {
        if (err) {
            console.error('Error inserting user:', err.message);
            return res.status(500).json({ success: false, message: 'An error occurred while adding customer.' });
        } else {
            console.log(`Customer with ID ${this.lastID} inserted into the database.`);

            for (address of addresses) {
                db.run("insert into addresses (c_code, line1, line2, line3, city) values (?, ?, ?, ?, ?)", [c_code, address.line1, address.line2, address.line3, address.city],
                    (err) => {
                        if (err) {
                            console.error('Error inserting address:', err.message);
                            error = err
                        } else {
                            console.log("new address inserted!");
                        }
                    }
                )
            }

            if (error) {
                return res.status(500).json({ success: false, message: 'An error occurred while adding address.' });
            } else {
                return res.status(200).json({ success: true, message: 'customer added successfully.' });
            }
        }
    });

    console.log(req.body);
});

app.get('/api/customer/view/:c_code', (req, res) => {
    db.get("select * from customers where c_code = ?", [req.params.c_code], (err, customerRow) => {
        if (err) {
            console.error('Error fetching customer:', err.message);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching customer.' });
        } else {
            if (customerRow) {
                db.all("select * from addresses where c_code = ?", [req.params.c_code], (err, addressRows) => {
                    if (err) {
                        console.error('Error fetching customer address:', err.message);
                        return res.status(500).json({ success: false, message: 'An error occurred while fetching customer\'s address.' });
                    } else {
                        if (addressRows) {
                            return res.status(200).json({ ...customerRow, addresses: addressRows })
                        } else {
                            return res.status(200).json({ ...customerRow, addresses: [] })
                        }
                    }
                })
            } else {
                console.error('Customer not found');
                return res.status(404).json({ success: false, message: 'Customer not found!' });
            }
        }
    })
});

module.exports = app