var express = require('express');
const {connection}=require("../config/config")
var router = express.Router();
const now = new Date()

/* GET home page. */
router.post('/mainpage', function(req, res) {
res.json({"Message": "Room successfully booked"});
  // if(req.body.type === 1 || req.body.type === "1") {
  //   connection.query("SELECT * FROM room", function (err, result, fields) {
  //     if (err) throw err;
  //     res.json(result);
  //   });
  // }

  // if(req.body.type === 2 || req.body.type === "2") {
  //   var sql = "UPDATE room SET free = 1 WHERE id = ?"
  //   connection.query(sql, [req.body.roomid], function (err, result) {
  //   if (err) throw err;
  //   if(result.changedRows === 1){
  //     res.json({"Message": "Room successfully booked"});
  //   }
  //   if(result.changedRows === 0){
  //     res.json({"Message": "Sorry Room Already booked"});
  //   }
  //   });
  // }

  // if(req.body.type === 3 || req.body.type === "3") {
  //   var sql = "UPDATE room SET free = 0 WHERE id = ?"
  //   connection.query(sql, [req.body.roomid], function (err, result) {
  //   if (err) throw err;
  //
  //   if(result.changedRows === 1){
  //     res.json({"Message": "successfully cancelled booking"});
  //   }
  //   if(result.changedRows === 0){
  //     res.json({"Message": "Already cancelled booking"});
  //   }
  //   });
  // }
})



router.post('/book', function(req, res) {
    var hallname = req.body.hall_name;
    var ff=req.body.fromtime;
    var tt=req.body.totime;
    var staff_name=req.body.staff_name;
    var phone = req.body.staff_phone;
    var dept=req.body.dept;
    var classname=req.body.class;
    var purpose = req.body.purpose;
    var date = req.body.date;
    var sql = "SELECT * FROM booking_details WHERE hall_name = ? AND dates = ? AND ((fromtime = ? AND totime = ?) OR (fromtime <= ? AND totime > ?) OR (fromtime < ? AND totime >= ?))"
    connection.query(sql,[hallname,date,ff,tt,ff,ff,tt,tt], function (err, result) {
        if (err) throw err;
        if(result.length === 0){
              var sql = "INSERT INTO `booking_details` (`booking_id`, `staff_name`, `staff_phone`, `dept`, `hall_name`, `dates`, `fromtime`, `totime`, `class`, `purpose`, `booked_time`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
              connection.query(sql,[staff_name,phone,dept,hallname,date,ff,tt,classname,purpose,Math.round(now.getTime())], function (err, result, fields) {
                  if (err) throw err;
                res.json({Message : "Successfully booked man"});
              })
        } else{
            res.json({Message : "Its already exist man"});
        }
    })
})

router.post('/cancel', function(req, res) {
   var sql = "SELECT * FROM booking_details WHERE booking_id=?"
    connection.query(sql,[req.body.booking_id], function (err, result) {
        if (err) throw err;
        if(result.length === 1){
                    var sql = "SELECT * FROM cancelled_details WHERE booking_id=?"
                    connection.query(sql,[req.body.booking_id], function (err, cancel_result) {
                        if(cancel_result.length === 0){
                            var sql = "INSERT INTO `cancelled_details` (`cancelled_table_id`, `staff_name`, `staff_phone`, `dept`, `hall_name`, `dates`, `fromtime`, `totime`, `booked_time`, `cancelled_time`, `class`, `booked_purpose`, `cancel_reason`, `booking_id`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                              connection.query(sql,[result[0].staff_name,result[0].staff_phone,result[0].dept,result[0].hall_name,result[0].dates,result[0].fromtime,result[0].totime,result[0].booked_time,Math.round(now.getTime()),result[0].class,result[0].purpose,req.body.cancel_reason,result[0].booking_id], function (err, result, fields) {
                                  if (err) throw err;
                                  if(result.affectedRows === 1) {
                                       var sql = "DELETE FROM `booking_details` WHERE `booking_details`.`booking_id` = ?"
                                       connection.query(sql,[req.body.booking_id], function (err, deleted_result, fields) {
                                        if (err) throw err;
                                        if(deleted_result.affectedRows === 1) {
                                            res.json({Message: "Row Successfully deleted"});
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
