/*
    Module: notifications
    Listens to notifications and feeds data to daemon services.
*/

const fs = require('fs-extra')
const errorLog = require('./utils').errorLog
const config = fs.readJSONSync('./config.json')

const services = [require('./subscription')]

const checkForNotifications = bot => {
    bot.get('notifications', { limit: config.notification_per_page })
        .then(res => {
            services.forEach(serv => {
                serv(bot, res.data)
            })
        })
        .catch(e => errorLog(e, 'check for notification'))
}

module.exports = checkForNotifications
