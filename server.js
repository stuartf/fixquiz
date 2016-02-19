var express = require('express');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var app = express();

app.post('/api/fixquiz', function(req, res) {
    res.send(api.fix(req.files.qti.path));
});

app.listen(server_port, server_ip_address);
