const PROTO_PATH = "./players.proto";

var grpc = require('@grpc/grpc-js');
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase:true,
    longs:String,
    enums:String,
    arrays:true
});

var playersProto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server()

const players = [
    {
        id:'a68b823c-7ca6-44bc-b721-fb4d5312cafc',
        name:'Elankumaran Sivasubramaniam',
        distric:'Jaffna'
    },
    {
        id:'a68b823c-7ca6-44bc-b721-fb4d5312cnhu',
        name:'Kanakathurai Tharsan',
        distric:'Jaffna'
    },
    {
        id:'a68b823c-7ca6-87yh-b721-fb4d5312cafc',
        name:'Balachchandran Thinusan',
        distric:'Jaffna'
    }
]

server.addService(playersProto.PlayerService.service,{
    getAll:(_,callback) => {
        callback(null, {players})
    },

    getOnePlayer:(call,callback) => {
        let player = players.find(n => n.id == call.request.id);
        if(player){
            callback(null,player)
        } else {
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Not Found"
            })
        }
    },

    insert: (call, callback) => {
        let player = call.request;
        players.push(player)
        callback(null,player);
    },

    update:(call,callback) => {
        let player = players.find(n => n.id == call.request.id)
        if(player){
            player.name = call.request.name,
            player.distric = call.request.distric
            callback(null, player)
        } else {
            callback({
                code:grpc.status.NOT_FOUND,
                details:'Not Found'
            })
        }
    },

    remove: (call,callback) => {
        let playerIndex = players.findIndex(n => n.id == call.request.id)
        if(playerIndex != -1){
            players.splice(playerIndex,1)
            callback(null,{})
        } else {
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Not Found"
            })
        }
    }
})

server.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log("Server running at http://127.0.0.1:50051");
        server.start();
    }
);