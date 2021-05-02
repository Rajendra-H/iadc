var express = require('express');
const {connection}=require("../config/config")
var router = express.Router();
const now = new Date()
const authController = require('../controllers/auth');

/* GET home page. */
router.post('/mainpage', function(req, res) {
res.json({"Message": "Room successfully booked"});
})

router.get('/search_hall', authController.isLoggedIn,(req, res) => {
  if(req.user) {
    res.render('search_hall', {
      user: req.user,
      title:"Booking System"
    });
  } else {
    res.redirect("/login");
  }
});

router.get('/book_hall', authController.isLoggedIn,(req, res) => {
  if(req.user) {
    res.render('book_hall', {
      user: req.user,
      title:"Booking System"
    });
  } else {
    res.redirect("/login");
  }
});



router.post('/book', function(req, res) {
    var hallname = req.body.hall_name;
    var ff=req.body.fromtime;
    var tt=req.body.totime;
    var staff_name=req.body.staff_name;
    var email = req.body.email;
    var dept=req.body.dept;
    var classname=req.body.class;
    var purpose = req.body.purpose;
    var date = req.body.date;
    var sql = "SELECT * FROM booking_details WHERE hall_name = ? AND dates = ? AND ((fromtime = ? AND totime = ?) OR (fromtime <= ? AND totime > ?) OR (fromtime < ? AND totime >= ?))"
    connection.query(sql,[hallname,date,ff,tt,ff,ff,tt,tt], function (err, result) {
        if (err) throw err;
        if(result.length === 0){
              var sql = "INSERT INTO `booking_details` (`booking_id`, `staff_name`, `email`, `dept`, `hall_name`, `dates`, `fromtime`, `totime`, `class`, `purpose`, `booked_time`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
              connection.query(sql,[staff_name,email,dept,hallname,date,ff,tt,classname,purpose,Math.round(now.getTime())], function (err, result, fields) {
                  if (err) throw err;
                res.json({Message : "Successfully booked man"});
              })
        } else{
            res.json({Message : "Its already exist man"});
        }
    })
})

router.get('/cancel/:booking_id', function(req, res) {
    const {booking_id} = req.params;

   var sql = "SELECT * FROM booking_details WHERE booking_id=?"
    connection.query(sql,[booking_id], function (err, result) {
        if (err) throw err;

        if(result.length === 1){
                    var sql = "SELECT * FROM cancelled_details WHERE booking_id=?"
                    connection.query(sql,[booking_id], function (err, cancel_result) {
                        if(cancel_result.length === 0){
                            console.log(result[0].booked_time)
                            var sql = "INSERT INTO `cancelled_details` (`cancelled_table_id`, `staff_name`,`email`, `dept`, `hall_name`, `dates`, `fromtime`, `totime`, `booked_time`, `cancelled_time`, `class`, `booked_purpose`, `booking_id`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
                              connection.query(sql,[result[0].staff_name,result[0].email,result[0].dept,result[0].hall_name,result[0].dates,result[0].fromtime,result[0].totime,result[0].booked_time,Math.round(now.getTime()),result[0].class,result[0].purpose,result[0].booking_id], function (err, result1, fields) {
                                  if (err) throw err;
                                  if(result1.affectedRows === 1) {
                                       var sql = "DELETE FROM `booking_details` WHERE `booking_details`.`booking_id` = ?"
                                       connection.query(sql,[booking_id], function (err, deleted_result, fields) {
                                        if (err) throw err;
                                        if(deleted_result.affectedRows === 1) {
                                         var sql = "SELECT * FROM booking_details WHERE email = ?;"
                                            connection.query(sql, [result[0].email], function (err, result2) {
                                                if (err) throw err;
                                                if (result2.length !== 0) {
                                                    res.render('profile', {
                                                        booked_details_r: result2,
                                                        booked_status: "Success",
                                                        user:req.user
                                                    })
                                                } else {
                                                    res.render('profile', {
                                                        booked_status: "Oops.. "+result[0].staff_name+" please book the hall please :) ",
                                                        user:req.user
                                                    })
                                                }
                                            })
                                        }else{
                                            res.json({Message: "Row inserted but nor deleted"});
                                        }
                                       })
                                  }else{
                                      res.json({Message: "Sucessfully not inserted"});
                                  }
                              })

                        }else{
                             res.json({Message: "It's already deleted man"});
                        }
                    })
        } else{
            res.json({Message : "Invalid ID"});
        }
    })
})


router.post('/viewhall', function(req, res) {
    var sql = "SELECT * FROM booking_details WHERE dates = ?"
    connection.query(sql, [req.body.dates], function (err, result) {
    if (err) throw err;
    if(result.length === 0){
      res.json({"Message": "No bookings on given date"});
    }else{
        res.json({"Message": result});
    }
    });
})
module.exports = router;
