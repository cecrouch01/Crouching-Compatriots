const router = require('express').Router();
const { Thought, User } = require('../../models/index');

//View all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughtData = await Thought.find();
        res.json(thoughtData);
    } catch(err) {

    }
});

//View a single thought
router.get('/:id', async (req, res) => {
    try {
        const singleThoughtData = await Thought
        .findOne({ _id: req.params.id })
        .select('-__v');
        if(!singleThoughtData) {
            return res.status(404).json({ message: "No thought found"});
        }
        res.json(singleThoughtData);
    } catch(err) {
        res.status(500).json(err);
    }
});

//Create a thought
router.post('/', async (req, res) => {
    try {
        const newThought = await Thought.create(req.body);
        await User.findByIdAndUpdate(
            {_id: req.body.userId },
            { $addToSet: {thoughts: newThought._id} }
        );
        res.json(newThought);
    } catch(err) {
        res.status(500).json(err);
    }
});

//Updates a thought
router.put('/:id', async (req, res) => {
    try {
        const updatedThought = await Thought.findOneAndUpdate(
            {_id: req.params.id},
            { $set: req.body },
            { new: true }
        );

        if(!updatedThought) {
            return res.status(404).json({ message: "No thought found"});
        }
        res.json(updatedThought);
    } catch(err) {
        res.status(500).json(err);
    }
});

//This deletes a single thought
router.delete('/:id', async (req, res) => {
    try {
        const deletedThought = await Thought.findByIdAndDelete({ _id: req.params.id });
        if(!deletedThought) {
            return res.status(404).json({ message: "No thought found"});
        }
        res.json(deletedThought);
    } catch(err) {
        res.status(500).json(err);
    }
});

//This adds a reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        const newReaction = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $addToSet: {reactions: req.body } },
            { new: true }
        );
        res.json(newReaction);
    } catch(err) {
        res.status(500).json(err);
    }
});

//This deletes a reaction
router.delete('/:thoughtId/reactions', async (req, res) => {
    try {
        const deletedReaction = await Thought.findByIdAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { _id: req.body.id } }},
            { new: true }
        );
        if(!deletedReaction) {
            return res.status(404).json({ message: "Could not find reaction"});
        };
        res.json(deletedReaction);
    } catch(err) {
        res.status(500).json(err)
    }
});

module.exports = router;