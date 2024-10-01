const scraper = require("./helpers/scraper");
const puppeteer = require("puppeteer-extra");
const checkIfItsGameTime = require("./helpers/checkIfItsGameTime");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
require("dotenv").config();

logIntoPatreon("olms2074@gmail.com", process.env.PATREON_PASSWORD); // InvestAnswers

async function logIntoPatreon(email, password) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();

  await page.goto(`https://www.patreon.com/login`, { waitUntil: "load" });

  setTimeout(async () => {
    await scraper(page);
  }, "45000");
}
