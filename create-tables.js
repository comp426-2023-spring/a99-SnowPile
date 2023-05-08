const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const createTables = () => {
  const dbPath = path.resolve(__dirname, './db/database.db');
  const schemaPath = path.resolve(__dirname, './schema.sql');

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log('Connected to the database.');

    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }

      if (!row) {
        const schema = fs.readFileSync(schemaPath, { encoding: 'utf-8' });

        db.exec(schema, (err) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log('Tables created successfully.');
          }
        });
      }

      db.close((err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Connection to the database closed.');
        }
      });
    });
  });
};

module.exports = createTables;
