let uri = `mongodb://heir:buiLDa#Tr1b3!1@freecluster-shard-00-00-qpwyh.mongodb.net:27017,freecluster-shard-00-01-qpwyh.mongodb.net:27017,freecluster-shard-00-02-qpwyh.mongodb.net:27017/ToDoApp?ssl=true&replicaSet=FreeCluster-shard-0&authSource=admin`;
let uriTest = `mongodb://heir:buiLDa#Tr1b3!1@freecluster-shard-00-00-qpwyh.mongodb.net:27017,freecluster-shard-00-01-qpwyh.mongodb.net:27017,freecluster-shard-00-02-qpwyh.mongodb.net:27017/ToDoAppTest?ssl=true&replicaSet=FreeCluster-shard-0&authSource=admin`;
let env = process.env.NODE_ENV || `development`;
if (env === `development`) {

     // use local path variable for port, otherwise use port 3000
     process.env.PORT = 3000;
     process.env.MONGODB_URI = `${uri}`;
} else if (env === `test`) {
     process.env.PORT = 3000;
     process.env.MONGODB_URI = `${uriTest}`;
}
