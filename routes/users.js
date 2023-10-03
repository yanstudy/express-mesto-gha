const router = require('express').Router();
const { errors } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');
const { checkIdUser, checkUserInfo, checkUserAvatar } = require('../middlewares/validation');

router.get('/users', getUsers);
router.patch('/users/me', checkUserInfo, updateUser);
router.get('/users/me', getUserInfo);
router.patch('/users/me/avatar', checkUserAvatar, updateAvatar);
router.get('/users/:userId', checkIdUser, getUserById);

router.use(errors());
module.exports = router;
