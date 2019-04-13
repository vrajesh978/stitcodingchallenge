const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helper/db');
const User = db.User;
const $https = require('https');

module.exports = {
    authenticate,
    getById,
    create,
    update,
    getEvent
};


const genreIDDict = {
"R&B": "KnvZfZ7vAee",
"Hip-Hop/Rap": "KnvZfZ7vAv1",
"Comedy": "KnvZfZ7vAe1",
"Classical": "KnvZfZ7v7nJ",
"Jazz": "KnvZfZ7vAvE",
"Foreign": "KnvZfZ7vAk1",
"Dance/Electronic": "KnvZfZ7vAvF",
"Comedy": "KnvZfZ7vAkA",
"Animation": "KnvZfZ7vAkd",
"Music": "KnvZfZ7vAkJ",
"Miscellaneous": "KnvZfZ7vAka",
"Family": "KnvZfZ7vAkF",
"Miscellaneous Theatre": "KnvZfZ7v7ld",
"Theatre": "KnvZfZ7v7l1",
};


async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}


async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    Object.assign(user.preferences, userParam.preferences);
    await User.update(user);
}

async function getEvent(id){
    const user  = await User.findById(id);
    if(!user) throw 'User not found';
    let preferences = user.preferences;
    if(preferences === undefined)
        throw 'preferences are not set by users please set the preferences';
    var promises = [];
    var results = [];
    for (i = 0; i < preferences.length; i++) { 
        genreID = genreIDDict[preferences[i].genreID];
        var promise = await makeCallToGetEvents(preferences[i].category,genreID);
        promises.push(promise);
    }
    return Promise.all(promises).then(function(dataArr) {
        dataArr.forEach(function(data){
            results.push(JSON.parse(data));
        });
        return results;
    }).catch(function(err) {
        return err;
    });
}


function makeCallToGetEvents(category,genreID){
    const API_URI = 'yv1x0ke9cl.execute-api.us-east-1.amazonaws.com';
    const PATH = '/prod/events?classificationName='+category+"&genreId="+genreID;
    const USERNAME = 'stitapplicant';
    const PASSWORD = 'zvaaDsZHLNLFdUVZ_3cQKns';
    var options = {
        host: API_URI,
        port: 443,
        path: PATH,
        // authentication headers
        headers: {
            'Authorization': 'Basic ' + new Buffer(USERNAME + ':' + PASSWORD).toString('base64')
        }   
    };
    return new Promise(function(resolve, reject) {
        var req = $https.get(options, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            var body = "";
            res.on('data', function(data) {
                body += data ;
                
            });
            // resolve on end
            res.on('end', function() {
                //console.log(body);
                resolve(body);
            });
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        req.end();
    });
}


