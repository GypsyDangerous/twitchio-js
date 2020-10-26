# Documentation
## Table of Contents
- [Basic Usage](#basic-usage)
- [How to make Kraken requests](#How-to-make-Kraken-requests)
- [Authenicated Functions](#Functions-that-require-authentication)
  - [Get Moderators](#get-moderators-for-a-channel)
  - [Get Helix User Info](#get-user-info-from-helix)
  - [Get Kraken User Info](#get-user-info-from-kraken)
  - [Get custom channel badges by username](#get-custom-channel-badges-by-username)
  - [Refresh a refresh token](#refresh-a-refresh-token)
  - [Get cheermotes](#get-cheermotes)
- [Unauthenticaed Functions](#Functions-that-do-not-require-authentication)
  - [Get custom channel badges by id](#get-channel-badges-by-id)
  - [Get global badges](#get-global-badges)
  - [Get bttv emotes](#get-bttv-emotes-for-a-channel-(includes-global-bttv-emotes))
  - [Get ffz emotes](#get-ffz-emotes-for-a-channel-(includes-global-ffz-emotes))
  - [Get the channels a user moderates](#get-the-channels-a-user-moderates-for)

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

## How to make Kraken requests
Since the kraken api is deprecated, it is disabled by default in Twitchio. But since Helix doesn't have all the features of kraken yet you make need to use it. To enable kraken on Twitchio you can either set the `kraken` propery to true `TwitchApi.kraken = true` or pass true as the final argument to any kraken functions.

## Functions that require authentication

```js
const TwitchIO = require('twitchio-js');

const AuthenticatedApiHelper = new TwitchIO({
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

// force the function to use username
const userInfo = await AuthenticatedApiHelper.getUserInfo("413856795", true);
```

### get user info from kraken
see [How to make Kraken requests](#How-to-make-Kraken-requests) for more info about making kraken requests
```js
const userInfo = await AuthenticatedApiHelper.krakenGetUserById("413856795")
```

### get custom channel badges by username

```js
const channelBadges = await AuthenticatedApiHelper.getBadgesByUsername("instafluff");
```

### refresh a refresh token

#### option 1: set the client secret on the helper

```js
// make a copy of the api helper to put the client secret on, this is not necessary but recommended
const copiedAuthenticatedApiHelper = AuthenticatedApiHelper.copy;
copiedAuthenticatedApiHelper.clientSecret = process.env.client_secret;
const refreshData = await copiedAuthenticatedApiHelper.refreshToken("refresh token");
```

#### option 2: input the client secret in the function call

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
const TwitchIO = require('twitchio-js');

const UnAuthenticatedApiHelper = new TwitchIO({});
```

### get channel badges by id
```js
const channelBadges = await UnAuthenticatedApiHelper.getBadgesById("413856795");
```

### get global badges
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
