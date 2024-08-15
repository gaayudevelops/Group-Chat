
const socketIo = require('socket.io');
const express = require('express');
const fs = require('fs');
const path = require ('path');
const sequelize= require('./util/database');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
app.use(cors());

const userRoutes = require('./routes/user');
const resetPasswordRoutes = require('./routes/reset-password');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');

const User = require('./models/user');
const Forgotpassword = require('./models/forgot-password');
const Message = require('./models/message');
const Group = require('./models/group');
const UserGroup = require('./models/user-group');

const server = app.listen(3000);
const io = socketIo(server)

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('send-message', (message,groupid,toid,userid)=> {
        console.log("userid :" +userid)
        console.log("Message :", message);
        console.log("toid :" ,toid);
        console.log("groupid :" ,groupid);
        if(groupid){
            const toServer = {message,userid}
           socket.to(groupid).emit('recieve-message',toServer)
        }else{
            // socket.to(groupid).emit('recieve-message',message)
        }

    })
    socket.on('join-room',groupid => {
        console.log(groupid)
        socket.join(groupid);
    })
})

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags : 'a'}
);

app.use(express.json());
// app.use(helmet());
app.use(morgan('combined',{stream: accessLogStream}));

app.use('/user', userRoutes);
app.use('/password', resetPasswordRoutes);
app.use('/message', messageRoutes);
app.use('/group', groupRoutes);

app.use((req,res) =>{
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group,{through:UserGroup});
Group.belongsToMany(User,{through:UserGroup});

Group.hasMany(Message);
Message.belongsTo(Group);


sequelize.sync()
.then()
.catch(err=> console.log(err));

