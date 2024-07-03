const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/UserRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const {protect} = require('./utils/authMiddleware')
const cors = require('cors')

dotenv.config({ path: path.resolve(__dirname, './.env') });

console.log('Environment Variables Loaded:', process.env.PORT, process.env.MONGODB_URI);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size should be less than or equal to the limit.' });
    }
  } else if (err.message === 'Invalid file type') {
    return res.status(400).json({ error: 'Invalid file type. Only allowed types are specified.' });
  }
  res.status(500).json({ error: err.message });
});

app.use('/api/uploads', uploadRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
