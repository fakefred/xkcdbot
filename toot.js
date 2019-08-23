/*
    Module: toot
    publishes xkcd comics as a toot
*/

const fs = require('fs-extra')
const config = fs.readJSONSync('./config.json')
const deliverComments = require('./delivery')

const getValueOrFallback = require('./utils').getValueOrFallback
const errorLog = require('./utils').errorLog

const toot = (bot, filename, num, title, alt, options = null) => {
    const debug = getValueOrFallback(options, 'debug', false)
    const maintainer = getValueOrFallback(options, 'maintainer', '')

    // upload image to mastodon as Media attachment
    bot.post('media', {
        file: fs.createReadStream(filename),
        description: alt,
        focus: '-1,1' // upper-left corner
    })
        .then(res => {
            // attach media to status and post
            // when in debug mode, DM maintainer
            bot.post('statuses', {
                spoiler_text: `${num}. ${title}`,
                status:
                    `alt text: ${alt}\n\n` +
                    `(https://xkcd.com/${num})\n` +
                    (debug ? maintainer : ''),
                media_ids: [res.data.id],
                visibility: debug ? 'direct' : 'public',
                sensitive: false
            }).then(resp => {
                if (config.enable_mention_subscribers) {
                    deliverComments(bot, resp.data.id)
                }
            })
        })
        .catch(e => errorLog(e, 'upload media'))
}

module.exports = toot
