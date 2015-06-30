var Chat=function(socket){
    this.socket=socket;
}
Chat.prototype.sendMsg=function(room,text){
    var msg={
        room:room,
        text:text
    }
    this.socket.emit('message',msg);
};
Chat.prototype.changeRoom=function(room){
    this.socket.emit('join',{
        newRoom:room
    });
};
Chat.prototype.processCmd=function(cmd){
    var words=cmd.split(' ');
    var cmd =words[0].substring(1,words[0].length).toLowerCase();
    var msg=false;
    switch (cmd){
        case 'join':
            words.shift();
            var room=words.join(' ');
            this.changeRoom(room);
            break;
        default :
            msg='未识别指令';
            break;
        return msg;
    }
}