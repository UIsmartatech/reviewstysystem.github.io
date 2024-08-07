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
const http = "http";
const hostname = '0.0.0.0'


let otpStore = {}; // To store OTPs temporarily
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;


// Create the connection to the database
const db = mysql.createConnection({
  host: "192.168.1.133",  // IP address of your Synology NAS
  user: "root",           // Username to connect to the database
  password: "Smarta@123", // Password for the database user
  database: "test"        // Name of the database
});
// Connect to the database 
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to the database.');
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
// Middleware to handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === 'OPTIONS') {
      res.sendStatus(200);
  } else {
      next();
  }
});

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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ status: 'failed', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ status: 'failed', message: 'Forbidden' });
    }

    req.email = decoded.email;
    req.user = decoded;

    next();
  });
};

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
        { expiresIn: '30m' }
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



app.get("/auth", authenticateToken, (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Access denied');
  }

  try {
    const decoded = jwt.verify(token,  JWT_SECRET);
    res.json({ message: 'This is a protected route', user: decoded });
  } catch (err) {
    res.status(400).send('Invalid token');
  }
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


app.post('/review', authenticateToken, (req, res) => {
  const reviewer = req.user.name;
  const { reviewee, totalStars, comment, ratings } = req.body; // ratings contains category-specific stars

  const checkReviewQuery = `
    SELECT * FROM review_table
    WHERE reviewer = ? AND reviewee = ? AND review_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`;

  db.query(checkReviewQuery, [reviewer, reviewee], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length > 0) {
      return res.status(400).send('You can only review this user once per month.');
    }

    const addReviewQuery = `
      INSERT INTO review_table (reviewee, reviewer, reviewstar, comment, review_date, punctuality, proactive, pr_support, performance)
      VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)`;

    db.query(
      addReviewQuery,
      [reviewee, reviewer, totalStars, comment, ratings.punctuality, ratings.proactive, ratings.pr_support, ratings.performance],
      (err, results) => {
        if (err) return res.status(500).send(err);

        res.status(200).send('Review added successfully.');
      }
    );
  });
});

// Route to get total stars
app.get("/gettotalstar", authenticateToken, (req, res) => {
  const reviewer = req.user.name;
  const reviewee = reviewer;

  const sql = `SELECT SUM(reviewstar) AS totalStars, SUM(punctuality) AS totalPunctualityStars,  SUM(proactive) AS totalProactiveStars,  SUM(pr_support) AS totalpeersupportStars, SUM(performance) AS totalperformanceStars
  FROM review_table 
  WHERE reviewee = ? 
    AND review_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`;

  // Execute SQL query
  db.query(sql, [reviewee, reviewer], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Error inside the server' });
    }
    // Assuming results[0].totalStars contains the total stars sum
    return res.json({
      totalStars: results[0].totalStars,
      totalPunctualityStars: results[0].totalPunctualityStars,
      totalProactiveStars: results[0].totalProactiveStars,
      totalpeersupportStars: results[0].totalpeersupportStars,
      totalperformanceStars: results[0].totalperformanceStars
  });
    
    console.log(results[0].totalStars);
    console.log( results[0].totalPunctualityStars);
    console.log(results[0].totalProactiveStars);
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
app.get("/employcards", (req, res) => {
  const sql = "SELECT * FROM personal_profile";
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: "error inside thte server" });
    else return res.json(result);
  });
});

app.get('/filtertab', authenticateToken, (req, res) => {
  const username = req.user.name;
  const selectName =  req.body;

  console.log(selectName);
  const sql = "SELECT * FROM review_table WHERE reviewee = ?"
  db.query(sql,[selectName], [username], (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});
app.get("/profilepagedata", authenticateToken, (req, res) => {
  const username = req.user.name;


  const sql = "SELECT * FROM personal_profile WHERE username = ?";

  db.query(sql,[username], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Error inside the server' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'No records found' });
    }
    return res.json(result);
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

  // Check if the record already exists
  const checkQuery = "SELECT * FROM personal_profile WHERE username = ? OR email = ? OR mobile_no = ?";
  db.query(checkQuery, [name, email, mobile], (err, results) => {
    if (err) {
      console.error("Error checking profile:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "Profile already exists" });
    }

    // Insert the new profile if no duplicate is found
    const query = "INSERT INTO personal_profile (username, email, designation, mobile_no, join_date) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [name, email, designation, mobile, joinDate], (err, result) => {
      if (err) {
        console.error("Error inserting profile:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        return res.status(201).json({
          status: "success",
          id: result.insertId,
          name,
          email,
          mobile,
          designation,
          joinDate,
        });
      }
    });
  });
});


app.listen(port ,hostname , () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
