/*
    The main script for xkcdbot.
    the authentic xkcdbot is running as @xkcdbot@botsin.space.
*/

const xkcd = require('xkcd')
const fs = require('fs-extra')
const dl = require('download')
const errorLog = require('./utils').errorLog
const limitChars = require('./utils').limitChars

const config = fs.readJSONSync('config.json')
const DEBUG = config.debug

const Mastodon = require('mastodon')
const bot = new Mastodon({
    access_token: config.access_token,
    api_url: config.api_url
})

const toot = require('./toot')
const checkForSubscription = require('./subscription')
const subscriptionDaemon = () => {
    checkForSubscription(bot)
}

let latest_num = 0

const update = info => {
    latest_num = info.num
    fs.writeJSONSync('latest.json', info)
}

// run at an interval
const poll_json = () => {
    // fetch xkcd.com/info.0.json
    xkcd(info => {
        /*  
            `info` format:
                num: int, title: str, alt: str, img: str(url),
                (link: str, news: str) - occasionally provided
        */
        if (info.num > latest_num) {
            // new xkcd posted; fetch image
            // https://imgs.xkcd.com/comics/filename
            //  [0] [1]     [2]       [3]     [4]
            dl(info.img, './img/')
                .then(() => {
                    // toot, as defined in ./toot.js
                    toot(
                        bot,
                        `./img/${info.img.split('/')[4]}`,
                        info.num,
                        info.title,
                        limitChars(info.alt, config.alt_text_char_limit),
                        { debug: DEBUG, maintainer: config.maintainer }
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

// force publish: toot latest comic whatsoever.
// useful for debugging.
if (config.run_once_and_force_publish) {
    poll_json()
} else {
    // setup
    xkcd(info => update(info))
    // start daemon
    setInterval(poll_json, config.poll_interval_in_minutes * 60 * 1000)
    // service: check for new/no-longer subscribers
    setInterval(
        subscriptionDaemon,
        config.check_subscription_interval_in_minutes * 60 * 1000
    )
}
