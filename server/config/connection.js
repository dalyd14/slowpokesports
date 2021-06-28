const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || `mongodb+srv://David_Daly:5aV0N2ri3ydMKIX9@cluster0.wztav.mongodb.net/effikas_db?retryWrites=true&w=majority` || `mongodb://localhost/${process.env.DB_NAME}`, {
  useNewUrlParser: true, 
  useFindAndModify: false, 
  useCreateIndex: true, 
  useUnifiedTopology: true
})

// mongoose.set('debug', true)

module.exports = mongoose.connection