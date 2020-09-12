var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');

/* GET users listing. */
router.get('/', authController.isLoggedIn, (req, res) => {
  res.render('index', {
    user: req.user
  });
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
  if(req.user) {
        res.render('profile', {
            booking_detils: "Some booking are there I think",
            user:req.user
        });
  } else {
    res.redirect("/login");
  }

});

router.get("/register", function (req, res){
res.render("register")
})

router.get("/login", authController.isLoggedIn,function (req, res){
  if(req.user) {
     res.render('profile', {
      user: req.user
    });
  } else {
    res.render("login");
  }
})

module.exports = router;
