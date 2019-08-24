/*
    Module: subscription
    Manages subscribers.
    Listens to notifications, 
    Registers new subscribers,
    Removes no-longer subscribers.
*/

const fs = require('fs-extra')
const errorLog = require('./utils').errorLog
const config = fs.readJSONSync('./config.json')
const list_file = config.subscribers_file

const dismissNotification = require('./notification_utils').dismissNotification
const replyTo = require('./notification_utils').replyTo
const log = require('./utils').logIfDebug

const replyToAction = (bot, action, id, acct) => {
    replyTo(bot, id, 'direct', acct, `successfully ${action}d.`)
}

const checkTagType = tags => {
    if (
        tags &&
        tags.length === 1 &&
        ['subscribe', 'unsubscribe'].includes(tags[0].name)
    )
        return tags[0].name

    return ''
}

// valid subscription message:
// @<account of bot> #subscribe
// visibility: whatever
// "#subscribe" is a tag; one and only tag in the status
const checkForSubscription = (bot, notifications) => {
    if (config.enable.record_subscription) {
        log('running through subscription check')
        notifications.forEach(notif => {
            const subscribers = fs.readJSONSync(list_file)

            if (notif.type === 'mention' && notif.status) {
                // `status` is nullable
                const tags = notif.status.tags
                const acct = notif.status.account.acct

                if (
                    // subscribe
                    checkTagType(tags) === 'subscribe' &&
                    !subscribers.includes(acct) // prevent duplicate
                ) {
                    console.info('subscribed:', acct)
                    subscribers.push(acct)
                    fs.writeJSONSync(list_file, subscribers)
                    replyToAction(bot, 'subscribe', notif.status.id, acct)
                    dismissNotification(bot, notif.id)
                } else if (
                    // unsubscribe
                    // reverse process
                    checkTagType(tags) === 'unsubscribe' &&
                    subscribers.includes(acct)
                ) {
                    console.info('unsubscribed:', acct)
                    // remove user from list
                    subscribers.splice(subscribers.indexOf(acct), 1)
                    fs.writeJSONSync(list_file, subscribers)
                    replyToAction(bot, 'unsubscribe', notif.status.id, acct)
                    dismissNotification(bot, notif.id)
                }
            }
        })
    }
}

module.exports = checkForSubscription
