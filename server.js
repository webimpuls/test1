var path = require('path');
var express = require('express');
var main = require('./main');
var app = express();

app.use(express.static(
    path.join(__dirname, 'www-test/dist'),
    {
        maxAge: 1000 * 60 * 15
    }
))
app.get('/data/users'  , main.users_list);
app.get('/data/install', main.install_tables);
app.listen(80);

var minutelyInterval = setInterval(()=>{ main.minutely(); }, 1000 * 60);
main.minutely();