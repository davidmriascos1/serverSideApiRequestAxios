// Import the express module to create a web server
import express from "express";
// Import body-parser to handle form data from the user
import bodyParser from "body-parser";
// Import axios to make HTTP requests to external APIs
import axios from "axios";

// Create an Express application
const app = express();
// Define the port the server will listen to
const port = 3000;

// Middleware: Serve static files like CSS, images, etc. from the "public" folder
app.use(express.static("public"));
// Middleware: Parse incoming form data into `req.body`
app.use(bodyParser.urlencoded({ extended: true }));

// Route: Handles GET requests to the home page
app.get("/", async (req, res) => {
  try {
    // Make an API request to the "bored" API to get a random activity
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    // Store the response data from the API in the 'result' variable
    const result = response.data;
    // Log the result to the console for debugging
    console.log(result);
    // Render the "index.ejs" file and pass the data (activity) to it
    res.render("index.ejs", { data: result });
  } catch (error) {
    // If there is an error in the API request, log it to the console
    console.error("Failed to make request:", error.message);
    // Render the "index.ejs" file and pass the error message to it
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

// Route: Handles POST requests from the form on the home page
app.post("/", async (req, res) => {
  try {
    // Log the form data sent by the user (type and participants)
    console.log(req.body);
    // Extract the "type" and "participants" values from the form data
    const type = req.body.type;
    const participants = req.body.participants;

    // Make an API request to filter activities based on type and participants
    const response = await axios.get(
      `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`
    );

    // Store the filtered activities from the API response
    const result = response.data;
    // Log the result to the console for debugging
    console.log(result);

    // Render the "index.ejs" file and send back one random activity from the results
    res.render("index.ejs", {
      data: result[Math.floor(Math.random() * result.length)],
    });
  } catch (error) {
    // If something goes wrong, log the error to the console
    console.error("Failed to make request:", error.message);
    // Render the "solution.ejs" file and pass a custom error message
    res.render("solution.ejs", {
      error: "No activities that match your criteria.",
    });
  }
});

// Start the server and listen on port 3000
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});