# twitch-helper
![downloads](https://img.shields.io/npm/dw/twitch-helper) ![npm](https://badge.fury.io/js/twitch-helper.png) ![size](https://img.shields.io/bundlephobia/min/twitch-helper) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![GitHub Stars](https://img.shields.io/github/stars/disstreamchat/twitch-helper.svg)](https://github.com/IgorAntun/node-chat/stargazers)

This library provides function that make it easy to do things related to the twitch api including but not limited to the helix api, the kraken api, the bttv api, and the ffz api.
at its most basic this library wraps twitch api credentials with the fetch function so you don't have to pass them in everytime, but it also has functions that get data from different api endpoints for you with basic inputs.

---
## Support

This project is a part of DisStreamChat. Whether you use this project, another DisStreamChat project, have learned something from it, or just like it, please consider supporting it by becoming a patreon, so we can dedicate more time on more projects like this 😀.

<a href="https://www.patreon.com/disstreamchat?fan_landing=true" target="_blank"><img src="https://cdn.discordapp.com/attachments/727356806552092675/754198973027319868/Digital-Patreon-Wordmark_FieryCoral.png" alt="Patreon" width=200 style="max-width: 100px !important;" ></a>

# Documentation

## basic usage

```js

import TwitchHelper from "twich-helper";

const ApiHelper = new TwitchHelper({
    clientId: process.env.client_id
    authorizationKey: process.env.authorization_key
})

const cheerMotes = await ApiHelper.getCheerMotes()
const userInfo = await ApiHelper.getUserInfo("codinggarden")
// do something with the cheermotes and user info

```

## Functions that require authentication

```js
import TwitchHelper from "twich-helper";

const AuthenticatedApiHelper = new TwitchHelper({
    clientId: process.env.client_id
    authorizationKey: process.env.authorization_key
})
```

### get moderators for a channel

```js
const moderators = await AuthenticatedApiHelper.getUserModerators("alca")
```

### get user info from helix

```js
// get user info by username
const userInfo = await AuthenticatedApiHelper.getUserInfo("codinggarden");

// get user info by id
const userInfo = await AuthenticatedApiHelper.getUserInfo("413856795");
```

### get user info from kraken

**coming soon**

### get custom channel badges by username

```js
const channelBadges = await AuthenticatedApiHelper.getBadgesByUsername("instafluff");
```

### refresh a refresh token

1. #### set the client secret on the helper

```js
const copiedAuthenticatedApiHelper = AuthenticatedApiHelper.copy;
copiedAuthenticatedApiHelper.clientSecret = process.env.client_secret;
const refreshData = await copiedAuthenticatedApiHelper.refreshToken("refresh token");
```

2. #### input the client secret in the function call

```js
const refreshData = await copiedAuthenticatedApiHelper.refreshToken("refresh token", process.env.client_secret);
```

### get cheermotes

```js
// get global cheermotes
const cheermotes = await copiedAuthenticatedApiHelper.getCheerMotes();

// get global cheermotes along with custom channel cheermotes
const customCheermotes = await copiedAuthenticatedApiHelper.getCheerMotes("413856795");
```

## Functions that do not require authentication

```js
import TwitchHelper from "twich-helper";

const UnAuthenticatedApiHelper = new TwitchHelper({});
```
### get channel badges by id
```js
const channelBadges = await UnAuthenticatedApiHelper.getBadgesById("413856795");
```

### get global message badges
```js
const globalBadges = await UnAuthenticatedApiHelper.getGlobalBadges()
```

### get bttv emotes for a channel (includes global bttv emotes)
```js
const {bttvEmotes, bttvRegex} = await UnAuthenticatedApiHelper.getBttvEmotes("codinggarden")
```

### get ffz emotes for a channel (includes global ffz emotes)
```js
const { ffzEmotes, ffzRegex } = await UnAuthenticatedApiHelper.getFfzEmotes("codinggarden")
```

### get the channels a user moderates for
```js
const channelsIModerate = await UnAuthenticatedApiHelper.getUserModerationChannels("dav1dsnyder404")
```

# Contributing

Found a bug? Want a new feature? Don't like the docs? Please create a pull request or raise an issue.

## Raising issues

When raising an issue, please add as much details as possible. Screenshots, video recordings, or anything else that can make it easier to reproduce the bug you are reporting.

-   A new option is to create a code pen with the code that causes the bug. Fork this [example](https://www.webpackbin.com/bins/-Kxr6IEf5zXSQvGCgKBR) and add your code there, then fork and add the new link to the issue.


# Installation

1. clone the repo with `git clone https://github.com/DisStreamChat/twitch-helper.git`
2. cd into the repo with cd twitch-helper
3. install dependencies with `npm i`
4. create a `.env` file and add in the variables from the `.env.sample` file
5. run `npm run build-tests` in order to transpile the typescript and run tests

-   run `npm build` to transpile the typescript
-   run `npm start` to execute the transpiled typescript
-   run `npm test` to run tests on the transpiled typescript
