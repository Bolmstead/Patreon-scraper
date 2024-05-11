require("dotenv").config();

var player = require("play-sound")((opts = {}));
const olms2074MGClient = require("../MailGunClients/olms2074MGClient")
const boMGClient = require("../MailGunClients/boMGClient")


const arraysContainSameItems = require("./arraysContainSameItems");
const sendEmail = require("./sendEmail");

// ----- config ------
const testing = false
const sendEmailsToFriendsAndFamily = false
const playSound = true;
const titlesToCreateAnAlertFor = ["alert", "Alert", "Pick", "pick", "PICK", "ALERT"]
const millisecondsBeforeEmailingOthers = 10 * 1000;
const myEmail = ["berkleyo@icloud.com"];
const friendsAndFamilyEmails = [
  "tjob25@gmail.com",
  "jerid.w.hammer@gmail.com", 
  "alexsalazar6@gmail.com", 
  "connorbullard8@icloud.com",
  "katie.austin29@gmail.com"
];
const investAnswersEmails = ["johndo987987@gmail.com"];
const cryptoGainsEmails = ["johndo987987@gmail.com"];
const serverType = process.env.SERVER_TYPE

console.log("**** CONFIG ****")
console.log("Server Type: ", serverType)
console.log("testing: ", testing)
console.log("playSound: ", playSound)


// -------------------

module.exports = async function scraper(
  page,
  scraperType = "IA",
  currentPostTitles = []
) {
  try {
    await page.reload();
    console.log("🏁🏁🏁🏁🏁🏁");
    await page.waitForSelector('[data-tag="post-title"]', { visible: true });

    const titles = await page.$$('[data-tag="post-title"]');
    console.log("🚀 ~ titles:", titles)
    const newPostTitles = [];

    for (const title of titles) {
      const innerTextTitle = await page.evaluate((el) => el.innerText, title);
      console.log("🚀 ~ innerTextTitle:", innerTextTitle)
      newPostTitles.push(innerTextTitle);
    }

    if (currentPostTitles.length < 1) {
      console.log("FIRST RUNNN");
      currentPostTitles = newPostTitles.slice();
    }
    let postsAreTheSame = arraysContainSameItems(
      currentPostTitles,
      newPostTitles
    );

    console.log("🐛 currentPostTitles:", currentPostTitles);
    console.log("🦋 newPostTitles:", newPostTitles);
    console.log("🧐 postsAreTheSame:", postsAreTheSame);

    if (newPostTitles.length < 1 || currentPostTitles.length < 1) {
      postsAreTheSame = true;
    }

    console.log("Latest Post: ", newPostTitles[0]);

    if (!postsAreTheSame || testing) {
      console.log("🎉🎉🎉 NEW POST BABY!!!! 🎉🎉🎉");
      console.log("💰💰💰 MAKE THAT DOUGH 💰💰💰");

      let title = ""

      for (let word of titlesToCreateAnAlertFor) {
        if (newPostTitles[0].includes(word) || testing) {
          title = "TRADE ALERT! - "
          if (playSound) {
            player.play("Siren.mp3", function (err) {
              if (err) throw err;
            });
          }
        } else {
          if (playSound) {
            player.play("Success.mp3", function (err) {
              if (err) throw err;
            });
          }
        }
      }

      const myEmailSubject = scraperType === "IA" ? "New IA Post!" : "New CG Post!"

      // My Email
      sendEmail(olms2074MGClient, `${title}${myEmailSubject}`, myEmail, process.env.OLMS2074_MAILGUN_EMAIL);

      // Friends and Family Emails
      if (
        friendsAndFamilyEmails.length > 0 &&
        scraperType === "IA" && !testing && sendEmailsToFriendsAndFamily
      ) {
        for (let word of titlesToCreateAnAlertFor) {
          if (newPostTitles[0].includes(word)) {
            sendEmail(
              olms2074MGClient,
              "Berkley's Investment Group Posted!",
              friendsAndFamilyEmails, process.env.OLMS2074_MAILGUN_EMAIL
            );
          }
        }
      }
      
      // InvestAnswers Emails
      if (investAnswersEmails.length > 0 && scraperType === "IA") {
        setTimeout(async () => {
          sendEmail(olms2074MGClient, `${title}InvestAnswers Posted!`, investAnswersEmails, process.env.OLMS2074_MAILGUN_EMAIL);
        }, millisecondsBeforeEmailingOthers);
      }

      // Crypto Gains Emails
      if (cryptoGainsEmails.length > 0 && scraperType === "CG" && !testing) {
         sendEmail(olms2074MGClient, `${title}Crypto Gains Posted!`, cryptoGainsEmails, process.env.OLMS2074_MAILGUN_EMAIL);
      }

      setTimeout(async () => {
          await scraper(page, scraperType, newPostTitles);
      }, "60000"); // 60000 = 1 min
    } else {
      console.log("👌 He has not posted 👌");

      setTimeout(async () => {
        await scraper(page, scraperType, currentPostTitles);
      }, "500");
    }
  } catch (error) {
    console.log(error);
    setTimeout(async () => {
      await scraper(page, scraperType, currentPostTitles);
    }, "1000");
  }
};
