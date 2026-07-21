const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get("https://news.ycombinator.com");

    const $ = cheerio.load(data);
    const titles = [];

    $(".titleline a").each((i, el) => {
      titles.push($(el).text());
    });

    res.json({ titles: titles.slice(0, 5) });

  } catch (err) {
    res.status(500).json({ error: "Scraping failed" });
  }
});

module.exports = router;