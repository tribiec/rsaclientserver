//* Carlos Tribiec
//* 24.381.320
const cors = require("cors");
const express = require("express");
const path = require("path");
const http = express();
const https = require("https");
const fs = require("fs");
const SSLServer = express();
const jsencrypt = require('node-jsencrypt');
const encrypt = new jsencrypt();
const decrypt = new jsencrypt();
const keys = require('./keys/index.js');
const portSSL = 8080;
const portHTTP = 80;
const SSLOptions = {
  cert: fs.readFileSync("cert/ca.crt"),
  key: fs.readFileSync("cert/ca.key"),
};

//* Configuracion de Llaves
decrypt.setPrivateKey(keys.priv);
encrypt.setPublicKey(keys.pub);

//* Aplicar Configuracion y Poner en escucha Servidores
https.createServer(SSLOptions, SSLServer).listen(portSSL, () => {
  console.log(`SSL Server Initialized on port ${portSSL}`);
});

http.listen(portHTTP, () => {
  console.log(`HTTP Server Initialized on port ${portHTTP}`);
});

http.all("*", function (req, res) {
  return res.redirect(`https://localhost:${portSSL}`);
});

//* Middlewares
SSLServer.use(cors());
SSLServer.use(express.json());
SSLServer.use(express.static(path.resolve(__dirname,'public')))

//* Rutas
SSLServer.post("/", (req, res) => {
  const textoEncriptado = req.body.mensaje
  if(textoEncriptado){
    const textoDesencriptado = decrypt.decrypt(req.body.mensaje);
    console.log(textoDesencriptado);
    res.json({ message: "Mensaje recibido y decodificado exitosamente en el Servidor" }).status(200);
  }
});
