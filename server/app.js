const express = require("express");
const mongoose = require("mongoose")
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const multer = require('multer');
const path = require('path');
const { profile } = require("console");

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
const router = express.Router();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  app.get('/', (req, res) => {
    res.send('Hello, this is the default route.');
  });

  const uri = "mongodb+srv://dheeraj:dheeraj@cluster0.lw3bhxc.mongodb.net/?retryWrites=true&w=majority";

async function connect(){
    try{
        await mongoose.connect(uri)
        console.log("Connected To MongoDB")
    }
    catch(error){
        console.error(error)
    }
}
connect();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: 32
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    address:{
        type: String,

    },
    role: {
      type: Number,
      default: 0
  },
   profileImage: {
      type: String,
  }
})

const User = mongoose.model('User', userSchema);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });


app.post('/api/register', upload.single('profileImage'), async (req, res) => {
  const { username, email, password, mobileNumber, address } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobileNumber,
      address,
      profileImage: req.file ? req.file.filename : null, 
    });

    await newUser.save();

    return res.status(201).json({ message: 'User Created Successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/login', async(req,res) =>{
    const { username, password } = req.body;

    try{
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
         }
         const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                 return res.status(401).json({ message: 'Invalid credentials' });
             }

             const token = jwt.sign({ id: user._id }, 'dheeraj', {
                expiresIn: '1h',
              });
              const userId = user._id;
              const role = user.role
              
        return res.status(200).json({ token,userId,role });
    }
    catch(error){
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
})

  
 
app.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      _id,
      username,
      email,
      mobileNumber,
      address,
      profileImage,
      role,
    } = user;

    return res.status(200).json({
      id: _id,
      username,
      email,
      mobileNumber,
      address,
      profileImage,
      role,
    });
  } catch (error) {
    console.error('Error', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


   app.get('/api/users/:userId/isAdmin', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isAdmin = user.role===1;
      res.status(200).json({isAdmin})
    } catch (error) {
      console.error('Error', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/signout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0, httpOnly: true });
    res.status(200).json({ message: 'Signed out successfully' });
  });
  
  app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/users/:userId', async(req,res) => {
    
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if(!user)
      {
        return res.status(404).json({ error: 'User not found' });
      }

      await User.findByIdAndDelete(userId);
      res.json({ message: 'User deleted successfully' });
    }
    catch(error){
      console.log(error)
    }
  })

  app.put('/api/users/:userId', upload.single('newProfileImage'), async (req, res) => {
    try {
      const userId = req.params.userId;
      const { username, email, mobileNumber, address } = req.body;
  
      const updatedFields = {};
  
      if (username) {
        updatedFields.username = username;
      }
      if (email) {
        updatedFields.email = email;
      }
      if (mobileNumber) {
        updatedFields.mobileNumber = mobileNumber;
      }
      if (address) {
        updatedFields.address = address;
      }
  
      if (req.file) {
        updatedFields.profileImage = req.file.filename; 
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  const imageSchema = new mongoose.Schema({
    description : String,
    imagePath : String,
  });

  const Image = mongoose.model('Image', imageSchema);


app.post('/api/post', upload.single('image'), async (req, res) => {
  const { description } = req.body;
  console.log(req.file);
  const imagePath = req.file.path;

  try {
    const image = new Image({
      description,
      imagePath,
    });
    await image.save();

    res.status(201).json({ message: 'Post uploaded successfully' });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Image.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Image.findByIdAndDelete({ _id: postId });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
