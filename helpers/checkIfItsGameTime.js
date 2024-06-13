const moment = require("moment-timezone");

module.exports = function checkIfItsGameTime() {
  // Get the current time in MST
  const nowMST = moment().tz("America/Denver");
  console.log("🚀 ~ checkIfItsGameTime ~ nowMST:", nowMST);

  // Define 6:30 AM in MST
  const morningTimeMST = moment()
    .tz("America/Denver")
    .startOf("day")
    .add(6, "hours")
    .add(30, "minutes");
  console.log("🚀 ~ checkIfItsGameTime ~ morningTimeMST:", morningTimeMST);

  // Define 11:55 PM in MST
  const nightTimeMST = moment()
    .tz("America/Denver")
    .startOf("day")
    .add(23, "hours")
    .add(55, "minutes");

  console.log("🚀 ~ checkIfItsGameTime ~ nightTimeMST:", nightTimeMST);

  // Check if the current time is after 7 AM MST
  if (nowMST.isAfter(morningTimeMST) && nowMST.isBefore(nightTimeMST)) {
    console.log("Time to receive Alerts! 🌞");
    return true;
  } else {
    console.log("Not time to receive alerts 💤");
    return false;
  }
};
