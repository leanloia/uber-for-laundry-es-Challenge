var express = require('express');
var router = express.Router();
const withAuth = require("../helpers/middleware");

/* GET home page. */
router.get('/', withAuth, (req, res, next) => {
  res.render('index', { title: 'Uber for Laundry' });
});

module.exports = router;
