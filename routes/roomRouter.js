const { createRoom, deleteRoomImage, updateRoomImage } = require('../controllers/roomcontroller');

const upload = require('../helper/multer');

const router = require('express').Router();

router.post('/room/:id', upload.array('images', 10), createRoom);

router.delete('/room/:id/:imageId', deleteRoomImage);

router.patch('roomthesecond/:id/:imageId', updateRoomImage)

module.exports = router;