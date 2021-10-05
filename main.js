const {Pool, Client} = require('pg');
const pool = new Pool({
    user: 'wimp_t1',
    host: 'postgresql.wimp.myjino.ru',
    database: 'wimp_t1',
    password: 'RrM<vUz2=^X7',
    port: 5432
});

var https = require('https');

module.exports = {
    minutely(){
        let reqOptions = {
            hostname: 'reqres.in',
            path: '/api/users?per_page=1000',
            port: 443,
            method: 'GET'
        }
        let req = https.request(reqOptions, (res)=>{
            var data = '';
            res.on('data', (chunk)=>{
                data += chunk;
            });
            res.on('end', ()=>{
                let users = JSON.parse(data);
                if (Array.isArray(users.data)) {
                    this.usersUpdate(users.data);
                }
            });
        });
        req.on('error', (e)=>{
            console.log('ошибочка вышла');
        });
        req.end();
    
    },
    usersUpdate(list){
        for (let i in list) {
            let user = list[i];
            let query = {
                text: 'INSERT INTO "users"("id","email","first_name","last_name","avatar") VALUES($1,$2,$3,$4,$5) ON CONFLICT ("id") DO NOTHING',
                values: [ user.id, user.email, user.first_name, user.last_name, user.avatar ]
            }
            pool.query(query,(err,res)=>{
                if (!err) {
                    console.log('loaded user #' + user.id + ' ' + user.first_name + ' ' + user.last_name );
                } else {
                    console.log('error on user adding', err);
                }
            });
        }
    },
    users_list(req,res) {
        //console.log('req:', req);
        let queryWhere = '';
        let queryValues = [];
        if ( (typeof (req.query['q']) == "string") && (req.query['q'].length < 255) ) {
            queryWhere = 'WHERE LOWER("first_name") LIKE CONCAT(\'%\',LOWER($1::varchar),\'%\') OR LOWER("last_name") LIKE CONCAT(\'%\',LOWER($1::varchar),\'%\')';
            queryValues = [req.query.q];
        }
        pool.query(
            {
                text: 'SELECT * FROM "users" ' + queryWhere + ' ORDER BY "id";',
                values: queryValues
            },
            (err,data) => {
                res.send(JSON.stringify(data.rows));
            }
        );
    },
    install_tables(req, res) {
        //pool.query('DROP TABLE IF EXISTS "users";');
        pool.query(
            'CREATE TABLE "users"('+
                '"id" INT NOT NULL,'+
                '"email" VARCHAR,'+
                '"first_name" VARCHAR,'+
                '"last_name" VARCHAR,'+
                '"avatar" VARCHAR,'+
                'PRIMARY KEY("id")'+
            ');'
        );
        res.send('{"ok":true}');
    }
};