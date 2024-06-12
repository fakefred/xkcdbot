/*
    Module: toot
    publishes xkcd comics as a toot
*/

const fs = require('fs-extra')
const config = fs.readJSONSync('./config.json')
const deliverComments = require('./delivery')

const getValueOrFallback = require('./utils').getValueOrFallback
const errorLog = require('./utils').errorLog
const log = require('./utils').logIfDebug

const toot = (bot, filename, num, title, alt, options = null) => {
    log('tooting')
    const debug = getValueOrFallback(options, 'debug', false)
    const maintainer = getValueOrFallback(options, 'maintainer', '')

    // upload image to mastodon as Media attachment
    bot.post('media', {
        file: fs.createReadStream(filename),
        description: 'xkcd comic (alt text in progress)',
        focus: '-1,1' // upper-left corner
    })
        .then(res => {
            log('img uploaded')
            // attach media to status and post
            // when in debug mode, DM maintainer
            bot.post('statuses', {
                spoiler_text: `${num}. ${title}`,
                status:
                    `title text: ${alt}\n\n` +
                    `(https://xkcd.com/${num})\n` +
                    `(https://www.explainxkcd.com/wiki/index.php/${num})\n` +
                    (debug ? maintainer : ''),
                media_ids: [res.data.id],
                visibility: debug ? 'direct' : 'unlisted',
                sensitive: false
            }).then(resp => {
                log('toot published')
                if (config.enable.mention_subscribers) {
                    deliverComments(bot, resp.data.id)
                }
            })
        })
        .catch(e => errorLog(e, 'upload media'))
}

module.exports = toot
