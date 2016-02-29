var api = require('./lib/api');
var express = require('express');
var multer = require('multer');

var upload = multer({
    'dest': '/tmp/',
    'limits': {'fileSize': 1000000, 'files': 1}
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    return res.render('index');
});

app.post('/api/fixquiz', upload.single('qti'), function(req, res) {
    api.fix(req.file.path, function(err, xml) {
        if (err) {
            return res.status(500).send(err);
        }
        var filename = req.file.originalname.split('.');
        filename.pop();
        filename = filename.join('.');
        filename += '-fixed.xml';
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/xml');
        return res.send(xml);
    });
});

app.listen(server_port, server_ip_address);
