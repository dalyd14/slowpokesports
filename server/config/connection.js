const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${process.env.DB_NAME}`, {
  useNewUrlParser: true, 
  useFindAndModify: false, 
  useCreateIndex: true, 
  useUnifiedTopology: true
})

// mongoose.set('debug', true)

module.exports = mongoose.connection