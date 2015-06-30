var http=require('http');
var fs=require('fs');
var path=require('path');
var mime=require('mime');
var cache={};


function sendFile(response,filePath,fileContents){
    response.writeHead(
        200,
        {"content-type":mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
};
function serveStatic(response,cache,absPath){
    fs.exists(absPath,function(exists){
        if(exists){
            fs.readFile(absPath,function(err,data){
                if(!err){
                    cache[absPath]=data;
                    sendFile(response,absPath,data);
                }
            })
        }
    })
    /*if(cache[absPath]){
        sendFile(response,absPath,cache[absPath]);
    }else{
        fs.exists(absPath,function(exists){
            if(exists){
                fs.readFile(absPath,function(err,data){
                    if(!err){
                        cache[absPath]=data;
                        sendFile(response,absPath,data);
                    }
                })
            }
        })
    }*/
};
var server=http.createServer(function(request,response){
    var filePath=false;
    if(request.url == '/'){
        filePath='public/index.html';
    }else{
        filePath='public'+request.url;
    }
    var absPath='./'+filePath;
    serveStatic(response,cache,absPath);
});
server.listen(3000,function(){
    console.log('server is listening 3000');
});

var chatServer=require('./lib/chat_server');
chatServer.listen(server);

