const router = require('express').Router();
const { Thought, User } = require('../../models/index');

//Views all users
router.get('/', async (req, res) => {
    try {
        const userData = await User
            .find()
            .populate('friends')
            .populate('thoughts')
            .select('-__v');

        res.status(200).json(userData);
    } catch(err) {
        res.status(500).json(err);
    }   
});

//Views one User
router.get('/:id', async (req, res) => {
    try {
        const singleUserData = await User
            .findOne({ _id: req.params.id })
            .populate('friends')
            .populate('thoughts')
            .select('-__v');
        
        if(!singleUserData) {
            return res.status(404).json({ message: "No user found"});
        }

        res.status(200).json(singleUserData);
    } catch(err) {
        res.status(500).json(err)
    }
})

//Create a user
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
});

//Update a user
router.put('/:id', async (req, res) => {
    try{
        const updatedUser = await User.findOneAndUpdate(
            {_id: req.params.id},
            { $set: req.body },
            { new: true }
            );
        if (!updatedUser) {
            return res.status(404).json({ message: "No user found" });
        }

        res.json(updatedUser);
    } catch(err) {
        res.status(500).json(err);
    }
})

//Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete({ _id: req.params.id });

        if(!deletedUser) {
            return res.status(404).json({ message: "No user found" });
        };
        res.json(deletedUser)
    } catch(err) {
        res.status(500).json(err);
    }
});

//This updates a user to be friends. 
router.post('/:userId/friends/:friendId', async (req, res) => {
    try{
        const updatedFriend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        );

        if(!updatedFriend) {
            return res.status(404).json({ message: "No user found" });
        };

        res.json(updatedFriend)
    } catch(err) {
        res.status(500).json(err);
    }
});

//This removes a friend from the friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try{
        const removedFriend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );

        if(!removedFriend) {
            return res.status(404).json({ message: "No user found" });
        };

        res.json(removedFriend)
    } catch(err) {
        res.status(500).json(err);
    }
});
//After getting friend data make sure to go back to get to see that the data is populated correctly


module.exports = router;