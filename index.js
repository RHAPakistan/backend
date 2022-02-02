const express = require('express');
const bodyParsser = require('body-parser');
const mongoose = require('mongoose');
const providerRouter = require('./routers/providerRouter');
const volunteerRouter = require('./routers/volunteerRouter');
const adminMainRouter = require('./routers/admin/mainRouter');
const adminPickupRouter = require('./routers/admin/pickupRouter');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**mongoose.connect('mongodb://127.0.0.1:27017/rhaDB', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})*/

//connecting to mongoDB database
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/rhaDB', {

    useNewUrlParser: true,
    //useFindAndModify: false,
    useUnifiedTopology: true

})
.then(() => console.log('MongoDB connection established.'))
.catch((error) => console.error("MongoDB connection failed:", error.message))

//routes
app.use('/api/provider', providerRouter);
app.use('/api/volunteer', volunteerRouter);
app.use('/api/admin', adminMainRouter);
app.use('/api/admin/pickup', adminPickupRouter);


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//experimenting with socket -> ignore what is below this for now
//const httpServer = createServer(app);
var io = socket(server);
io.on("connection",(socket) => {
  console.log("Made socket connection", socket.id);
  
  //handle chat
  socket.on("chat", (data)=>{
    console.log("helo s");
    console.log(socket);
    console.log(data);
    io.sockets.emit("chat",data);
    console.log("hi");
    socket.emit("Request Accepted", {"Hello":"world"});
  });
  
})


