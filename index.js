const express = require('express');
const app = express();
const port = 3000;
const pg = require('pg');
const client = new pg.Client('postgres://localhost:5432/block34');

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

app.get('/', async (req, res) => {
  const result = await client.query('SELECT * FROM customers');
  console.table(result.rows);
  res.send(result.rows);
});

app.get('/restaurants', async (req, res) => {
  const result = await client.query('SELECT * FROM restaurants');
  console.table(result.rows);
  res.send(result.rows);
});

// createCustomer
app.post('/customers', async (req, res) => {
  const { name } = req.body;
  const result = await client.query(
    'INSERT INTO customers (name) VALUES ($1) RETURNING *',
    [name]
  );
  res.json(result.rows);
});

// createRestaurant
app.post('/restaurants', async (req, res) => {
  const { name } = req.body;
  const result = await client.query(
    'INSERT INTO restaurants (name) VALUES ($1) RETURNING *',
    [name]
  );
});

// createReservation
app.post('/reservations', async (req, res) => {
  const { date, party_counter, customer_id, restaurant_id } = req.body;
  const result = await client.query(
    'INSERT INTO reservations (date, party_counter, customer_id, restaurant_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [date, party_counter, customer_id, restaurant_id]
  );
  res.json(result.rows);
});

// destroyReservation
app.delete('/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const result = await client.query(
    'DELETE FROM reservations WHERE id = $1 RETURNING *',
    [id]
  );
});
