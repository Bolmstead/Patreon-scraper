require("dotenv").config();

var player = require("play-sound")((opts = {}));
const olms2074MGClient = require("../MailGunClients/olms2074MGClient")
const boMGClient = require("../MailGunClients/boMGClient")


const arraysContainSameItems = require("./arraysContainSameItems");
const sendEmail = require("./sendEmail");

// ----- config ------
const testing = false
const playSound = true;
const titlesToCreateAnAlertFor = ["alert", "Alert", "Pick", "pick", "PICK", "ALERT"]

const millisecondsBeforeEmailingOthers = 5 * 1000;
const myEmail = ["berkleyo@icloud.com"];
const friendsAndFamilyEmails = [
  "tjob25@gmail.com",
  "jerid.w.hammer@gmail.com",
];
const investAnswersEmails = ["johndo987987@gmail.com", "crypto.eagle.alert@gmail.com"];
const cryptoGainsEmails = ["johndo987987@gmail.com", , "crypto.eagle.alert@gmail.com"];

// -------------------

module.exports = async function scraper(
  page,
  scraperType = "IA",
  currentPostTitles = []
) {
  try {
    console.log("🏁🏁🏁🏁🏁🏁");
    const titles = await page.$$('[data-tag="post-title"]');
    const newPostTitles = [];

    for (const title of titles) {
      const innerTextTitle = await page.evaluate((el) => el.innerText, title);
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
        if (newPostTitles[0].includes(word)) {
          title = "TRADE ALERT! - "
          if (playSound) {
            player.play("Siren.mp3", function (err) {
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
        newPostTitles[0] === "IA Trade Alert" &&
        scraperType === "IA" && !testing
      ) {

        sendEmail(
          olms2074MGClient,
          "Berk's Investment Group Posted!",
          friendsAndFamilyEmails, process.env.OLMS2074_MAILGUN_EMAIL
        );
      }
      
      // InvestAnswers Emails
      if (investAnswersEmails.length > 0 && scraperType === "IA" && !testing) {
        setTimeout(async () => {
          sendEmail(olms2074MGClient, `${title}InvestAnswers Posted!`, investAnswersEmails, process.env.OLMS2074_MAILGUN_EMAIL);
        }, millisecondsBeforeEmailingOthers);
      }

      // Crypto Gains Emails
      if (cryptoGainsEmails.length > 0 && scraperType === "CG" && !testing) {
        setTimeout(async () => {
          sendEmail(olms2074MGClient, `${title}Crypto Gains Posted!`, cryptoGainsEmails, process.env.OLMS2074_MAILGUN_EMAIL);
        }, millisecondsBeforeEmailingOthers);
      }

      setTimeout(async () => {
        await page.reload();
        setTimeout(async () => {
          await scraper(page, scraperType, newPostTitles);
        }, "7000");
      }, "120000"); // 120000 = 2 mins
    } else {
      console.log("👌 He has not posted 👌");

      await page.reload();
      setTimeout(async () => {
        await scraper(page, scraperType, currentPostTitles);
      }, "5000");
    }
  } catch (error) {
    console.log(error);
    await page.reload();
    setTimeout(async () => {
      await scraper(page, scraperType, currentPostTitles);
    }, "7000");
  }
};
