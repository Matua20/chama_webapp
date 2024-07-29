const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const mysql = require('mysql2');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL successfully");

  db.query(`CREATE DATABASE IF NOT EXISTS chama_webapp`, (err, result) => {
    if (err) {
      console.error("An error occurred while creating database:", err);
      return;
    }
    console.log("Database created successfully");

    // Switching to the new database
    db.changeUser({ database: 'chama_webapp' }, (err) => {
      if (err) {
        console.error("An error occurred while changing database:", err);
        return;
      }

      // Creating the users table
      const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        idNumber VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        uniqueId VARCHAR(255) NOT NULL,
        level INT DEFAULT 0,
        referrerId INT DEFAULT NULL,
        FOREIGN KEY (referrerId) REFERENCES users(id)
      )`;

      db.query(createUsersTable, (err, result) => {
        if (err) {
          console.error("An error occurred while creating users table:", err);
          return;
        }
        console.log("Users table created successfully");

        // Creating the gifts table
        const createGiftsTable = `
        CREATE TABLE IF NOT EXISTS gifts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          amount DECIMAL(10, 2) NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          confirmed BOOLEAN DEFAULT FALSE,
          receiverId INT NOT NULL,
          giftingUserId INT NOT NULL,
          FOREIGN KEY (receiverId) REFERENCES users(id),
          FOREIGN KEY (giftingUserId) REFERENCES users(id)
        )`;

        db.query(createGiftsTable, (err, result) => {
          if (err) {
            console.error("An error occurred while creating gifts table:", err);
            return;
          }
          console.log("Gifts table created successfully");
        });
      });
    });
  });
});

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
