/* global describe, it */

const TwitchApi = require("../dist/index.js");
require("dotenv").config()

const clientId = process.env.ClientId;
const authorizationKey = process.env.authorizationKey;
if (!clientId || !authorizationKey) {
	throw new Error("Missing client id or authorization key");
}

const testApi = new TwitchApi({
    clientId,
    authorizationKey,
});


test("should have the right client id", () => {
	expect(testApi.clientId).toBe(clientId);
});

test("should have the right authorization key", () => {
	expect(testApi.authorizationKey).toBe(authorizationKey);
});

test("should not be kraken", () => {
	expect(testApi.kraken).toBe(false);
});

test("should be authenticated", () => {
	expect(testApi.isUnAuthenticated).toBe(false);
});

test("should be unauthorized if missing one or more credentials", () => {
    expect(new TwitchApi({}).isUnAuthenticated).toBe(true)
})

test("should be able to get moderators with given token", async function () {
	const result = await testApi.getUserInfo("514845764");
	expect(result).toBeDefined();
});

test("should get mod channels succesfully", async function () {
	const result = await testApi.getUserModerationChannels("codinggarden");
	expect(result).toBeDefined();
});

test("should get full list mod channels properly", async function () {
	const result = await testApi.fetchModChannels("alca");
	expect(result).toBeDefined();
	expect(result.length).toBeGreaterThan(99)
});


test("should throw an error refreshing a token without a secret", async () => {
    try{
        await testApi.refreshToken("token")
    }catch(err){
        expect(err.message).toBe("Missing client id or client secret required to refresh a refresh token")
    }
})

test("should succed at getting cheermotes", async () => {
    const cheermotes = await testApi.getCheerMotes()
    expect(cheermotes).toBeDefined()
})

test("should get custom cheermotes", async () => {
    const cheermotes = await testApi.getCheerMotes()
    const customCheermotes = await testApi.getCheerMotes("413856795")
    expect(customCheermotes.length).toBeGreaterThan(cheermotes.length)
})

test("unauthenticated api should error getting user info", async () => {
	try{
		const result = await new TwitchApi({}).getUserInfo("514845764");

	}catch(err){
		expect(err.message).toBe("Missing either your clientId or Authorization Key")
	}
})

test("can fetch from a kraken endpoint", async () => {
    const copy = testApi.copy
    copy.kraken = true
    const result = await copy.fetch("https://api.twitch.tv/kraken/channels/413856795")
    expect(result).toBeDefined()
})