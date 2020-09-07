import fetch  from "node-fetch"

interface TwitchApiOptions{
    clientId: string,
    authorizationToken: string
    kraken: boolean | null | undefined
}

interface FetchOptions{
    method?: string,
    headers?: object ,
    body?: string
}
class TwitchApi {
    clientId : string
    authorizationKey: string
	constructor(private options: TwitchApiOptions) {
		this.clientId = options.clientId;
		this.authorizationKey = options.authorizationToken;
	}

	get isUnAuthenticated() {
		return this.clientId == undefined || this.authorizationKey == undefined;
	}

	async fetch(url : string, fetchOptions: FetchOptions) {
        const {method, body, headers} = fetchOptions
		const options =
			method == "POST"
				? {
						method: method || "GET",
						headers: {
							"Client-ID": this.clientId,
							Authorization: `Bearer ${this.authorizationKey}`,
							...(headers || {}),
						},
						body: body || "",
				  }
				: {
						method: method || "GET",
						headers: {
							"Client-ID": this.clientId,
							Authorization: `Bearer ${this.authorizationKey}`,
							...(headers || {}),
						},
				  };
		const response = await fetch(url, options);
		const json = await response.json();
		if (!response.ok) {
			throw new Error(json.message);
		}
		return json;
	}

	async fetchModChannels(username) {
		let modApiUrl = `https://modlookup.3v.fi/api/user-v3/${username}`;
		let channels = [];
		let response = await this.fetch(modApiUrl);
		channels = [...channels, ...response.channels];
		while (response.cursor) {
			modApiUrl = `https://modlookup.3v.fi/api/user-v3/${username}?cursor=${response.cursor}`;
			response = await this.fetch(modApiUrl);
			channels = [...channels, ...response.channels];
		}
		return channels;
	}

	async getUserModerationChannels(username, convert = true) {
		const channels = await this.fetchModChannels(username);
		if (this.isUnAuthenticated || !convert) {
			return channels;
		} else {
			const ModChannels = await Promise.all(channels.map(async channel => this.getUserInfo(channel.name)));
			return ModChannels;
		}
	}

	async getUserModerators(username) {
		const userInfo = await this.getUserInfo(username);
		const userId = userInfo.id;
		const apiURL = `https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${userId}`;
		const response = await this.fetch(apiURL);
		return response.data[0];
	}

	async getUserInfo(username) {
		if (this.isUnAuthenticated) {
			throw new Error("Missing either your clientId or Authorization Key");
		}
		let key = "login";
		if (username.replace(/\d/g, "") === "") key = "id";
		const apiURL = `https://api.twitch.tv/helix/users?${key}=${username}`;
		const response = await this.fetch(apiURL);
		return response.data[0];
	}

	async getBadgesByUsername(username) {
		const userInfo = await this.getUserInfo(username);
		const userId = userInfo.id;
		return this.getBadgesById(userId);
	}

	async getBadgesById(userId) {
		const customBadgeURL = `https://badges.twitch.tv/v1/badges/channels/${userId}/display`;
		const response = await this.fetch(customBadgeURL);
		return response.badge_sets;
	}

	async getGlobalBadges() {
		const globalBadgeResponse = await this.fetch("https://badges.twitch.tv/v1/badges/global/display");
		return globalBadgeResponse.badge_sets;
	}
}

module.exports = TwitchApi;
