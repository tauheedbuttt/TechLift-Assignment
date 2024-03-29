require('dotenv').config()
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// models
require('./src/models/User')
require('./src/models/Post')
require('./src/models/Comment')
require('./src/models/Toll')

// routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const tollRoutes = require('./src/routes/tollRoutes');

const app = express()
const port = process.env.PORT
const uri = process.env.MONGO_URI

mongoose.set('strictQuery', false);
mongoose.connect(uri, {
  useNewUrlParser: true,
  autoIndex: true
})
mongoose.connection.on('connected', () => {
  console.log('Connected to Mongo instance')
})
mongoose.connection.on('error', (error) => {
  console.error('Error connecting to Mongo instance', error)
})

app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(bodyParser.json())
app.use(authRoutes)
app.use(tollRoutes)
// app.use(userRoutes)
// app.use(postRoutes)
// app.use(commentRoutes)

app.get('/', (req, res) => res.send('Home'))

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})