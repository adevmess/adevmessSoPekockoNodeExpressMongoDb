const http = require("http");
const app = require("./app");


//on verifie que le port est bien un number, auxquel cas on le transforme en number
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
//récupération et assignation du port dynamiquement(via la variable d'environnement ou port défini)
const port = normalizePort(process.env.PORT || process.env.NORMALIZE_PORT); //recupere le port
app.set("port", port);


//gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};



const server = http.createServer(app);


//renvoie du port en écoute sur la console 
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});


//on ecoute le port envoyer par le syteme ou notre port
server.listen(process.env.PORT || process.env.PORT_NUMBER);