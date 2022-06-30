const express = require('express');
const morgan = require("morgan");
const cors = require('cors')
const path = require('path');

const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://service.pre.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/verbeelden/v2/";

// Logging
app.use(morgan('dev'));


var corsOptions =
{
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "credentials": true
}

app.use(cors(corsOptions));

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('OZON vector tiles ESRI gateway');
});

app.get('/', (req, res, next) => {
    res.send('');
});


app.all('/owvector_pre/VectorTileServer', function (req, res) {   
    res.sendFile(path.join(__dirname + '/templates/vectortileserver.json'));
});

app.all('/owvector_pre/VectorTileServer/resources/info', function (req, res) {
    res.send('{"resourceInfo:[]"}');

});

app.all('/owvector_pre/VectorTileServer/resources/styles', function (req, res) {
    res.sendFile(path.join(__dirname + '/templates/style.json'));
});
app.all('/owvector_pre/VectorTileServer/resources/styles/', function (req, res) {
    res.sendFile(path.join(__dirname + '/templates/style.json'));
});
app.all('/owvector_pre/VectorTileServer/resources/styles/root.json', function (req, res) {   
    res.sendFile(path.join(__dirname + '/templates/style.json'));
});


//Proxy endpoints
app.use('/owvector_pre/VectorTileServer/resources/sprites', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/owvector_pre/VectorTileServer/resources/sprites': '' },
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = (req.header('origin')
            || req.header('x-forwarded-host') || req.header('referer') || req.header('host'));
    }
}));

// Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});


module.exports = app;
