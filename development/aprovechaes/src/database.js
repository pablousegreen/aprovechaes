const mongoose = require('mongoose');
const {database} = require('./drivers');

mongoose.connect(database.URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true
})
.then(db => console.log('DB is connected', db))
.catch(err=>console.log('error', err));
