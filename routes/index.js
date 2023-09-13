const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use(usersRouter);
router.use(cardsRouter);
router.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

module.exports = router;
