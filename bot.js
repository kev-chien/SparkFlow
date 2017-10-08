var personId = "";
var checkTimeToWork = "";
var started = false; // bot has been requested to start tracking free time
var breakTime = false; // currently in free time
// var working = false; // currently working
var timerCheckTimeForWork = null;  // refers to a timer
var messageMem = null;
var botMem = null;

var env = require('node-env-file');
env(__dirname + '/.env');

var _ = require('underscore');

if (!process.env.access_token) {
    console.log('Error: Specify a Cisco Spark access_token in environment.');
    usage_tip();
    process.exit(1);
}

if (!process.env.public_address) {
    console.log('Error: Specify an SSL-enabled URL as this bot\'s public_address in environment.');
    usage_tip();
    process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var controller = Botkit.sparkbot({
    debug: true,
    log: true,
    public_address: process.env.public_address,
    ciscospark_access_token: process.env.access_token,
    secret: process.env.secret
});


var bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log("SPARK: Webhooks set up!");
    });
});

/* first initiation by user */
controller.hears('start', 'direct_message,direct_mention', function(bot, message) {
    bot.reply(message, 'Hi, wait a second for me to pull your Google Calendar data.');
    started = true;
    timerCheckTimeForWork = setInterval(_.bind(checkForTimeForWork, this, bot, message), 1000);
});

var checkForTimeForWork = function (bot, message) {
    /* Lawrence's checking function goes here */
    bot.reply(message, 'I think its time to work');

    var breakTimes = listUpcomingEvents();
    var dateTime = require('node-datetime');
    var isBreak = 0;
    var position = 0;

    if (dateTime > breakTimes.get(position).get(0)) {
        isBreak = 1;

    } else if (dateTime > breakTimes.get(position).get(1)) {
        isBreak = 0;
        position += 1;
    }
}



controller.hears('cancel', 'direct_message,direct_mention', function(bot, message) {
    if (checkTimeForWork) {
        console.log(checkTimeForWork);
        clearInterval(checkTimeForWork);
        checkTimeForWork = null;
        bot.reply(message, 'worktime canceled');
    }
});

controller.hears('hello', 'direct_message,direct_mention', function(bot, message) {
    bot.reply(message, 'Hi');
});

