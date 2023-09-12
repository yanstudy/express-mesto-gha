const {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require("../controllers/cards");

const router = require("express").Router();

router.get("/cards", getCards);
router.post("/cards", createCard);
router.delete("/cards/:cardId", deleteCardById);
router.put("/cards/:cardId/likes", addLike);
router.delete("/cards/:cardId/likes", deleteLike);

module.exports = router;
