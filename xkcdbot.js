/*
    The main script for xkcdbot.
    the authentic xkcdbot is running as @xkcdbot@botsin.space.
*/

const xkcd = require('xkcd')
const fs = require('fs-extra')
const dl = require('download')
const errorLog = require('./utils').errorLog
const limitChars = require('./utils').limitChars
const log = require('./utils').logIfDebug

const config = fs.readJSONSync('config.json')
const DEBUG = config.debug

const Mastodon = require('mastodon')
const bot = new Mastodon({
    access_token: config.api.access_token,
    api_url: config.api.api_url
})

const toot = require('./toot')
const checkForNotifications = require('./notifications')
const notificationDaemon = () => {
    checkForNotifications(bot)
}

let latest_num = 0

const update = info => {
    latest_num = info.num
    fs.writeJSONSync('latest.json', info)
}

// run at an interval
const pollXKCD = () => {
    log('polling xkcd')
    // fetch xkcd.com/info.0.json
    xkcd(info => {
        log('fetched xkcd as json')
        /*  
            `info` format:
                num: int, title: str, alt: str, img: str(url),
                (link: str, news: str) - occasionally provided
        */
        if (info.num > latest_num) {
            log('xkcd update')
            // new xkcd posted; fetch image
            // https://imgs.xkcd.com/comics/filename
            //  [0] [1]     [2]       [3]     [4]
            dl(info.img, './img/')
                .then(() => {
                    log('downloaded img')
                    // toot, as defined in ./toot.js
                    toot(
                        bot,
                        `./img/${info.img.split('/')[4]}`,
                        info.num,
                        info.title,
                        limitChars(info.alt, config.alt_text_char_limit),
                        {
                            debug: DEBUG,
                            maintainer: config.personnel.maintainer
                        }
                    )
                })
                .catch(err =>
                    errorLog(err, `image download from xkcd; URL: ${info.img}`)
                )

            // update latest.json
            update(info)
        }
    })
}

// force publish; toot latest comic whatsoever.
// useful for debugging.
if (config.debug_options.test_xkcd) pollXKCD()

if (config.debug_options.test_notifications) notificationDaemon()

if (!DEBUG) {
    // setup
    xkcd(info => update(info))
    // start daemon
    setInterval(pollXKCD, config.intervals.poll_xkcd * 60 * 1000)
    // service: check for notifications
    setInterval(
        notificationDaemon,
        config.intervals.get_notifications * 60 * 1000
    )
}
