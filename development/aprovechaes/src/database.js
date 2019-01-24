const mongoose = require('mongoose');
const {database} = require('./drivers');

mongoose.connect(database.URI, {
    useNewUrlParser: true
})
.then(db => console.log('DB is connected'))
.catch(err=>console.log('error', err));
