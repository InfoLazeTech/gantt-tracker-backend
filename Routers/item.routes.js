const express = require('express');
const router = express.Router();
const itemController = require('../Controllers/item.controller');

router.get('/item', itemController.getAllItems);
router.post('/item', itemController.createItem);
router.put('/item/:itemId', itemController.updateItem);
router.put('/item/:itemId/process/:processId', itemController.updateProcessItem);
router.delete('/item/:itemId', itemController.deleteItem);

module.exports = router;