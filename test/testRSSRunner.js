// test/testRSSRunner.js

const { runRSSFetcher } = require("../dist/fetchRSS");


runRSSFetcher()
  .then((xml) => {
    console.log("✅ RSS Output Preview:\n");
    console.log(xml.slice(0, 1000));
  })
  .catch((err) => {
    console.error("❌ runRSSFetcher failed:", err);
  });
