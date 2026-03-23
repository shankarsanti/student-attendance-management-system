const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
// const bodyParser = require("body-parser")

dotenv.config();

const app = express()
const Routes = require("./routes/route.js")
const AuthRoutes = require("./routes/authRoutes.js")
const PasswordRoutes = require("./routes/passwordRoutes.js")

const PORT = process.env.PORT || 5000

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))
app.use(cors())

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/', Routes);
app.use('/auth', AuthRoutes);
app.use('/', PasswordRoutes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})