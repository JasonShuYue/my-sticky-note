var Sequelize = require('sequelize');

var path = require('path');

const sequelize = new Sequelize(undefined, undefined, undefined, {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,

    // SQLite only
    storage: path.join(__dirname, '../database/database.sqlite')
});


// // test connect
//
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });


// create model
const Note = sequelize.define('user', {
    content: {
        type: Sequelize.STRING
    },
    uid: {
        type: Sequelize.STRING
    },

});
// // force: true will drop the table if it already exists
// Note.sync().then(() => {
//     // Table created
//     return Note.create({
//         content: 'TEST',
//         uid: '123'
//     });
// }).then(function() {
//     Note.findAll({raw: true}).then(function(articles) {
//       console.log(articles)
//     })
// });

Note.sync();

module.exports = Note;
