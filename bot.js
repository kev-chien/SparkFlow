var env = require('node-env-file');
env(__dirname + '/.env');


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

controller.hears('hello', 'direct_message,direct_mention', function(bot, message) {
    bot.reply(message, 'Hi');
});

controller.on('direct_mention', function(bot, message) {
    bot.reply(message, 'You mentioned me and said, "' + message.text + '"');
});

controller.on('direct_message', function(bot, message) {
    bot.reply(message, 'I got your private message. You said, "' + message.text + '"');
});
