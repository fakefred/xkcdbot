/*
    Module: notification_utils
    Utilities for notification processing.
*/

const replyTo = (bot, in_reply_to_id, visibility, account_to_mention, msg) => {
    bot.post('statuses', {
        in_reply_to_id,
        visibility,
        status: `@${account_to_mention} ${msg}`
    })
}

const dismissNotification = (bot, id) => {
    bot.post('notifications/dismiss', { id })
}

module.exports = { replyTo, dismissNotification }
