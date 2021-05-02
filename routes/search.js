var express = require('express');
const authController = require('../controllers/auth');
var router = express.Router();
const {connection}=require("../config/config")

/* GET users listing. */

router.post('/hall', authController.isLoggedIn,(req, res) => {
    console.log("hi")
    if(req.user) {
       const { hall, date } = req.body;
       if(date.length === 0 || hall.length === 1){
            return res.status(400).render('search_hall', {
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
                    booking_detils: "There is no booking on",
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
        console.log(req.user.staff_phone)
        var sql = "SELECT * FROM booking_details WHERE email = ?;"
        connection.query(sql, [req.user.email], function (err, result) {
            if (err) throw err;
            console.log(result)
            if (result.length !== 0) {
                res.render('profile', {
                    booked_details_r: result,
                    booked_status: "Success",
                    user:req.user
                })
            } else {
                res.render('profile', {
                    booked_status: "Oops.. "+req.user.staff_name+" please book the hall please :) ",
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
        try {
        var sql = "SELECT * FROM cancelled_details WHERE email = ?;"
        connection.query(sql, [req.user.email], function (err, result) {
            if (err) throw err;
            console.log(result.length)
            if (result.length !== 0) {
                res.render('profile', {
                    cancelled_details_r: result,
                    cancelled_status: "Success",
                    user:req.user
                })
            } else {
                res.render('profile', {
                    cancelled_status: "Wow, there is no cancelled records",
                    user:req.user
                })
            }
        })
        }catch (e) {
                    res.render('profile', {
                    cancelled_status: "Wow, there is no cancelled records1",
                    user:req.user
                })
        }

    }else {
    res.redirect("/login");
  }
});


router.get('/booked_details1', authController.isLoggedIn,(req, res) => {
    if(req.query.book_id.length === 0){
    return res.status(400).render('profile', {
        message: "Book ID cannot be empty :) ",
        user:req.user,
    })
    }

    if(req.user) {
        var sql = "SELECT * FROM booking_details WHERE booking_id = ?;"
        connection.query(sql, [req.query.book_id], function (err, result) {
            if (err) throw err;
            console.log("---------------------------")
            console.log(result)
            if (result.length != 0) {
                res.render('profile', {
                    booked_id_details: result,
                    booked_id_status_done: "Booked Details",
                    user:req.user
                })
                } else {
                var sql = "SELECT * FROM cancelled_details WHERE booking_id = ?;"
                connection.query(sql, [req.query.book_id], function (err, results) {
                     if (err) throw err;
                     if (results.length != 0) {
                        res.render('profile', {
                            booked_id_details: results,
                            booked_id__status_cancelled: "Cancelled Details",
                            user:req.user
                        })
                     }else {
                         res.status(400).render('profile', {
                            message: "Seems like Booking ID does not exist",
                            user:req.user,
                        })
                     }

                });
            }
        });
    }else {
    res.redirect("/login");
  }
});



router.post('/bookhall',authController.isLoggedIn,(req,res) =>{
     if(req.user) {
       const { hall, date, fromtime, totime } = req.body;
       console.log(req.body)




       // if(hall === '0'){
       //      return res.status(400).render('search_hall', {
       //          message1: "Incorrect venue name",
       //          user:req.user,
       //      })
       // }
       // console.log(date.length)
       // console.log(fromtime)
       // console.log(typeof totime)
       // if(date.length === 0 || hall.length === 1){
       //      return res.status(400).render('search_hall', {
       //          message: "Incorrect venue name / Invalid Date",
       //          user:req.user,
       //      })
       //  }
       //   console.log(req.body)
        return true;
     }else {
    res.redirect("/login");
  }
})


module.exports = router;
