/* global describe, it */

const TwitchLib = require("../dist/index.js");
require("dotenv").config()

const clientId = process.env.ClientId;
const authorizationKey = process.env.authorizationKey;
if (!clientId || !authorizationKey) {
	throw new Error("Missing client id or authorization key");
}

const testApi = new TwitchLib({
    clientId,
    authorizationKey
});


test("should have the right client id", () => {
	expect(testApi.clientId).toBe(clientId);
});

test("should have the right client id", () => {
	expect(testApi.authorizationKey).toBe(authorizationKey);
});
// it("shouldn't be able to get moderators with given token", async function () {
// 	const result = await testApi.getUserInfo("514845764");
// 	expect(result).toBeDefined();
// });
// it("should get moderators properly", async function () {
// 	const result = await testApi.getUserModerationChannels("dav1dsnyder404");
// 	expect(result).toBeDefined();
// });
// it("should get mod channels properly", async function () {
// 	const result = await testApi.fetchModChannels("alca");
// 	expect(result).toBeDefined();
// 	// expect(result.length).equals(116)
// });
