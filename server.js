const express = require('express');
const app = express(); // express is framework for building web applications in nodejs
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidv4} = require('uuid');//importing uuid v4
const {ExpressPeerServer} = require('peer');//importing peer,
const peerServer = ExpressPeerServer(server,{
    debug:true
});
app.set('view engine','ejs'); // setting ejs as view engine i.e. what render will be rendering
app.use(express.static('public'));

//specifing what url peerServer is going to use
app.use('/peerjs',peerServer);
app.get('/',(req, res) => {
    //res.status(200).send("Hello World");
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room',(req, res) => {
    res.render('room',{ roomId: req.params.room });
})

// socket.io workrking , opening connection and people can join the specific room
io.on('connection',socket =>{
    socket.on('join-room',(roomId,userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId);
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message)
        })
    })
})


server.listen(process.env.PORT || 3030); // server will be local host and port will be 3030