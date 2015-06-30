function divEle(msg){
    return $('<div class="chat-card right"><div class="content">'+msg+'</div></div>');
}
function divSystemEle(msg){
    return $('<div></div>').html('<i>'+msg+'</i>');
}
function processUserInput(chatApp,socket){
    var msg=$('#send-message').val();
    var systemMsg;
    if(msg.charAt(0) == '/'){
        systemMsg=chatApp.processCmd(msg);
        if(systemMsg){
            $('#message').append(divSystemEle(systemMsg));
        }
    }else{
        chatApp.sendMsg($('#room').text(),msg);
        $('#message').append(divEle(msg));
        $('#message').scrollTop($('#message').prop('scrollHeight'));
    }
    $('#send-message').val('');
}

var socket=io.connect();
$(function(){
    var chatApp=new Chat(socket);
    socket.on('joinResult',function(result){
        $('#room').text(result.room);
    });
    socket.on('message',function(message){
        var newElement=$('<div class="chat-card left"><div class="content">'+message.text+'</div></div>');
        $('#message').append(newElement);
    });
    $('#send-form').submit(function(){
        processUserInput(chatApp,socket);
        return false;
    });
})