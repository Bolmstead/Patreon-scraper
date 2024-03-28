require("dotenv").config();
const { twitterClient } = require("../twitterClient");

module.exports = async function sendTweet(text) {
  console.log("text: ", text);

  console.log("inside sendTweet");
  try {
    await twitterClient.v2.tweet("Hello world!");
  } catch (e) {
    console.log(e);
  }
};
