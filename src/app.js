const fs = require("fs");
const express = require("express");
const app = express();

// Importing products from products.json file
const userDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userDetails.json`)
);

//Middlewares
app.use(express.json());

// Write POST endpoint for registering new user

// GET endpoint for sending the details of users
app.post("/api/v1/details", (req, res) => {
  try {
    // Extract user details from the request body
    const { name, mail, number } = req.body;

    // Validate user data
    if (!name || !mail || !number) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid user data. Please provide name, mail, and number.",
      });
    }

    // Generate a new user ID
    const newUserId = userDetails.length > 0 ? userDetails[userDetails.length - 1].id + 1 : 1;

    // Create a new user object
    const newUser = {
      id: newUserId,
      name,
      mail,
      number,
    };

    // Add the new user to userDetails array
    userDetails.push(newUser);

    // Update userDetails.json file with the new data
    fs.writeFileSync(`${__dirname}/data/userDetails.json`, JSON.stringify(userDetails, null, 2));

    // Respond with success message and the newly created user details
    res.status(201).json({
      status: "Success",
      message: "User registered successfully",
      data: {
        newUser,
      },
    });
  } catch (error) {
    // Handle errors, e.g., reading or writing to the file
    console.error(`Error: ${error.message}`);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
});

app.get("/api/v1/details", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Detail of users fetched successfully",
    data: {
      userDetails,
    },
  });
});

// GET endpoint for sending the products to client by id
app.get("/api/v1/userdetails/:id", (req, res) => {
  let { id } = req.params;
  id *= 1;
  const details = userDetails.find((details) => details.id === id);
  if (!details) {
    return res.status(404).send({
      status: "failed",
      message: "Product not found!",
    });
  } else {
    res.status(200).send({
      status: "success",
      message: "Details of users fetched successfully",
      data: {
        details,
      },
    });
  }
});

module.exports = app;
