const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/families", async (req, res) => {
  try {
    const {
      data,
      meta: { total },
    } = await axios.get("https://trefle.io/api/v1/families");

    if (data && total) {
      res.status(200).json({ data, total });
    } else {
      res.status(400).json({ error: "There's neither data nor total" });
    }
  } catch (error) {
    res.status(400).json({ error: error.response });
  }
});

router.get("/families/name", async (req, res) => {
  try {
    const { data } = await axios.get("https://trefle.io/api/v1/families");

    if (data) {
      const names = data.map((family) => {
        return family.common_name;
      });

      res.status(200).json(names);
    } else {
      res.status(400).json({ error: "There's no data" });
    }
  } catch (error) {
    res.status(400).json({ error: error.response });
  }
});

module.exports = router;
