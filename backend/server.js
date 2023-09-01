const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http"); //Importa Node Js

//Função para verificar se o PORT é válido
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

//Função para checar o tipo de erro
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//Função para dizer qual PORT estamos usando
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

//Função para conectar no na padrão ou porta 3000 do servidor
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//Conecta no servidor e ativa as funções anteriores
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
