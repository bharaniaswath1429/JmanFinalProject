const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes')
const sequelize = require('./config/dbConfig');
const trainingperformanceRoutes = require('./routes/trainingperformanceRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')
const retainedRoutes = require('./routes/retainedRoutes')
const topperformersRoutes = require('./routes/topperformersRoutes')

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
}));


app.use('/api', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', retainedRoutes);
app.use('/api', topperformersRoutes);
app.use('/api', trainingperformanceRoutes)
app.use('/api/feedback', feedbackRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.log('Error connecting to database:', error);
  }
});
