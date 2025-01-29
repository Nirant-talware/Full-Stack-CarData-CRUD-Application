const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'car_db'
});

db.connect((err) => {
  if (err) {
    console.error('Could not connect to database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = Date.now() + fileExtension;  
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });


router.post('/uploads', upload.single('image'), (req, res) => {
  if (req.file) {
    
    const ImageUrl = `http://localhost:3000/api/cars/uploads/${req.file.filename}`;  
    res.json({ ImageUrl: ImageUrl });  
  } else {
    res.status(400).send('No file uploaded');
  }
});


router.post('/', (req, res) => {
  const { Comp_Name, Car_Name, Color, City, State, ZipCode, isAgree, ImageUrl } = req.body;
  const query = 'INSERT INTO cars (Comp_Name, Car_Name, Color, City, State, ZipCode, isAgree, ImageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [Comp_Name, Car_Name, Color, City, State, ZipCode, isAgree, ImageUrl], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error inserting car data', error: err });
    } else {
      res.status(201).send({ message: 'Car added successfully', Car_Id: results.insertId });
    }
  });
});


router.get('/', (req, res) => {
  db.query('SELECT * FROM cars', (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching cars data', error: err });
    } else {
      console.log('Cars from database:', results);
      res.json(results);
    }
  });
});

// Get car by ID
router.get('/:id', (req, res) => {
  const Car_Id = req.params.id;
  db.query('SELECT * FROM cars WHERE Car_Id = ?', [Car_Id], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching car data', error: err });
    } else {
      res.json(results[0]); 
    }
  });
});

// Update car
router.put('/:id', (req, res) => {
  const Car_Id = req.params.id;
  const { Comp_Name, Car_Name, Color, City, State, ZipCode, isAgree, ImageUrl } = req.body;
  const query = 'UPDATE cars SET Comp_Name = ?, Car_Name = ?, Color = ?, City = ?, State = ?, ZipCode = ?, isAgree = ?, ImageUrl = ? WHERE Car_Id = ?';
  db.query(query, [Comp_Name, Car_Name, Color, City, State, ZipCode, isAgree, ImageUrl, Car_Id], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error updating car data', error: err });
    } else {
      res.send({ message: 'Car updated successfully' });
    }
  });
});

// Delete car
router.delete('/:id', (req, res) => {
  const Car_Id = req.params.id;
  const query = 'DELETE FROM cars WHERE Car_Id = ?';
  db.query(query, [Car_Id], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error deleting car', error: err });
    } else {
      res.send({ message: 'Car deleted successfully' });
    }
  });
});

module.exports = router;
