var express = require('express');
const authController = require('../controllers/auth');
var router = express.Router();
const {connection}=require("../config/config")

/* GET users listing. */

router.post('/hall', authController.isLoggedIn,(req, res) => {
    if(req.user) {
       const { hall, date } = req.body;
       if(date.length === 0 || hall.length === 1){
            return res.status(400).render('book_hall', {
                message: "Incorrect venue name / Invalid Date",
                user:req.user,
            })
        }
        var sql = "SELECT * FROM booking_details WHERE dates = ? AND hall_name = ? ORDER BY fromtime ASC;"
        connection.query(sql, [date,hall], function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                res.render('search_hall', {
                    booking_detils_r: result,
                    booking_detils: "Some booking are there I think",
                    user:req.user,
                    date:date
                })
            } else {
                res.render('search_hall', {
                    booking_detils: "There is no booking today",
                    user:req.user,
                    date:date
                })
            }
        })
    }else {
    res.redirect("/login");
  }
});


router.get('/booked_details', authController.isLoggedIn,(req, res) => {
    if(req.user) {
        var sql = "SELECT * FROM booking_details WHERE staff_name = ?;"
        connection.query(sql, [req.user.staff_name], function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                console.log("----------")
                console.log(result)
                res.render('profile', {
                    booked_details_r: result,
                    booked_status: "Success",
                    user:req.user
                })
            } else {
                res.render('profile', {
                    booked_status: "Fail",
                    user:req.user
                })
            }
        })
    }else {
    res.redirect("/login");
  }
});



router.get('/cancelled_details', authController.isLoggedIn,(req, res) => {
    if(req.user) {
        var sql = "SELECT * FROM cancelled_details WHERE staff_name = ?;"
        connection.query(sql, [req.user.staff_name], function (err, result) {
            if (err) throw err;
            if (result.length != 0) {
                res.render('profile', {
                    cancelled_details_r: result,
                    cancelled_status: "Success",
                    user:req.user
                })
            } else {
                res.render('profile', {
                    cancelled_status: "Fail",
                    user:req.user
                })
            }
        })
    }else {
    res.redirect("/login");
  }
});


module.exports = router;
