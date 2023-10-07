const router = require('express').Router();
const { Thought, User } = require('../../models/index');

//View all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughtData = await Thought.find();
        res.status(201).json(thoughtData);
    } catch(err) {
        res.status(500).json(err)
    }
})



//Do the bonus when you get a chance

module.exports = router;