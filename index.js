const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const dotenv = require("dotenv").config({});

const port = process.env.PORT;
const apiRoutes = require("./routes/api");

const app = express();

//Middleware functions
//CORS to process requests from the react app
app.use(cors());

//Morgan to prompt all requests' results on the console
app.use(morgan("dev"));

//Express to parse JSON data and recieve requests' bodies
app.use(
    express.urlencoded({
        extended: true,
        limit: "150mb",
        parameterLimit: 1000000,
    })
);

app.use(express.json({
    extended: true,
    limit: "150mb"
}));

app.use("/api", apiRoutes);

app.listen(port, () => {
    console.log(`Server Up on Port ${port}`);
});