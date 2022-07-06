const express = require('express')

const session = require('express-session');
const passport = require('passport');

require('./auth');

const app = express()

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}


const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4:uuidV4} = require('uuid')
const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(server, { 
  debug: true,
});



app.set('view engine','ejs')
app.use(express.static('public'))


app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


const path = require("path");
const { Http2ServerRequest } = require('http2');


app.get('/MyGmeetClone', (req,res)=>{
    res.send('<a href="/auth/google">Authenticate with Google</a>');
})

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/',
    failureRedirect: '/auth/google/failure'
  })
);

app.get("/",isLoggedIn, (req, res) => { 
  res.sendFile(path.join(__dirname, "public", "index.html")); 
});

app.get('/join', (req,res)=>{
    res.redirect(`/${uuidV4()}`)
})




app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
  });

  
  app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
  });



app.get('/:room', (req,res) => {
    res.render('room', {roomId: req.params.room})
})

io.on('connection',socket => {
    socket.on('join-room',(roomId,userId) =>{
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected',userId)

        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message)
        }); 
      

    socket.on('disconnect', ()=>{
        socket.broadcast.to(roomId).emit('user-disconnected',userId)
        })
    })
})

server.listen(3000)


