/*
    Module: delivery
    Delivers xkcd comic feed to subscribers.
    Replies to comic toot with comments mentioning subscribers.
*/

const fs = require('fs-extra')
const config = fs.readJSONSync('./config.json')
const subscribers = fs.readJSONSync(config.subscribers_file)

const constructComments = accts => {
    let comments = [config.comment_for_subscribers_prompt]
    accts.forEach(acct => {
        if ((comments[comments.length - 1] + ' @' + acct).length <= 500) {
            // fits in
            comments[comments.length - 1] += ' @' + acct
        } else {
            // start filling in a new comment
            comments[comments.length] =
                config.comment_for_subscribers_prompt + ' @' + acct
        }
    })
    return comments
}

const publishComments = (bot, original_toot_id) => {
    constructComments(subscribers).forEach(cmt => {
        bot.post('statuses', {
            in_reply_to_id: original_toot_id,
            visibility: 'direct',
            status: cmt
        })
    })
}

module.exports = publishComments
