const express = require('express');
const bodyParsser = require('body-parser');
const mongoose = require('mongoose');
const providerRouter = require('./routers/providerRouter');
const volunteerRouter = require('./routers/volunteerRouter');
const adminMainRouter = require('./routers/admin/mainRouter');
const adminPickupRouter = require('./routers/admin/pickupRouter');
const adminProviderRouter = require('./routers/admin/adminProviderRouter');
const driveRouter = require('./routers/admin/driveRouter');
const dropoffRouter = require("./routers/admin/dropoffRouter");
const adminVolunteerRouter = require("./routers/admin/adminVolunteerRouter.js");
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;
const { Server, Socket } = require("socket.io");
const app = express();
const Pickup = require("./models/pickup");
const Provider = require("./models/provider");
const Volunteer = require("./models/volunteer");
const backendHelpers = require("./helpers/backendHelpers");

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
mongoose.connect(process.env.MONGODB_URL || `mongodb://localhost:27017/${process.env.DB_NAME}`, {

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
app.use('/api/admin/drive', driveRouter);
app.use('/api/admin/volunteer', adminVolunteerRouter);

var server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//experimenting with socket -> ignore what is below this for now
//const httpServer = createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("Made socket connection", socket.id);

  socket.on("send id", async (data) => {
    //register the socket with the id as key.
    socket = userJoin(data._id, socket);
    console.log("User joined: ", data._id);
  })


  socket.on("assignPickup", async (socket_data) => {
    console.log("recieved assignment from admin");
    //socket_data.message is the pickup object
    //we need to add the updated pickup obj to database
    await Pickup.findByIdAndUpdate(socket_data.message._id, socket_data.message);
    
    if (socket_data.message.broadcast == true) {
      console.log("Emmiting assign pickup event at index:72");
      socket.broadcast.emit("assignPickup", { "message": socket_data.message})
    } else {
      //the pickup object should have a volunteer id
      sock = getUserSocket(socket_data.message.volunteer);
      sock.emit("assignPickupSpecific",{"message": socket_data.message}); 
    }
  })

  app.set("socketio", socket);

  socket.on("foodPicked", async (socket_data) => {
    //socket.message holds the pickup object.
    console.log("food picked of ", socket_data.message);

    //send a message to provider
    sock = getUserSocket(socket_data.message.provider);
    sock.emit("foodPicked", { "message": socket_data.message })
  })

  socket.on("foodDelivered", async (socket_data) => {
    console.log("food delivered of ", socket_data.message);
  })

  socket.on("acceptPickup", async (socket_data) => {

    console.log("pickup acceped => ", socket_data);
    //update volunteer's ongoing_pickup status
    await Volunteer.findByIdAndUpdate(socket_data.message.volunteer, {"ongoing_pickup":true});
    
    //we need to add the updated pickup obj to database
    await Pickup.findByIdAndUpdate(socket_data.message._id, socket_data.message);

    //notify admin
    sock = getUserSocket("62178d81aa73e4f46d5ff2c5");
    const provider = await Provider.findById(socket_data.message.provider);
    const volunteer = await Volunteer.findById(socket_data.message.volunteer);
    sock.emit("acceptPickup", { "message": socket_data.message,"provider":provider,"volunteer":volunteer});

    //send a message to provider
    sock = getUserSocket(socket_data.message.provider);
    sock.emit("acceptPickup", { "message": socket_data.message })
  })

  socket.on("finishPickup", async (socket_data) => {

    //change volunteer's and provider's ongoing_pickup status to true
    await Provider.findByIdAndUpdate(socket_data.message.provider, {"ongoing_pickup":false});
    await Volunteer.findByIdAndUpdate(socket_data.message.volunteer, {"ongoing_pickup":false});
    //we need to add the updated pickup obj to database
    await Pickup.findByIdAndUpdate(socket_data.message._id, socket_data.message);
   
    sock = getUserSocket("62178d81aa73e4f46d5ff2c5");
    const provider = await Provider.findById(socket_data.message.provider);
    const volunteer = await Volunteer.findById(socket_data.message.volunteer);
    sock.emit("finishPickup", { "message": socket_data.message,"provider":provider,"volunteer":volunteer});

  })

  socket.on("initiatePickup", async (sock_data) => {
    //provider sends this
    //ongoing_pickup to true
    await Provider.findByIdAndUpdate(sock_data.message.provider, {"ongoing_pickup":true});      
    sock = getUserSocket("62178d81aa73e4f46d5ff2c5");
    sock.emit("initiatePickupListen", { "message": sock_data.message });
  })

  socket.on("broadcastPickup", async(socket_data)=>{
    console.log("Volunteer rejected pickup request");

    await Pickup.findByIdAndUpdate(socket_data.message._id, socket_data.message);
    if (socket_data.message.broadcast) {
      console.log("Emmiting assign pickup event at index:72");
      socket.broadcast.emit("assignPickup", { "message": socket_data.message})
    } else {
      //the pickup object should have a volunteer id
      sock = getUserSocket(socket_data.message.volunteer);
      sock.emit("assignPickupSpecific",{"message": socket_data.message}); 
    }
    socket.broadcast.emit("assignPickup", { "message": socket_data.message})
    
  })

  socket.on("cancelPickup", async(socket_data)=>{
  
    if(socket_data.status==0){
    if(socket_data.role=="provider"){
    //The pickup has been cancelled by provider
    console.log("The pickup has been cancelled ",socket_data.pickup);
    await Pickup.findByIdAndDelete(socket_data.pickup._id);

    //notify the admin
    sock = getUserSocket("62178d81aa73e4f46d5ff2c5");
    sock.emit("informCancelPickup", {pickup:socket_data.pickup, status:socket_data.status});
    }
    }
    else if(socket_data.status==1){
      
      if(socket_data.role=="provider"){
        //The pickup has been cancelled by provider
        console.log("The pickup has been cancelled ",socket_data.pickup);
        await Pickup.findByIdAndDelete(socket_data.pickup._id);

        
        //notify the volunteer
        sock = getUserSocket(socket_data.pickup.volunteer);
        sock.emit("informCancelPickup", {pickup:socket_data.pickup,status:socket_data.status, role:socket_data.role});

        //notify the admin
        sock = getUserSocket("62178d81aa73e4f46d5ff2c5");
        sock.emit("informCancelPickup", {pickup:socket_data.pickup, status:socket_data.status, role:socket_data.role});        


      }
    }

    else if(socket_data.status==2){
      if(socket_data.role=="volunteer"){
        await Pickup.findByIdAndUpdate(socket_data.pickup._id, socket_data.pickup);
        socket.broadcast.emit("assignPickup", { "message": socket_data.pickup})

        //inform admin
        sock= getUserSocket("62178d81aa73e4f46d5ff2c5");
        sock.emit("informCancelPickup",{pickup:socket_data.pickup, status:socket_data.status, role:socket_data.role});

        //inform provider
        sock = getUserSockeT(socket_data.pickup.provider);
        sock.emit("informCancelPickup", {pickup:socket_data.pickup, status:socket_data.status, role:socket_data.role});
      }
    }
  })


})



