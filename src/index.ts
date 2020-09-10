import fetch from "node-fetch";

interface TwitchApiOptions {
	clientId?: string;
    authorizationKey?: string;
    clientSecret?: string
	kraken?: boolean;
}

interface FetchOptions {
	method?: string;
	headers?: object;
	body?: string;
}

class TwitchApi {
	private clientId?: string;
    private authorizationKey?: string;
    private clientSecret?: string
	private kraken: boolean;
	constructor(private options: TwitchApiOptions) {
        if(!options){
            throw new Error("missing options")
        }
		this.clientId = options.clientId;
        this.authorizationKey = options.authorizationKey;
        this.clientSecret = options.clientSecret
		this.kraken = !!options.kraken;
	}

	get isUnAuthenticated() {
		return this.clientId == undefined || this.authorizationKey == undefined;
	}

	async fetch(url: string, fetchOptions?: FetchOptions) {
		if (!fetchOptions) fetchOptions = {};
		const { method, body, headers } = fetchOptions;
		const options =
			method == "POST"
				? {
						method: method || "GET",
						headers: {
							"Client-ID": this.clientId || "",
							Authorization: `Bearer ${this.authorizationKey}`,
							...(headers || {}),
						},
						body: body || "",
				  }
				: {
						method: method || "GET",
						headers: {
							"Client-ID": this.clientId || "",
							Authorization: `Bearer ${this.authorizationKey}`,
							...(headers || {}),
						},
                  };
        try{

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const json = await response.json();
            return json;
        }catch(err){
            // TODO add a better handler
            throw err
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

	async getUserInfo(username: string) {
		if (this.isUnAuthenticated) {
			throw new Error("Missing either your clientId or Authorization Key");
		}
		let key = "login";
		if (username.replace(/\d/g, "") === "") key = "id";
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
        if(!this.clientId || (!this.clientSecret && !clientSecret)){
            throw new Error("Missing client id or client secret required to refresh a refresh token")
        }
        const apiURL = `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret || clientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}`;
        return await this.fetch(apiURL, { method: "POST" });
    }

}

module.exports = TwitchApi;
