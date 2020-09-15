# Documentation
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
const TwitchIO = require('twitchio-js');

const UnAuthenticatedApiHelper = new TwitchIO({});
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
