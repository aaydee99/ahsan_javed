import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import subscriptionRoutes from './routes/subscription.route';
import chatRoutes from './routes/chat.route';
import otpRoutes from './routes/otp.routes';
import { chatSocket } from './sockets/chat.socket';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { query } from './db';
import multer from 'multer'
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.use(express.json());

// Use existing routes
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/otp', otpRoutes);


app.post('/register', async (req, res) => {
  const { FullName, PhoneNo, City, Password, Email, Country } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    const result = await query(
      'INSERT INTO "User" ("FullName", "PhoneNo", "City", "Password", "Email", "Country") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [FullName, PhoneNo, City, hashedPassword, Email, Country]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error.stack);
    res.status(500).json({ error: 'Database error' });
  }
});
// Login endpoint
app.post('/login', async (req, res) => {
  const { PhoneNo, Password } = req.body;

  try {
    const result = await query(
      'SELECT * FROM "User" WHERE "PhoneNo" = $1',
      [PhoneNo]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid phone number or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(Password, user.Password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid phone number or password' });
    }

    res.status(200).json({ User_Id: user.User_Id, FullName: user.FullName, City: user.City });
  } catch (error) {
    console.error('Database query error:', error.stack);
    res.status(500).json({ error: 'Database error' });
  }
});
// In your Express server file

app.post('/addproperty', upload.single('Image'), async (req, res) => {
  const {
    Title, City, Price, Type, Description,  Zipcode, Longitude, Latitude, User_Id
  } = req.body;
  const image = req.file;

  try {
    // Parse longitude and latitude as floats
    const parsedLongitude = parseFloat(Longitude);
    const parsedLatitude = parseFloat(Latitude);

    const result = await query(
      `INSERT INTO "PropertyDetails" (
        "Title", "City", "Price", "Type", "Description",
      "Image", "Zipcode", "Geometry", "User_Id"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, point($8, $9),$10 )
      RETURNING *`,
      [Title, City, Price, Type, Description,
      image ? image.buffer : null, Zipcode, parsedLongitude, parsedLatitude, User_Id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error.stack);
    res.status(500).json({ error: 'Database error' });
  }
});


app.get('/properties', async (req, res) => {
  try {
    const result = await query('SELECT * FROM "Property"');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Database query error:', error.stack);
    res.status(500).json({ error: 'Database error' });
  }
});

// Initialize the chat socket
chatSocket(io);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
