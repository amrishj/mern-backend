const express = require('express');
const app = express();
app.use(express.static("public"))
const port = 5000;
var cors = require('cors');
app.use(cors());
let bcr = require("bcrypt");
const genSalt = 10;
const jwt=require("jsonwebtoken");
const secretOrPrivateKey="hgdghd54465456"
/////////connection file include//////
const dbConnect = require("./db/conn");
///////modal connect//////////
const Register = require("./Modal/register");
const Admin=require("./Modal/admin");
const Contact=require("./Modal/contact");
dbConnect();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
var multer=require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() +"-"+file.originalname)
  }
})

const upload = multer({ storage: storage })
//////////contact api//////////////////
app.post("/contact",async(req,res)=>{
  const{name,email,message,phone}=req.body
  const saveData = await Contact({ name, email,phone,message });
      const result = await saveData.save();
      res.send({ message: "Contact Sent!!!" });  
});

//////////contact-list fetch api///////////
app.get("/contact-list",async(req,res)=>{
  let getData = await Contact.find();
  res.send({results:getData});  
});
////pagination///////

app.get("/pagination", async (req, res) => {
  const PAGE_SIZE = 3;
  const page = parseInt(req.query.page || "0");
  const total = await Contact.countDocuments({});
  const posts = await Contact.find({})
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * page);
  res.json({
    totalPages: Math.ceil(total / PAGE_SIZE),
    posts,
  });
});


//////admin register api//////////////////
app.post('/admin-register',upload.single('img'), async (req, res) => {
  const { name, email, password, conpassword, address, mobile,img } = req.body;

  if (password === conpassword) {
    const premail = await Admin.findOne({ email });
    if (!premail) {
      const hashP = await bcr.hash(password, genSalt);
      const hashConP = await bcr.hash(conpassword, genSalt);
      const pic=typeof req.file!=="undefined" ? req.file.filename :null;
      const saveData = await Admin({
         name, email, password: hashP, conpassword: hashConP, address, mobile,img:pic 
        });
      const result = await saveData.save();
      res.send({ message: "Admin Register Successfully!!!" });
    }
    else {
      res.send({ message: "Already Registered this mail id!!!" });
    }
  }
  else {
    res.send({ message: "Your password and confirm password is not match!!!" });
  }

});
//////////admin-login api////////////////
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;    
  try {
      // Check if both email and password are provided
      if (!email || !password) {
          return res.send({ message: "Please fill all fields" });
      }
      // Check if email exists
      const emailValid = await Admin.findOne({ email });
      //console.log(emailValid)
      if (!emailValid) {
          return res.send({ message: "You are not a registered user!" });
      }
      // Check if password matches
      const isPassMatch = await bcr.compare(password, emailValid.password);
      if (!isPassMatch) {
          return res.send({ message: "Your password does not match!" });
      }
      // Generate token with only the necessary data (for example, the email)
      const tok = await jwt.sign({ loginUser: emailValid }, secretOrPrivateKey, { expiresIn: '1h' });

      return res.send({ message: "Admin Login","user":emailValid,"token":tok});

  } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
  }
});



/////////insert api///////////
app.post('/register-insert', async (req, res) => {
  const { name, email, password, conpassword, address, mobile } = req.body;

  if (password === conpassword) {
    const premail = await Register.findOne({ email });
    if (!premail) {
      const hashP = await bcr.hash(password, genSalt);
      const hashConP = await bcr.hash(conpassword, genSalt);
      const saveData = await Register({ name, email, password: hashP, conpassword: hashConP, address, mobile });
      const result = await saveData.save();
      res.send({ message: "Register Successfully!!!" });
    }
    else {
      res.send({ message: "Already Registered this mail id!!!" });
    }
  }
  else {
    res.send({ message: "Your password and confirm password is not match!!!" });
  }

});
///////Read api///////////////
app.get('/fetch', async (req, res) => {
  let getData = await Register.find();
  res.send(getData)
});
////////////delete api//////////
app.delete('/delete/:id', async (req, res) => {
  const del = await Register.deleteOne({ _id: req.params.id })
  res.send({ message: "Record deleted" })
});

///////getDetails user//////////////
app.get('/getDetails/:id', async (req, res) => {
  let get = await Register.findOne({ _id: req.params.id })
  res.send({ data: get })
});
///////////update api//////////////
app.put('/update/:id', async (req, res) => {
  const { name, email, password, conpassword, address, mobile } = req.body;
  const hashP = await bcr.hash(password, genSalt);
  const hashConP = await bcr.hash(conpassword, genSalt);
  await Register.updateOne({ _id: req.params.id }, {
    $set: { name, email, password: hashP, conpassword: hashConP, address, mobile }
  })
  res.send({ message: "Record updated" })
});
//////search api/////////////////
app.get('/search', async (req, res) => {
  const query = req.query.q;
    const results = await Register.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { mobile: isNaN(query) ? null : Number(query) }
      ]
    });
    res.status(200).json(results); 
});



app.listen(port, () => {
  console.log('App running in port ' + port);
  console.log(`http://localhost:${port}`)
});