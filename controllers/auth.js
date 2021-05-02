const {connection}=require("../config/config")
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

exports.register = (req, res) => {
    const { name, mobile, dept, address, email, password, confirmPassword,  } = req.body;
    connection.query("SELECT email FROM staff WHERE email = ?", [email], async (error, result)=> {
        if (error) {
            console.log(error);
        }
        if(result.length > 0){
            return res.render('register', {
                message: "That email is already in use"
            })
        }else if(password !== confirmPassword){
            return res.render('register', {
                message: "Password do not matching"
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        connection.query('INSERT INTO staff SET ?', {staff_name: name, dept:dept, staff_phone: mobile, staff_address: address, email: email, password: hashedPassword}, (error, results) => {
            if(error){
            console.log(error);
        }else{
                return res.render('register', {
                message: "User Registred"
            })
            }
        })
    })
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || ! password){
            return res.status(400).render('Login', {
                message: "Please provide a valid email or password"
            })
        }
         connection.query('SELECT * FROM staff WHERE email = ?', [email],async(error,results) => {

             try{
           const isMatch = await bcrypt.compare(password, results[0].password);
             // if( !results || !(await bcrypt.compare(password, results[0].password))){
            if(!results || !isMatch ) {
               res.status(401).render('Login', {
                   message: "Email or Password is incorrect"
               })
           }else{
               const id = results[0].staff_id;
               const token = jwt.sign({ id }, "rajendra666",{
                   expiresIn: "90d"
               });

               const cookieOptions = {
                   expires: new Date(
                       Date.now() + 90 * 24 * 60 * 60 * 1000
                   ),
                   httpOnly: true
               }
               res.cookie('jwt', token, cookieOptions)
               res.status(200).redirect("/index/search_hall");
           }
         }catch (error){

                 res.status(401).render('Login', {
                   message: "Email or Password is incorrect"
               })
    }

         }
         )
    }catch (error){
                res.status(401).render('Login', {
                   message: "Something went wrong"
               })
    }

}







// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,"rajendra666"
      );
      // 2) Check if user still exists
      connection.query('SELECT * FROM staff WHERE staff_id = ?', [decoded.id], (error, result) => {
        if(!result) {
          return next();
        }
        // THERE IS A LOGGED IN USER
        req.user = result[0];
        return next();
      });
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).redirect("/");
};
