const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');
const { generateJWT } = require('../utils/jwt')
const dotenv = require('dotenv');
dotenv.config()


//I am just adding this for extra safety
const getRandomChar = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return chars.charAt(Math.floor(Math.random() * chars.length));
};

const generatePassword = (firstname, email, mobile) => {
    const part1 = firstname.substring(0, 2);
    const part2 = email.substring(0, 2);
    const part3 = mobile.substring(mobile.length - 2);
    const randomPart = Array.from({ length: 2 }, getRandomChar).join('');

    const combined = `${part1}${part2}${part3}${randomPart}`;
    return combined.split('').sort(() => 0.5 - Math.random()).join('');
};

const register = async (req, res) => {
    const { firstname, lastname, email, mobile } = req.body;

    console.log('Request body:', req.body);

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const password = generatePassword(firstname, email, mobile);
        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new User({
            firstname,
            lastname,
            email,
            mobile,
            password: hashedPassword,
            emailRegistered: false,
        });

        // Define email 
        const subject = 'Your Account Details';
        const text = `
            Your account has been created successfully.\n\n
            Your temporary password is: ${password}\n\n
            Please log in using the following link: ${process.env.LOGIN_URL}
        `;

        
        await sendEmail(email, subject, text);

        await user.save();

        
        res.status(201).json({ message: 'User registered successfully. Please check your email for your password.' });
    } catch (err) {
        console.log('Error registering user:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
};

const login = async (req, res) => {
    const { firstname, password } = req.body;

    try {
        const user = await User.findOne({ firstname });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate and send JWT token
        const token = generateJWT(user);
        user.emailRegistered = true;
        await user.save();

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.log(err, "is the error here");
        res.status(500).json({ error: 'Error logging in user' });
    }
};


// Get all users (unprotected)



const getUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password').populate('videos');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.log(err, "is the error here");
      res.status(500).json({ error: 'Error fetching user details' });
    }
  };
  
// get user details by id 

const getUserDetailsById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password').populate('videos');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.log(err, "is the error here");
        res.status(500).json({ error: 'Error fetching user details' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('videos'); // Exclude password field
        res.status(200).json(users);
    } catch (err) {
        console.log(err, "is the error here");
        res.status(500).json({ error: 'Error fetching users' });
    }
};


module.exports = { register, login, getAllUsers, getUserDetails, getUserDetailsById };
