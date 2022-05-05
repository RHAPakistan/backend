const admin = require('./firebase-config.js');
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
const inductionRouter = require("./routers/admin/inductionRouter");
const adminVolunteerRouter = require("./routers/admin/adminVolunteerRouter.js");
const notificationsRouter = require("./routers/admin/notificationsRouter.js");
const notificationHelpers = require("./helpers/notificationHelpers.js");
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;
const { Server, Socket } = require("socket.io");
const app = express();
const Pickup = require("./models/pickup");
const Provider = require("./models/provider");
const Volunteer = require("./models/volunteer");
const Admin = require('./models/admin');
const PushToken = require("./models/pushToken");
const backendHelpers = require("./helpers/backendHelpers");

const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");
const swaggerYAML = yaml.load('./swagger.yaml');

const {
  userJoin,
  getUserSocket,
  userLeave
} = require("./utils/users.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const adminId = "62555c0909b87f55c7dcf626";
//hassan's admin id
//const adminId = "621cb2d7ca5bf9149e41c9b4";

/**mongoose.connect('mongodb://127.0.0.1:27017/rhaDB', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})*/

//connecting to mongoDB database
//console.log(process.env.DB_NAME, process.env.emailPassword);
mongoose.connect(process.env.MONGODB_URL || `mongodb://localhost:27017/RHA_DB`, {

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
app.use('/api/admin/induction', inductionRouter);
app.use('/api/admin/volunteer', adminVolunteerRouter);
app.use('/api/admin/notifications', notificationsRouter);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerYAML));

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
      socket.broadcast.emit("assignPickup", { "message": socket_data.message});

      //send notification to all volunteers
      notificationHelpers.send_notification_all(
        "volunteer",
        "Pickup Assignment",
        "Admin has broadcasted a pickup");

    } else {
      //the pickup object should have a volunteer id
      sock = getUserSocket(socket_data.message.volunteer);
      sock?sock.emit("assignPickupSpecific",{"message": socket_data.message}):console.log("user not active"); 
      notificationHelpers.send_notification_to(
        socket_data.message.volunteer,
        "Pickup Assignment",
        "The admin has assigned a pickup specifically to you"
        )
    }
  })

  app.set("socketio", socket);

  socket.on("foodPicked", async (socket_data) => {
    //socket.message holds the pickup object.
    var pickup = socket_data.message;
    console.log("food picked of ", socket_data.message);
    pickup.status = 3;
    await Pickup.findByIdAndUpdate(socket_data.message._id, pickup);

    //send a message to provider
    sock = getUserSocket(socket_data.message.provider);
    sock?sock.emit("foodPicked", { "message": pickup}):console.log("user not active");
    //send notifcation to provider
    notificationHelpers.send_notification_to(
      socket_data.message.provider,
      "Food Picked",
      "The food has been picked"
    );


    //send a message to admin
    sock = getUserSocket(adminId);
    sock?sock.emit("foodPicked", { "message": pickup}):console.log("user not active");
    ///send notification to admin
    notificationHelpers.send_notification_to(
      adminId,
      "Food Picked",
      "The food has been picked"
    )     

  })

  socket.on("foodDelivered", async (socket_data) => {
    console.log("food delivered of ", socket_data.message);
  })

  socket.on("acceptPickup", async (socket_data) => {

    // console.log("pickup acceped => ", socket_data);
    //update volunteer's ongoing_pickup status
    await Volunteer.findByIdAndUpdate(socket_data.message.volunteer, {"ongoing_pickup":true});
    
    //we need to add the updated pickup obj to database
    await Pickup.findByIdAndUpdate(socket_data.message._id, socket_data.message);

    //notify admin
    sock = getUserSocket(adminId);
    const provider = await Provider.findById(socket_data.message.provider);
    const volunteer = await Volunteer.findById(socket_data.message.volunteer);
    sock?sock.emit("acceptPickup", { "message": socket_data.message,"provider":provider,"volunteer":volunteer}):console.log("user not active");
    //send notification to admin
    notificationHelpers.send_notification_to(
      adminId,
      "Pickup Accepted",
      "The pickup has been accepted"
    )       



    //send a message to provider
    sock = getUserSocket(socket_data.message.provider);
    sock?sock.emit("acceptPickup", { "message": socket_data.message }):console.log("user not active");
    notificationHelpers.send_notification_to(
      socket_data.message.provider,
      "Pickup accepted",
      "The pickup has been accepted"
    )   
  })

  socket.on("finishPickup", async (socket_data) => {

    //change volunteer's and provider's ongoing_pickup status to true
    await Provider.findByIdAndUpdate(socket_data.message.provider, {"ongoing_pickup":false});
    await Volunteer.findByIdAndUpdate(socket_data.message.volunteer, {"ongoing_pickup":false});
    //we need to add the updated pickup obj to database
    var pickup = socket_data.message;
    pickup.status = 4;
    await Pickup.findByIdAndUpdate(socket_data.message._id, pickup);
   
    //inform admin
    sock = getUserSocket(adminId);
    const provider = await Provider.findById(socket_data.message.provider);
    const volunteer = await Volunteer.findById(socket_data.message.volunteer);
    sock?sock.emit("finishPickup", { "message": pickup,"provider":provider,"volunteer":volunteer}):console.log("user not active");
    //send notification to admin
    notificationHelpers.send_notification_to(
      adminId,
      "Food Delivered",
      "The food has been delivered"
    )   

  })

  socket.on("initiatePickup", async (sock_data) => {
    //provider sends this
    //ongoing_pickup to true
    await Provider.findByIdAndUpdate(sock_data.message.provider, {"ongoing_pickup":true});      
    sock = getUserSocket(adminId);
    sock?sock.emit("initiatePickupListen", { "message": sock_data.message }):console.log("user not active");
    //send notification to admin
    notificationHelpers.send_notification_to(
      adminId,
      "Pickup initiated",
      "The pickup has been initiated"
    )   
    
  })

  socket.on("broadcastPickup", async(socket_data)=>{
    console.log("Volunteer rejected pickup request");

    await Pickup.findByIdAndUpdate(socket_data.message._id, socket_data.message);
    if (socket_data.message.broadcast) {
      console.log("Emmiting assign pickup event at index:72");
      socket.broadcast.emit("assignPickup", { "message": socket_data.message})
      //send notification to all volunteers
      notificationHelpers.send_notification_all(
        "volunteer",
        "Pickup Assignment",
        "Admin has broadcasted a pickup");
    } else {
      //the pickup object should have a volunteer id
      sock = getUserSocket(socket_data.message.volunteer);
      sock?sock.emit("assignPickupSpecific",{"message": socket_data.message}):console.log("user not active"); 
      //send notification to the vol
      notificationHelpers.send_notification_to(
        socket_data.message.volunteer,
        "Pickup Assignment",
        "The pickup has been assigned specifically to you"
      )   
    }
    // socket.broadcast.emit("assignPickup", { "message": socket_data.message})
    
  })

  socket.on("cancelPickup", async(socket_data)=>{
  
    if(socket_data.status==0){
    if(socket_data.role=="provider"){
    //The pickup has been cancelled by provider
    console.log("The pickup has been cancelled ",socket_data.pickup);
    var pickup = socket_data.pickup;
    pickup.status=5;
    await Pickup.findByIdAndUpdate(pickup._id, pickup);

    //notify the admin
    sock = getUserSocket(adminId);
    sock?sock.emit("informCancelPickup", {pickup:pickup, status:socket_data.status, role: socket_data.role}):console.log("user not active");
    notificationHelpers.send_notification_to(
      adminId,
      "Pickup Cancelled",
      `The pickup has been cancelled by ${socket_data.role}`
    )   
    }

    //the admin cancels pickup
    if(socket_data.role=="admin"){
      console.log("The pickup has been cancelled by admin");
      var pickup = socket_data.pickup;
      pickup.status=5;
      await Pickup.findByIdAndUpdate(pickup._id,pickup);

      //notify provider
      sock = getUserSocket(socket_data.pickup.provider);
      sock?sock.emit("informCancelPickup", {pickup: pickup, status:socket_data.status, role: socket_data.role}):console.log("user not active");
      notificationHelpers.send_notification_to(
        socket_data.pickup.provider,
        "Pickup Cancelled",
        `The pickup has been cancelled by ${socket_data.role}`
      )   
    }


    }
    else if(socket_data.status==1){
      
      if(socket_data.role=="provider"){
        //The pickup has been cancelled by provider
        console.log("The pickup has been cancelled ",socket_data.pickup);
        var pickup = socket_data.pickup;
        pickup.status=5;
        await Pickup.findByIdAndUpdate(pickup._id, pickup);
        
        //notify the volunteer
        if(pickup.volunteer){
        sock = getUserSocket(socket_data.pickup.volunteer);
        sock?sock.emit("informCancelPickup", {pickup:pickup,status:socket_data.status, role:socket_data.role}):console.log("user not active");
        }
        console.log("no volunteer assigned");
        notificationHelpers.send_notification_to(
          socket_data.message.volunteer,
          "Pickup Cancelled",
          `The pickup has been cancelled by ${socket_data.role}`
        )   
        //notify the admin
        sock = getUserSocket(adminId);
        sock?sock.emit("informCancelPickup", {pickup:pickup, status:socket_data.status, role:socket_data.role}):console.log("user not active");       
        notificationHelpers.send_notification_to(
          adminId,
          "Pickup Cancelled",
          `The pickup has been cancelled by ${socket_data.role}`
        )    


      }

    //the admin cancels pickup
    if(socket_data.role=="admin"){
      console.log("The pickup has been cancelled by admin at status1");
      var pickup = socket_data.pickup;
      pickup.status=5;
      await Pickup.findByIdAndUpdate(pickup._id,pickup);

      //notify provider
      sock = getUserSocket(socket_data.pickup.provider);
      sock?sock.emit("informCancelPickup", {pickup: pickup, status:socket_data.status, role: socket_data.role}):console.log("user not active");
      console.log("informed provider");
      notificationHelpers.send_notification_to(
        socket_data.pickup.provider,
        "Pickup Cancelled",
        `The pickup has been cancelled by ${socket_data.role}`
      )    
      //notify volunteer
      if(socket_data.pickup.volunteer){
      sock = getUserSocket(socket_data.pickup.volunteer);
      sock?sock.emit("informCancelPickup", {pickup:pickup, status:socket_data.status, role: socket_data.role}):console.log("user not active");
      notificationHelpers.send_notification_to(
        socket_data.pickup.volunteer,
        "Pickup Cancelled",
        `The pickup has been cancelled by ${socket_data.role}`
      )    
      }
      else{
        socket.broadcast.emit("informCancelVolunteer",{pickup:pickup, status:socket_data.status, role: socket_data.role});
        notificationHelpers.send_notification_all(
          "volunteer",
          "Pickup Assignment",
          "Admin has broadcasted a pickup");
      }
    }
    }

    else if(socket_data.status==2){
      if(socket_data.role=="volunteer"){
        var pickup = socket_data.pickup;
        pickup.broadcast=true;
        pickup.status=1;
        delete pickup.volunteer;
        await Pickup.findByIdAndUpdate(pickup._id, pickup);
        socket.broadcast.emit("assignPickup", { "message": pickup})
        notificationHelpers.send_notification_all(
          "volunteer",
          "Pickup Assignment",
          "Admin has broadcasted a pickup");

        //inform admin
        sock= getUserSocket(adminId);
        sock?sock.emit("informCancelPickup",{pickup:pickup, status: socket_data.status, role:socket_data.role}):console.log("user not active");
        notificationHelpers.send_notification_to(
          adminId,
          "Pickup Cancelled",
          `The pickup has been cancelled by ${socket_data.role}`
        )    
        //inform provider
        sock = getUserSocket(pickup.provider);
        sock?sock.emit("informCancelPickup", {pickup:pickup, status: socket_data.status, role: socket_data.role}):console.log("user not active");
        notificationHelpers.send_notification_to(
          socket_data.pickup.provider,
          "Pickup Cancelled",
          `The pickup has been cancelled by ${socket_data.role}`
        )    
      }

    //the admin cancels pickup
    if(socket_data.role=="admin"){
      console.log("The pickup has been cancelled by admin", socket_data);
      var pickup = socket_data.pickup;
      pickup.status=5;
      await Pickup.findByIdAndUpdate(pickup._id,pickup);

      //notify provider
      sock = getUserSocket(socket_data.pickup.provider);
      sock?sock.emit("informCancelPickup", {pickup: pickup, status:socket_data.status, role: socket_data.role}):console.log("user not active");
      notificationHelpers.send_notification_to(
        socket_data.pickup.provider,
        "Pickup Cancelled",
        `The pickup has been cancelled by ${socket_data.role}`
      )    
      //notify volunteer
      sock = getUserSocket(socket_data.pickup.volunteer);
      sock?sock.emit("informCancelPickup", {pickup:pickup, status:socket_data.status, role: socket_data.role}):console.log("user not active");
      notificationHelpers.send_notification_to(
        socket_data.pickup.volunteer,
        "Pickup Cancelled",
        `The pickup has been cancelled by ${socket_data.role}`
      )    
    }
    }
  })


})



