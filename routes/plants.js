const express = require("express");
const router = express.Router();
const axios = require("axios");

const token = process.env.TREFLE_API_TOKEN;

router.get("/plants", async (req, res) => {
  try {
    const {
      data,
      meta: { total },
    } = await axios.get("https://trefle.io/api/v1/plants?token=" + token);

    if (data && total) {
      res.status(200).json({ data, total });
    } else {
      res.status(400).json({ error: "There's neither data nor total" });
    }
  } catch (error) {
    res.status(400).json({ error: error.response });
  }
});

router.get("/plants/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const { data, total } = await axios.get(
      "https://trefle.io/api/v1/plants?token=" +
        token +
        "&filter[common_name]=" +
        name
    );

    if (data) {
      res.status(200).json({ data, total });
    } else {
      res.status(400).json({ error: "There's no data" });
    }
  } catch (error) {
    res.status(400).json({ error: error.response });
  }
});

module.exports = router;
