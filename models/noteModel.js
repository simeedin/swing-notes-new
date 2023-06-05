const nedb = require('nedb-promise');
const db = new nedb({filename: 'notes.db', autoload: true});
const uuid = require('uuid-random');


 function createNote(title, text, userId) {

    db.insert({
        title: title,
        text: text,
        createdAt: new Date().toJSON(), 
        modifiedAt: 'inga ändringar har gjorts',
        id: uuid(),
        userId: userId
    });
}


async function getNotes(userId) {
    return await db.find({userId: userId});
}

async function searchForNote(title, userId) {
    return await db.find({title: title, userId: userId});
}

async function getNoteById(id) {
    return await db.findOne({id: id});
}


module.exports = {createNote, getNotes, searchForNote, getNoteById, db}