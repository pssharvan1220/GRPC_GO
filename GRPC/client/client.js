const PROTO_PATH = "../players.proto";

const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase:true,
    longs:String,
    enums:String,
    arrays:true
});

const PlayerService = grpc.loadPackageDefinition(packageDefinition).PlayerService

const client = new PlayerService(
    "localhost:50051",
    grpc.credentials.createInsecure()
)

module.exports = client;