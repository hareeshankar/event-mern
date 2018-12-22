const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressJwt = require("express-jwt");
const path = require("path");
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/api", expressJwt({ secret: process.env.SECRET }));

//connect to db
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://admin:pwdadmin8@ds119374.mlab.com:19374/mern-auth",
    { useNewUrlParser: true },
    (err) => {
        if (err) throw err;
        console.log("Connected to the database");
    }
);
app.use(express.static(path.join(__dirname, "client", "build")))
app.use("/auth", require("./routes/auth"));
app.use("/api/todo", require("./routes/todo"));

app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    return res.send({ message: err.message });
});
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(PORT, () => {
    console.log(`[+] Starting server on port ${PORT}`);
});
