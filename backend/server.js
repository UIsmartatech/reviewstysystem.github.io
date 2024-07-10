const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const port = 8081; // or any port you prefer

let otpStore = {}; // To store OTPs temporarily
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

// Create the connection to the database
const db = mysql.createConnection({
  host: "localhost",  // IP address of your Synology NAS
  user: "root",           // Username to connect to the database
  password: "", // Password for the database user
  database: "test"        // Name of the database
});

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  })
);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "secret",
    resave: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: "error inside thte server" });
    else return res.json(result);
  });
});

//sent otp n Point
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  // Check if email exists in the database
  const query = "SELECT * FROM users WHERE email = ? AND status = 1";

  db.query(query, [email], (error, results) => {
    if (error) {
      return res.status(500).send("Database error");
    }
    if (results.length === 0) {
      return res.status(404).send("Email not found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    otpStore[email] = otp; // Store OTP in memory

    // Configure nodemailer to send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shubhipayasi@gmail.com",
        pass: "nagz elwv eutl yjll",
      },
    });

    const mailOptions = {
      from: "shubhipayasi@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send("Error sending OTP");
      }
      res.status(200).send("OTP sent");
    });
  });
});

//verify otp n point
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email]; // Remove OTP after verification

    // Fetch user's role from the database
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error inside the server", error: err });
      }

      if (result.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = result[0];

      // Generate JWT token
      const token = jwt.sign(
        { email, role: user.role, name: user.name },
          process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Send the token in a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
      });

      res.json({ success: true, jwttoken: token });
    });
  } else {
    res.status(400).send("Invalid OTP");
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).send({ Status: 'failed', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ Status: 'failed', message: 'Forbidden' });
    }
    // Save the decoded email in the request object
       req.email = decoded.email;
       req.user = decoded;
     
    next();
  });
};

app.get("/auth", authenticateToken, (req, res) => {
  res.send("Protected route");
});

// Route to logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.status(200).send("Logout successful");
  });
});

// Protected route
app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.status(200).send(`Welcome to the dashboard, ${req.session.user}`);
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Define the POST route for submitting reviews


// Route to handle image upload
app.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  const userEmail = req.email; // Assuming authenticateToken middleware adds email to req
  const { filename, mimetype } = req.file;

  const sql = 'UPDATE personal_profile SET image = ?, contentType = ? WHERE email = ?';

  db.query(sql, [filename, mimetype, userEmail], (err, result) => {
    if (err) {
      console.error('Error updating profile photo:', err);
      return res.status(500).json({ message: 'Error inside the server' });
    } else {
      return res.status(200).json({ status: 'success' });
    }
  });
});

app.post("/review", authenticateToken, (req, res) => {
  const reviewer = req.user.name;
  const { reviewee, totalStars, comment } = req.body;

  const checkReviewQuery = `
    SELECT * FROM review_table
    WHERE reviewer = ? AND reviewee = ? AND review_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`;
    
  db.query(checkReviewQuery, [reviewer, reviewee], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length > 0) {
      return res.status(400).send('You can only review this user once per month.');
    }

    const addReviewQuery = 'INSERT INTO review_table (reviewee, reviewer, reviewstar, comment, review_date) VALUES (?, ?, ?, ?, NOW())';
    db.query(addReviewQuery, [reviewee, reviewer, totalStars, comment], (err, results) => {
      if (err) return res.status(500).send(err);

      res.status(200).send('Review added successfully.');
    });
  });
});

// Route to fetch user's profile image
app.get('/profile/image', authenticateToken, (req, res) => {
  const userEmail = req.email;
  const sql = 'SELECT * FROM personal_profile WHERE email = ?';

  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error('Error fetching profile image:', err);
      return res.status(500).send('Error fetching profile image');
    }
    if (results.length > 0) {
      
      const { image } = results[0];
      if (!image) {
        return res.status(404).send('Profile image not found');
      }
    
      res.send({ imageUrl: `http://localhost:8081/public/images/${image}` });
    } else {
      res.status(404).send('Profile image not found');
    }
  });
});

//fething the data fro the admin view
app.get("/preview_user", (req, res) => {
  const sql = "SELECT * FROM review_table";
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: "error inside thte server" });
    else return res.json(result);
  });
});

app.get("/reviewuser", (req, res) => {
  const sql = "SELECT * FROM users WHERE status = 1";
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: "error inside thte server" });
    else return res.json(result);
  });
});

// Route to insert a new profile
app.post("/personal-profile-insert", async (req, res) => {
  const { name, email, mobile, designation, joinDate } = req.body;

  const query =
    "INSERT INTO personal_profile (username, email, designation, mobile_no, join_date) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [name, email, mobile, designation, joinDate],
    (err, result) => {
      if (err) {
        console.error("Error inserting profile:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({
          status: "success",
          id: result.insertId,
          name,
          email,
          mobile,
          designation,
          joinDate,
        });
      }
    }
  );
});

app.listen(8081, () => {
  console.log("listening");
});
