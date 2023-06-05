const {Router, response} = require('express');
const router = Router(); 
const {check, validationResult} = require('express-validator');

const {createNote, getNotes, searchForNote, getNoteById, db} = require('../models/noteModel');
const {auth} = require('../middleware/auth');




router.post('/', auth, [check('title').isLength({max: 50}).withMessage('maxlängd på titel är 50 tecken'),
    check('text').isLength({max: 300}).withMessage('maxlängd på anteckning är 300 tecken')],
    (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    } 
    const {title, text, userId} = request.body;
    createNote(title, text, userId);

    response.json({
    success: true
    });

});

router.get('/', auth, async (request, response) => {
    const {userId} = request.body;
    const notes = await getNotes(userId);
    response.json({
        success: true,
        notes: notes
    });
});

router.put('/', auth, (request, response) => {
    const {id, title, text, userId} = request.body;

    
    db.update({id: id, userId: userId}, {$set: {
        title: title, 
        text: text, 
        modifiedAt: new Date().toJSON()
        
    }});
    
    response.json({success: true});
    
});

router.delete('/', auth, async (request, response) => {
    const {id, userId} = request.body;

    db.remove({id: id, userId: userId});

    const noteId = await getNoteById(id);
    const result = {success: true, result: `Note med id ${noteId} är nu raderad`}

    if (!noteId) {
        result.success = false;
        result.result = 'Id finns ej';
    }

    response.json(result);
});

router.get('/search', auth, async (request, response) => {
    const {title, userId} = request.body;

    const searchResult = await searchForNote(title, userId);

    const result = {
        success: true,
        notes: searchResult
    }

    if (searchResult.length < 1) {
        result.success = false;
        result.notes = 'Titel finns ej'
    }

    response.json(result);


})



module.exports = router;