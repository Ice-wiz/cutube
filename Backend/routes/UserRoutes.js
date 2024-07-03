const express = require('express');
const { register, login , getAllUsers , getUserDetails , getUserDetailsById} = require('../controller/userController');
const { protect } = require('../utils/authMiddleware')
const User = require('../models/User')

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


router.put('/bio', protect, async (req, res) => {
    const { bio } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.bio = bio;
      await user.save();
  
      res.status(200).json({ message: 'Bio updated successfully' , success:true});
    } catch (err) {
      console.log(err, "is the error here");
      res.status(500).json({ error: 'Error updating bio' });
    }
  });

  router.get('/all', getAllUsers);
  router.get('/me', protect, getUserDetails);
  router.get('/:userId', getUserDetailsById);

  
  

module.exports = router;

