const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const compression = require('compression')

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(compression())

app.use(express.static(path.join(__dirname, '..', 'public')));

//app.use('/api', require('./api'))

app.use('*', (req, res) => {
  res.send(path.join(__dirname, '..', 'client', 'public/index.html'))
})

app.listen(5000, () => {
  console.log('Listening on 5000')
})
