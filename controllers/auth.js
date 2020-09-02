const {connection}=require("../config/config")
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
    console.log(req.body);
    const { name, mobile, address, email, password, confirmPassword,  } = req.body;
    connection.query("SELECT email FROM staff WHERE email = ?", [email], async (error, result)=>{
        if(error){
            console.log(error);
        }
        if(result.length > 0){
            return res.render('register', {
                message: "That email is already in use"
            })
        }else if(password != confirmPassword){
            return res.render('register', {
                message: "Password do not matching"
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        connection.query('INSERT INTO staff SET ?', {staff_name: name, staff_phone: mobile, staff_address: address, email: email, password: hashedPassword}, (error, results) => {
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
             console.log(results)
           if( !results || !(await bcrypt.compare(password, results[0].password))){
               res.status(401).render('Login', {
                   message: "Email or Password is incorrect"
               })
           }else{
               const id = results[0].staff_id;
               const token = jwt.sign({ id }, "rajendra666",{
                   expiresIn: "90d"
               });
               console.log("token is = ",token);

               const cookieOptions = {
                   expires: new Date(
                       Date.now() + 90 * 24 * 60 * 60 * 1000
                   ),
                   httpOnly: true
               }
               res.cookie('jwt', token, cookieOptions)
               res.status(200).redirect("/");
           }
         })
    }catch (error){
    console.log(error)
    }

}