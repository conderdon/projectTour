// server.js
const express = require('express');
const SQLite = require('better-sqlite3');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Инициализируем Express приложение
const app = express();
app.use(cors()); // Разрешаем запросы с других доменов
app.use(express.json()); // Для обработки JSON-запросов

// Создаем или открываем базу данных
const db = new SQLite('mydatabase.db');

// Создаем таблицу tours
const createToursTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      days INTEGER,
      nights INTEGER,
      price TEXT,
      type TEXT,    -- Тип тура, например, "пеший", "автомобильный"
      photo1 TEXT,  -- Ссылка на первое фото
      photo2 TEXT,  -- Ссылка на второе фото
      photo3 TEXT   -- Ссылка на третье фото
    );
  `;
  db.prepare(sql).run();
};

// Добавляем новый столбец mapImage, если он ещё не существует
const addMapImageColumn = () => {
  try {
    const sql = `
      ALTER TABLE tours ADD COLUMN mapImage BLOB DEFAULT NULL;
    `;
    db.prepare(sql).run();
    console.log("Столбец 'mapImage' добавлен в таблицу tours.");
  } catch (error) {
    if (error.message.includes("duplicate column name")) {
      console.log("Столбец 'mapImage' уже существует.");
    } else {
      console.error("Ошибка при добавлении столбца 'mapImage':", error.message);
    }
  }
};

// Вызов функции для добавления столбца mapImage
addMapImageColumn();



const createReviewsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tourId INTEGER NOT NULL,
      username TEXT NOT NULL,
      comment TEXT NOT NULL,
      FOREIGN KEY (tourId) REFERENCES tours (id) ON DELETE CASCADE
    )
  `;
  db.prepare(sql).run();
};

createReviewsTable();



// Получить отзывы для конкретного фильма
app.get('/reviews/:tourId', (req, res) => {
  const { tourId } = req.params;
  const sql = `SELECT * FROM reviews WHERE tourId = ?`;
  const reviews = db.prepare(sql).all(tourId);
  res.json(reviews);
});




// Добавить новый отзыв
app.post('/reviews', (req, res) => {
  const { tourId, username, comment } = req.body;
  const sql = `
    INSERT INTO reviews (tourId, username, comment)
    VALUES (?, ?, ?)
  `;
  db.prepare(sql).run(tourId, username, comment);
  res.status(201).send('Review added');
});




// Создаем таблицу requests (заявки)
const createRequestsTable = () => {
  const sql = ` 
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      tour_id INTEGER, 
      people_count INTEGER,
      message TEXT,
      total_cost INTEGER,
      FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
    );
  `;
  db.prepare(sql).run();
};

// API для добавления заявки
app.post('/requests', (req, res) => {
  const { name, email, phone, tourId, peopleCount, message, totalCost } = req.body;

  const sql = `
    INSERT INTO requests (name, email, phone, tour_id, people_count, message, total_cost)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.prepare(sql).run(name, email, phone, tourId, peopleCount, message || '', totalCost || 0);
  res.status(201).send('Заявка отправлена!');
});




// API для добавления нового тура
app.post('/tours', upload.single('mapImage'), (req, res) => {
  const { name, description, days, nights, price, type, photo1, photo2, photo3 } = req.body;
  const mapImage = req.file ? req.file.buffer : null; // Получаем бинарные данные изображения

  // Проверяем, что файл существует, если он требуется
  if (!mapImage) {
    return res.status(400).send('Map image is required');
  }

  insertTour(name, description, days, nights, price, type, photo1, photo2, photo3, mapImage);
  res.status(201).send('Tour added');
});


// Функция для добавления нового тура
const insertTour = (name, description, days, nights, price, type, photo1, photo2, photo3, mapImage) => {
  const sql = `
    INSERT INTO tours (name, description, days, nights, price, type, photo1, photo2, photo3, mapImage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.prepare(sql).run(name, description, days, nights, price, type, photo1, photo2, photo3, mapImage);
};

// Функция для получения всех туров// Функция для получения всех туров
const getTours = () => {
  const sql = 'SELECT * FROM tours';
  const tours = db.prepare(sql).all();

  // Преобразуем BLOB в строку base64 для каждого тура
  return tours.map(tour => ({
    ...tour,
    mapImage: tour.mapImage ? tour.mapImage.toString('base64') : null, // Преобразуем BLOB в base64
  }));
};

// Функция для получения всех заявок
const getRequests = () => {
  const sql = `SELECT requests.*, tours.name as tour_name 
  FROM requests
  LEFT JOIN tours ON requests.tour_id = tours.id`;
  return db.prepare(sql).all();

  
};





// API для удаления отзыва
app.delete('/reviews/:id', (req, res) => {
  const { id } = req.params;
  try {
    const sql = `DELETE FROM reviews WHERE id = ?`;
    const result = db.prepare(sql).run(id);

    if (result.changes === 0) {
      return res.status(404).send('Review not found');
    }
    res.status(200).send('Review deleted');
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).send('Error deleting review');
  }
});




// API для удаления тура
app.delete('/tours/:id', (req, res) => {
  const { id } = req.params;
  try {
    const sql = `DELETE FROM tours WHERE id = ?`;
    const result = db.prepare(sql).run(id);

    if (result.changes === 0) {
      return res.status(404).send('Tour not found');
    }
    res.status(200).send('Tour deleted');
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).send('Error deleting tour');
  }
});



// API для удаления заявки
app.delete('/requests/:id', (req, res) => {
  const { id } = req.params;
  try {
    const sql = `DELETE FROM requests WHERE id = ?`;
    const result = db.prepare(sql).run(id);

    if (result.changes === 0) {
      return res.status(404).send('Request not found');
    }
    res.status(200).send('Request deleted');
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).send('Error deleting request');
  }
});






// Регистрация заявки
const insertRequest = (name, email, tour_id, message) => {
  const sql = `
    INSERT INTO requests (name, email, tour_id, message)
    VALUES (?, ?, ?, ?)
  `;
  db.prepare(sql).run(name, email, tour_id, message);
};

// Создание таблиц, если они еще не существуют
createToursTable();
createRequestsTable();

// API для получения всех туров
app.get('/tours', (req, res) => {
  const tours = getTours();
  res.json(tours);
});

// API для получения всех заявок
app.get('/requests', (req, res) => {
  const requests = getRequests();
  res.json(requests);
});


// API для добавления заявки
app.post('/requests', (req, res) => {
  const { name, email, tour_id, message } = req.body;
  insertRequest(name, email, tour_id, message);
  res.status(201).send('Request submitted');
});

// Запуск сервера на порту 5001
const port = 5001;
app.listen(port, () => {
  console.log('Server is running on http://localhost:5001');
});

module.exports = app;
