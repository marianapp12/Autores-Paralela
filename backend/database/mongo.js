const mongoose = require('mongoose');
const uri3 = "mongodb+srv://mariana:amorcito@paralela.0sbfz.mongodb.net/?retryWrites=true&w=majority&appName=paralela";

function connect() {
  return mongoose.connect(uri3)
  .then((conn) => {
    console.log('Connected to the database');
    return conn;  
  })
  .catch((error) => {
    console.error('Connection error', error);
    throw error;  
  });
}

module.exports = { connect, mongoose };

