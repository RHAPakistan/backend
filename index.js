const express = require('express');
const bodyParsser = require('body-parser');
const mongoose = require('mongoose');
const providerRouter = require('./routers/providerRouter');
const volunteerRouter = require('./routers/volunteerRouter');
const adminMainRouter = require('./routers/admin/mainRouter');
const adminPickupRouter = require('./routers/admin/pickupRouter');
const adminProviderRouter = require('./routers/admin/adminProviderRouter');
const dropoffRouter = require("./routers/admin/dropoffRouter");
const adminVolunteerRouter = require("./routers/admin/adminVolunteerRouter.js");
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;
const {Server, Socket} = require("socket.io");
const app = express();
const {
  userJoin,
  getUserSocket,
  userLeave
} = require("./utils/users.js");
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
app.use('/api/admin/provider', adminProviderRouter);
app.use('/api/admin/dropoff', dropoffRouter);
app.use('/api/admin/volunteer', adminVolunteerRouter);
var server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//experimenting with socket -> ignore what is below this for now
//const httpServer = createServer(app);
const io = new Server(server);
io.on("connection",(socket) => {
  console.log("Made socket connection", socket.id);
  socket.emit("request id"); // ask client to send id
  socket.on("send id",async(data)=>{
    //register the socket with the id as key.
    socket = userJoin(data._id,socket);
    console.log("User joined: ",data._id);
  })
  app.set("socketio",socket);

  socket.on("assignPickup", (socket_data)=>{
    console.log("recieved assignment from admin");
    console.log(socket_data);
  })

  socket.on("foodPicked", (socket_data)=>{
    console.log("food picked of ", socket_data.message);
  })

  socket.on("foodDelivered", (socket_data)=>{
    console.log("food delivered of ", socket_data.message);
  })

  socket.on("acceptPickup", (socket_data)=>{
    console.log("pickup accepted by ",socket_data.message._id);
    sock = getUserSocket("6210b0e4418b9ffab8be14d0")
    sock.emit("acceptPickup",{"message":socket_data});
  })

  socket.on("finishPickup",(socket_data)=>{
    sock = getUserSocket("6210b0e4418b9ffab8be14d0");
    sock.emit("finishPickup", {"message":"hi"});
  })

  socket.on("initiatePickup", (sock_data)=>{
    sock = getUserSocket("6210b0e4418b9ffab8be14d0");
    sock.emit("initiatePickup",{"message":sock_data.message});
  })
})



