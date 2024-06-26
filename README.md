# xkcdbot

## Synopsis

This is a bot for [Mastodon](https://joinmastodon.org) which publishes the latest [xkcd](https://xkcd.com) comic when there is an update. It is also designed to listen to messages mentioning it, currently powering its "subscribe" feature.

## User Guide

-   If you would like to see xkcd comics pop up on your home timeline, simply **follow [`@xkcdbot@botsin.space`](https://botsin.space/@xkcdbot)**.
-   If you want xkcdbot to mention you at every comic update, **toot the following text: `@xkcdbot@botsin.space #subscribe`**.
-   In case you want to be _unlisted_ (a.k.a. unsubscribe), **toot the following text: `@xkcdbot@botsin.space #unsubscribe`**.

Either you subscribed or unsubscribed, you will receive a direct message from xkcdbot with the content `@<your username> successfully [un]subscribed.` within five minutes. If xkcdbot does not respond in ten minutes, try again. If _this_ also fails, the bot probably crashed, or is down. Better check its [profile page](https://botsin.space/@xkcdbot) to see its status. If it says "UP" but experimentally isn't, please contact me.

## Hosting Guide

`NYI = Not Yet Implemented`

### Node.js

xkcdbot is powered by Node.js. The Node.js toolchain is required.

### Access Token

You will need to obtain an access_token from your mastodon instance. It's in the `Development` pane under `Preferences`. You will need to grant the bot these permissions:

-   read:notifications
-   read:statuses
-   write:media (upload xkcd image)
-   write:notifications (dismiss subscription notification)
-   write:statuses

### config.json

Because it contains credentials, the `config.json` I am using is not uploaded, and is listed in `.gitignore`. To use this bot, you need to rename the shipped `config_default.json` to `config.json`. Then, fill out `config.json`. Here is the shipped file:

```json
{
    "api": {
        "api_url": "",
        "access_token": ""
    },
    "personnel": {
        "maintainer": "",
        "operators": []
    },
    "intervals": {
        "poll_xkcd": 5,
        "get_notifications": 5
    },
    "enable": {
        "record_subscription": true,
        "mention_subscribers": true
    },
    "debug": false,
    "debug_options": {
        "test_xkcd": false,
        "test_notifications": false
    },
    "subscribers_file": "./subscribers.json",
    "alt_text_char_limit": 400,
    "comment_for_subscribers_prompt": "A heads-up for my subscribers:",
    "notification_per_page": 50,
}
```

-   **api_url**: the API's base URL, e.g. `https://botsin.space/api/v1/`.
-   **access_token**: the access token you obtained.
-   **maintainer**: when in debug mode, xkcdbot publishes xkcd comics as direct messages. The maintainer is addressed in such message.
-   **operators**: [NYI] list of operators, i.e. users with admin access to this bot.
-   **poll_xkcd**: interval between two xkcd fetches, in minutes.
-   **get_notifications**: interval between two notification GET reqs. As for now only used to check subscription. Expect huge changes.
-   **record_subscription**: [NYI] self-explanatory.
-   **mention_subscribers**: [NYI] toggle mention-subscribers service.
-   **debug**: boolean indicating whether to run in debug mode.
-   **test_xkcd**: when set to `true`, xkcdbot fetches xkcd once, and publishes it regardless of whether there is an update.
-   **test_notifications**: when set to `true`, xkcdbot gets notifications once and executes actions (subscribe etc.)

Debug mode:

1. See description for `maintainer` above
2. Prints more verbose logs

-   **subscribers_file**: the file to record subscribers.
-   **alt_text_char_limit**: some xkcd's, such as [1363: xkcd Phone](https://xkcd.com/1363), have tediously long alt-text. However, a toot has to fit in (usually) a maximum of 500 chars, and for the image description (used to replicate the "hover text" effect), 420. This cuts the alt-text into the size limit. Recommended value: 300 - 410.
-   **comment_for_subscribers_prompt**: the text starting all comments addressing subscribers, so that they don't get confused.
-   **notification_per_page**: value of the `limit` param sent to `GET /notifications`.

### subscribers.json

The subscribers file is shipped as `subscribers_default.json`. Rename it to `subscribers.json` before it can work.

### The Run And Go

After that, you can start this bot with `node xkcdbot.js` or `npm run test` or use your process manager for production.
