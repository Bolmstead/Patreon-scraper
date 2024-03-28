const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
console.log("🚀 ~ sendTweet ~ client:", client);

const twitterClient = client.readWrite;

module.exports = { twitterClient };
