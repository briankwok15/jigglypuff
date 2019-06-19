const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product-controller');

router.post('/create-product', productCtrl.addProduct, (req, res) => {
  res.status(200).json(res.locals.response);
})

router.get('/delete', productCtrl.deleteProduct, (req, res) => {
  res.status(200).send(res.locals.deleted)
})

module.exports = router;