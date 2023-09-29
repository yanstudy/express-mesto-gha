const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.patch('/users/me', updateUser);
router.get('/users/me', getUserInfo);
router.patch('/users/me/avatar', updateAvatar);
router.get('/users/:userId', getUserById);

module.exports = router;
