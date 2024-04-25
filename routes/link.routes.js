const { Router, request, response } = require("express");
const config = require("config");
const shortid = require("shortid");
const Link = require("../models/Link");
const auth = require("../middleware/auth.middleware");
const { link } = require("./auth.rotes");
const router = Router();

router.post("/generate", auth, async (request, response) => {
  try {
    const baseUrl = config.get("baseUrl");
    const { from } = request.body;

    const code = shortid.generate();

    const existing = await Link.findOne({ from });
    if (existing) {
      return response.json({ link: existing });
    }

    const to = baseUrl + "/t/" + code;

    const link = new Link({
      code,
      to,
      from,
      owner: request.user.userId,
    });

    await link.save();

    response.status(201).json({ link });
  } catch (e) {
    response
      .status(500)
      .json({ message: "Что-то пошло не так, попробуйте еще раз" });
  }
});
router.get("/", auth, async (request, response) => {
  try {
    const links = await Link.find({ owner: request.user.userId });
    response.json(links);
  } catch (e) {
    response
      .status(500)
      .json({ message: "Что-то пошло не так, попробуйте еще раз" });
  }
});
router.get("/:id", auth, async (request, response) => {
  try {
    const link = await Link.findById(request.params.id);
    response.json(link);
  } catch (e) {
    response
      .status(500)
      .json({ message: "Что-то пошло не так, попробуйте еще раз" });
  }
});

module.exports = router;
