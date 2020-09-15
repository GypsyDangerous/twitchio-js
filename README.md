<p align="center"><a href="https://github.com/nastyox/Rando.js#nastyox"><img src="https://cdn.discordapp.com/attachments/727356806552092675/755515540663173231/logo.svg" alt="logo" height=100/></a></p>
<h1 align="center">Twitchio.js</h1>
<p align="center">The easiest way to interact with twitch apis.</p>

<p align="center">
	<a href="https://github.com/GypsyDangerous/twitch-helper"><img src="https://img.shields.io/npm/v/twitchio-js?style=for-the-badge"/></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge"/></a>
    <img src="https://img.shields.io/bundlephobia/min/twitchio-js@1.0.1?style=for-the-badge"/>
    <a href="https://github.com/gypsydangerous/twitchio-js/stargazers"><img src="https://img.shields.io/github/stars/gypsydangerous/twitchio-js.svg?style=for-the-badge"/></a>
	<img src="https://img.shields.io/npm/dw/twitchio-js?style=for-the-badge"/>
</p>
<br></br>
<br></br>

This library provides function that make it easy to do things related to the twitch api including but not limited to the helix api, the kraken api, the bttv api, and the ffz api.
at its most basic this library wraps twitch api credentials with the fetch function so you don't have to pass them in everytime, but it also has functions that get data from different api endpoints for you with basic inputs.

## :zap:  Fast implementation  
   ### step 1: Paste the following script tag into the head of your HTML document:<br/>
```JavaScript
//Install:
npm i twitchio-js

//Then, paste this at the top of your JavaScript file:
const TwitchIO = require('twitchio-js');
```
   ### step 2: Use any of the commands explained the [Documentation](/Documentation.md) to interact with twitch however you like.

## basic usage

```js

const TwitchIO = require('twitchio-js');

const TwitchApi = new TwitchIO({
    clientId: process.env.client_id,
    authorizationKey: process.env.authorization_key
})

const cheerMotes = await TwitchApi.getCheerMotes()
const userInfo = await TwitchApi.getUserInfo("codinggarden")
// do something with the cheermotes and user info

```

## Functions that require authentication

```js
import TwitchHelper from "twich-helper";

const AuthenticatedApiHelper = new TwitchHelper({
    clientId: process.env.client_id,
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
const refreshData = await AuthenticatedApiHelper.refreshToken("refresh token", process.env.client_secret);
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

## For the Future 
If you want to **contribute** and make this much better for developers, pleae have a look at [Contributing Manual](./CONTRIBUTING.md) to understand the contribution steps properly.

If you can help us with these. Please don't hesitate to open a [pull request](https://github.com/gypsydangerous/twitchio-js/pulls).

- Add More functions
- Improve the documentation

If you created something awesome and want to contribute then feel free to open Please don't hesitate to open an [pull request](https://github.com/gypsydangerous/twitchio-js/pulls).
