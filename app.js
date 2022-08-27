const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Todo = require('./models/todo') // load todo model
const app = express()
const bodyParser = require('body-parser')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})
//setting route
//homepages

app.get('/', (req, res) => {
  Todo.find() // get all data from Todo Model
    .lean() //  change mongoose's model to clean JS data array
    .then((todos) => res.render('index', { todos })) // data send to index template
    .catch((error) => console.error(error))
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name //through req.body get data "name"
  return Todo.create({ name }) //save to database
    .then(() => res.redirect('/')) // after add new , back to home page
    .catch((error) => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
