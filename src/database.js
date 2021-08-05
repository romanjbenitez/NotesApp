const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin:adminapp1234@cluster0.wmgqx.mongodb.net/BD?retryWrites=true&w=majority", {
    useCreateIndex : true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(db => console.log("db is connected")).catch(err => console.error(err));


