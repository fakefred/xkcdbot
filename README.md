# xkcdbot

## Synopsis
This is a bot for [Mastodon](https://joinmastodon.org) which publishes the latest [xkcd](https://xkcd.com) comic when there is an update. It is also designed to listen to messages mentioning it, currently powering its "subscribe" feature.

## User Guide
- If you would like to see xkcd comics pop up on your home timeline, simply **follow [`@xkcdbot@botsin.space`](https://botsin.space/@xkcdbot)**.
- If you want xkcdbot to mention you at every comic update, **toot the following text: `@xkcdbot@botsin.space #subscribe`**.
- In case you want to be *unlisted* (a.k.a. unsubscribe), **toot the following text: `@xkcdbot@botsin.space #unsubscribe`**.

The "subscription" feature works like this:  
![Screenshot describing how this works](https://blog.fkfd.me/posts/5/screenshot.png)

Either you subscribed or unsubscribed, you will receive a direct message from xkcdbot with the content `@<your username> successfully [un]subscribed.` within five minutes. If xkcdbot does not respond in ten minutes, try again. If *this* also fails, the bot probably crashed, or is down. Better check its [profile page](https://botsin.space/@xkcdbot) to see its status. If it says "UP" but experimentally isn't, please contact its maintainer (see profile page.)

## Hosting Guide
> NYI = Not Yet Implemented

xkcdbot is powered by Node.js. The node.js toolchain is required.

You will need to obtain an access_token from your mastodon instance. It's in the `Development` pane under `Preferences`. You will need to grant the bot these permissions:

- read:notifications
- read:statuses
- write:media (upload xkcd image)
- write:notifications (dismiss subscription notification)
- write:statuses

Because it contains credentials, the `config.json` I am using is not uploaded, and is listed in `.gitignore`. To use this bot, you need to rename the shipped `config_default.json` to `config.json`. Then, fill out `config.json`. Here is the shipped file:

```json
{
    "api_url": "",
    "access_token": "",
    "maintainer": "",
    "operators": [],
    "debug": false,
    "run_once_and_force_publish": false,
    "poll_interval_in_minutes": 5,
    "subscribers_file": "./subscribers.json",
    "check_subscription_interval_in_minutes": 5,
    "alt_text_char_limit": 400,
    "comment_for_subscribers_prompt": "A heads-up for my subscribers:",
    "enable_subscription": true,
    "enable_mention_subscribers": true
}
```

- **api_url**: the API's base URL. Usually `<instance>/api/v1/`.
- **access_token**: the access token you obtained.
- **maintainer**: when in debug mode, xkcdbot publishes xkcd comics as direct messages. The maintainer is addressed in such message.
- **operators**: [NYI] list of operators, i.e. users with admin access to this bot. In current plans, this could include force shutdown with a :hammer: emoji, print logs and uptime inquiry.
- **debug**: boolean indicating whether to run in debug mode.

Debug mode:
1. [see `maintainer`]
2. [NYI] Prints more verbose logs

- **run\_once\_and\_force\_publish**: when set to `true`, xkcdbot fetches xkcd once, and publishes it regardless of whether there is an update. Useful for toot testing.
- **poll\_interval\_in\_minutes**: interval between two xkcd fetches.
- **subscribers_file**: the file to record subscribers.
- **check\_subscription\_interval\_in\_minutes**: interval between two notification GET reqs. As for now only used to check subscription. Expect huge changes.
- **alt\_text\_char\_limit**: some xkcd's, such as [1363: xkcd Phone](https://xkcd.com/1363), have tediously long alt-text. However, a toot has to fit in (usually) a maximum of 500 chars, and for the image description (used to replicate the "hover text" effect), 420. This cuts the alt-text into the size limit. Recommended value: 300 - 410.
- **comment\_for\_subscribers\_prompt**: the text starting all comments addressing subscribers, so that they don't get confused.
- **enable_subscription**: [NYI] self-explanatory.
- **enable\_mention\_subscribers**: [NYI] toggle mention-subscribers service.

After that, you can start this bot with `node xkcdbot.js` or `npm run test` or use your process manager for production.

