import fetch from "simple-better-fetch";

interface TwitchApiOptions {
	clientId?: string;
	authorizationKey?: string;
	clientSecret?: string;
	kraken?: boolean;
}

interface FetchOptions {
	method?: string;
	headers?: object;
	body?: string;
	kraken?: boolean;
}

interface BTTVEmote {
	code: string;
	id: string;
}

interface FFZEmote {
	name: string;
	urls: object;
}

class TwitchApi {
	private _clientId?: string;
	private _authorizationKey?: string;
	private _clientSecret?: string;
	private _kraken: boolean;

	constructor(options: TwitchApiOptions) {
		if (!options) {
			throw new Error("missing options");
		}
		this._clientId = options.clientId;
		this._authorizationKey = options.authorizationKey;
		this._clientSecret = options.clientSecret;
		this._kraken = !!options.kraken;
	}

	get clientId() : string | undefined {
		return this._clientId;
	}
	get authorizationKey() : string | undefined {
		return this._authorizationKey;
	}
	get clientSecret() : string | undefined {
		return this._clientId;
	}
	get kraken() : boolean{
		return this._kraken;
	}
	set kraken(kraken:boolean) {
		this._kraken = kraken
	}

	get isUnAuthenticated() {
		return this._clientId == undefined || this._authorizationKey == undefined;
	}

	get copy() {
		return new TwitchApi({
			clientId: this._clientId,
			authorizationKey: this._authorizationKey,
			clientSecret: this._clientSecret,
			kraken: this._kraken,
		});
	}

	async fetch(url: string, fetchOptions?: FetchOptions) {
		if (!fetchOptions) fetchOptions = {};
		const { method, body, headers, kraken } = fetchOptions;
		const isKrakenGet = this._kraken || kraken;
		const options =
			method === "POST"
				? {
						method: method || "GET",
						headers: {
							"Client-ID": this._clientId || "",
							Authorization: `${isKrakenGet ? "OAuth" : "Bearer"} ${this._authorizationKey}`,
							...(headers || {}),
							...(isKrakenGet ? { Accept: "application/vnd.twitchtv.v5+json" } : {}),
						},
						body: body || "",
				  }
				: {
						method: method || "GET",
						headers: {
							"Client-ID": this._clientId || "",
							Authorization: `${isKrakenGet ? "OAuth" : "Bearer"} ${this._authorizationKey}`,
							...(headers || {}),
							...(isKrakenGet ? { Accept: "application/vnd.twitchtv.v5+json" } : {}),
						},
				  };
		try {
			const json = await fetch(url, options);
			return json;
		} catch (err) {
			// TODO add a better handler
			throw err;
		}
	}

	async fetchModChannels(username: string) {
		let modApiUrl = `https://modlookup.3v.fi/api/user-v3/${username}`;
		let response = await this.fetch(modApiUrl);
		let channels = response.channels;
		try {
			while (response.cursor) {
				modApiUrl = `https://modlookup.3v.fi/api/user-v3/${username}?cursor=${response.cursor}`;
				response = await this.fetch(modApiUrl);
				channels = [...channels, ...response.channels];
			}
		} catch (err) {}
		return channels;
	}

	async getUserModerationChannels(username: string, convert?: boolean) {
		const channels = await this.fetchModChannels(username);
		if (this.isUnAuthenticated || !convert) {
			return channels;
		} else {
			const ModChannels = await Promise.all(channels.map(async (channel: any) => this.getUserInfo(channel.name)));
			return ModChannels;
		}
	}

	async getUserModerators(username: string) {
		const userInfo = await this.getUserInfo(username);
		const userId = userInfo.id;
		const apiURL = `https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${userId}`;
		const response = await this.fetch(apiURL);
		return response.data[0];
	}

	async getUserInfo(username: string, forceUsername?:boolean) {
		if (this.isUnAuthenticated) {
			throw new Error("Missing either your clientId or Authorization Key");
		}
		let key = "login";
		if (username.replace(/\d/g, "") === "" && !forceUsername) key = "id";
		const apiURL = `https://api.twitch.tv/helix/users?${key}=${username}`;
		const response = await this.fetch(apiURL);
		return response.data[0];
	}

	async getBadgesByUsername(username: string) {
		const userInfo = await this.getUserInfo(username);
		const userId = userInfo.id;
		return this.getBadgesById(userId);
	}

	async getBadgesById(userId: string) {
		const customBadgeURL = `https://badges.twitch.tv/v1/badges/channels/${userId}/display`;
		const response = await this.fetch(customBadgeURL);
		return response.badge_sets;
	}

	async getGlobalBadges() {
		const globalBadgeResponse = await this.fetch("https://badges.twitch.tv/v1/badges/global/display");
		return globalBadgeResponse.badge_sets;
	}

	async refreshToken(refreshToken: string, clientSecret?: string) {
		if (!this._clientId || (!this._clientSecret && !clientSecret)) {
			throw new Error("Missing client id or client secret required to refresh a refresh token");
		}
		const apiURL = `https://id.twitch.tv/oauth2/token?client_id=${this._clientId}&client_secret=${
			this._clientSecret || clientSecret
		}&grant_type=refresh_token&refresh_token=${refreshToken}`;
		return await this.fetch(apiURL, { method: "POST" });
	}

	async getBttvEmotes(channelName: string) {
		const bttvEmotes: any = {};
		let bttvRegex;
		const bttvResponse = await fetch("https://api.betterttv.net/2/emotes");
		let { emotes } = await bttvResponse.json();
		// replace with your channel url
		const bttvChannelResponse = await fetch(`https://api.betterttv.net/2/channels/${channelName}`);
		const { emotes: channelEmotes } = await bttvChannelResponse.json();
		if (channelEmotes) {
			emotes = emotes.concat(channelEmotes);
		}
		let regexStr = "";
		emotes.forEach(({ code, id }: BTTVEmote, i: number) => {
			bttvEmotes[code] = id;
			regexStr += code.replace(/\(/, "\\(").replace(/\)/, "\\)") + (i === emotes.length - 1 ? "" : "|");
		});
		bttvRegex = new RegExp(`(?<=^|\\s)(${regexStr})(?=$|\\s)`, "g");

		return { bttvEmotes, bttvRegex };
	}

	async getFfzEmotes(channelName: string) {
		const ffzEmotes: any = {};
		let ffzRegex;

		const ffzResponse = await fetch("https://api.frankerfacez.com/v1/set/global");
		// replace with your channel url
		const ffzChannelResponse = await fetch(`https://api.frankerfacez.com/v1/room/${channelName}`);
		const { sets } = await ffzResponse.json();
		const { room, sets: channelSets } = await ffzChannelResponse.json();
		let regexStr = "";
		const appendEmotes = ({ name, urls }: FFZEmote, i: number, emotes: object[]) => {
			ffzEmotes[name] = `https:${Object.values(urls).pop()}`;
			regexStr += name + (i === emotes.length - 1 ? "" : "|");
		};
		sets[3].emoticons.forEach(appendEmotes);
		if (channelSets && room) {
			const setnum = room.set;
			channelSets[setnum].emoticons.forEach(appendEmotes);
		}
		ffzRegex = new RegExp(`(?<=^|\\s)(${regexStr})(?=$|\\s)`, "g");
		return { ffzEmotes, ffzRegex };
	}

	async getCheerMotes(broadcaster_id?: string) {
		const query = broadcaster_id ? `?broadcaster_id=${broadcaster_id}` : "";
		const CheerMotes = (await this.fetch(`https://api.twitch.tv/helix/bits/cheermotes${query}`)).data;
		return CheerMotes;
	}

	// Kraken functions
	async krakenGetUserById(user_id: string, kraken?: boolean) {
		if (!kraken && !this._kraken) {
			throw new Error("Kraken must be enable to access this endpoint");
		}
		const userInfo = await this.fetch(`https://api.twitch.tv/kraken/users/${user_id}`, { kraken: kraken });
		return userInfo;
	}

	async krakenGetUserEmotes(user_id: string, kraken: boolean) {
		if (!kraken && !this._kraken) {
			throw new Error("Kraken must be enable to access this endpoint");
		}
		const emotes = await this.fetch(`https://api.twitch.tv/kraken/users/${user_id}/emotes`, { kraken: kraken });
		if (emotes) {
			return emotes.emoticon_sets;
		} else {
			return {};
		}
	}

	async krakenGetUserFollows(user_id: string, kraken: boolean, options: followsOptions) : Promise<userFollows> {
        if (!kraken && !this._kraken) {
			throw new Error("Kraken must be enable to access this endpoint");
		}
        const urlQuery = options ? `?${Object.entries(options).reduce((query, [key, val]) => `${query}&${key}=${val}`, "")}` : ""
        const apiURL = `https://api.twitch.tv/kraken/users/${user_id}/follows/channels${urlQuery}`;
        const follows = await this.fetch(apiURL, { kraken: kraken });
        return {
            total: follows["_total"],
            follows: follows.follows,
            more: (options.limit || 25) + (options.offset || 0) < follows["_total"]
        }
    }
    
    async krakenFollowChannel(following_user: string, channel_to_follow: string, kraken?: boolean){
        if (!kraken && !this._kraken) {
			throw new Error("Kraken must be enable to access this endpoint");
		}
        const apiUrl = `https://api.twitch.tv/kraken/users/${following_user}/follows/channels/${channel_to_follow}`
        await this.fetch(apiUrl, {kraken: kraken, method: "PUT"})
    }

    async krakenUnFollowChannel(following_user: string, channel_to_unfollow: string, kraken?: boolean){
        if (!kraken && !this._kraken) {
			throw new Error("Kraken must be enable to access this endpoint");
		}
        const apiUrl = `https://api.twitch.tv/kraken/users/${following_user}/follows/channels/${channel_to_unfollow}`
        await this.fetch(apiUrl, {kraken: kraken, method: "DELETE"})
    }

    async krakenGetUserBlockList(user_id: string, kraken?: boolean){
        if (!kraken && !this._kraken) {
			throw new Error("Kraken must be enable to access this endpoint");
        }
        
    }
}

interface userFollows{
    total: number,
    follows: any[],
    more: boolean
}

interface followsOptions {
	limit?: number ;
	offset?: number;
	direction?: "asc" | "desc";
	sortby?: "created_at" | "last_broadcast" | "login";
}

export = TwitchApi;
