const express = require("express");
const dbConnect = require("./config/dbConnect");


const userRoute = require("./routes/userRoutes");
const projectRoute = require("./routes/projectRoute");
const taskRoute = require("./routes/taskRoute");

const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/v1" , userRoute);
app.use("/api/v1", projectRoute);
app.use("/api/v1", taskRoute);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    dbConnect();
});
