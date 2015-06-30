var socketio=require('socket.io');
var io;
var guestNum=1;
var nickNames={};
var nameUsed=[];
var currentRoom={};
exports.listen=function(server){
    io=socketio.listen(server);
    io.sockets.on('connection',function(socket){
        guestNum=assignGuestName(socket,guestNum,nickNames,nameUsed);
        joinRoom(socket,'临时群');
        handleMessageBroadcasting(socket);
        handleRoomJoining(socket);
        socket.on('rooms',function(){
            socket.emit('rooms',io.sockets.managers.rooms);
        })

    });
    function handleMessageBroadcasting(socket){
        socket.on('message',function(message){
            socket.broadcast.to(message.room).emit('message',{
                text:nickNames[socket.id]+': '+message.text
            })
        })
    };
    function handleRoomJoining(socket){
        socket.on('join',function(room){
            socket.leave(currentRoom[socket.id]);
            joinRoom(socket,room.newRoom);
        });
    };
    function assignGuestName(socket,guestNumber,nickNames,namesUsed){
        var name='用户'+guestNumber;
        nickNames[socket.id]=name;
        socket.emit('nameResult',{
            success:true,
            name:name
        });
        nameUsed.push(name);
        return guestNumber+1;
    };
    function joinRoom(socket,room){
        socket.join(room);
        currentRoom[socket.id]=room;
        //TODO
        socket.emit('joinResult',{room:room});
        socket.broadcast.to(room).emit('message',{
            text:nickNames[socket.id]+'加入了群'+room+'.'
        })
        /*var usersInRoom=io.sockets.client(room);
        if(usersInRoom.length>1){
            var usersInRoomSummary='群里的其他用户：';
            for(var index in usersInRoom){
                var userSocketId=usersInRoom[index].id;
                if(socket.id!=userSocketId){
                    if(index>0){
                        usersInRoomSummary+=',';
                    }
                    usersInRoomSummary+=nickNames[userSocketId];
                }
            }
            usersInRoomSummary+='.';
            socket.emit('message',{text:usersInRoomSummary});
        }*/
    }
}