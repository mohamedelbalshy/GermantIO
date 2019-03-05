const router = require('express').Router();
const User = require('../models/user');
const Employee = require('../models/employee');
const Attendance = require('../models/attendance');
const Status = require('../models/status');
const passportConfig = require('../config/passport');




router.get('/',passportConfig.isAuthenticated, (req, res, next)=>{
    if(req.user){
        
        Employee.find({}, (err, employees) => {
            if (err) return res.status(400).send('Error');
            
            res.render('home', { employees: employees });
        })
    } else{
        res.render('home');
    }
   

});

router.route('/employee/add')
    .get((req, res, next)=>{
        if(req.user){
            res.render('add-employee');
        }
    })
    .post(passportConfig.isAuthenticated,(req, res, next)=>{
        var employee = new Employee();
        employee.name = req.body.username;
        employee.email = req.body.email;
        employee.mobileNo = req.body.mobileNo;
        employee.hireDate = req.body.hireDate;

        employee.save((err)=>{
            if(err)
                return console.log('Error occured!');
            console.log('Employee Added to DB.');
            res.redirect('/');
        })
    });

router.route('/edit-employee/:id')
    .get(passportConfig.isAuthenticated,(req, res, next)=>{
        var employeeId = req.params.id;

        if(req.user){
            Employee.findById(employeeId, (err, employee)=>{
                if(err) return console.log(err);
                return res.render('edit-employee', {employee: employee});
            })
            
        }
    })
    .post(passportConfig.isAuthenticated,(req, res, next)=>{
        Employee.findOne({ _id: req.params.id}, (err, employee)=>{
            if(err)
                return console.log(err);
            if(req.body.username) employee.name = req.body.username;
            if(req.body.email) employee.email = req.body.email;
            if(req.body.mobileNo) employee.mobileNo = req.body.mobileNo;
            if(req.body.hireDate) employee.hireDate = req.body.hireDate;

            employee.save((err)=>{
                if(err) return console.log(err);
                res.redirect('/');
            })
        })
    });

router.post('/delete/:id',passportConfig.isAuthenticated,  (req, res, next)=>{

    employeeId = req.body.employeeId;
    Employee.findOneAndRemove({_id: employeeId}, (err, employee)=>{
        if(err) return console.log(err);
        res.status(200);
        employee.save((err)=>{
            if(err) console.log(err);
            res.status(200);
            res.redirect('/');
        })
    })
});

router.route('/attendance/:id')
    .get(passportConfig.isAuthenticated,(req, res, next)=>{
        if(req.user){
            Employee.findById(req.params.id, (err, employee)=>{
                res.render('attendance.hbs', {employee: employee});
            })
            
        }
    })

    .post(passportConfig.isAuthenticated,(req, res, next)=>{
        if(req.user){
            var status = new Status();
            status.statusOfEmployee = req.body.status;
            status.save((err, result)=>{
                Employee.findById(req.params.id, (err, employee) => {
                   
                    var attendance = new Attendance();
                    attendance.day = req.body.day;
                    attendance.workingHours = req.body.workingHours;
                    attendance.employee = employee;
                    attendance.status = result;
                    attendance.save((err) => {
                        if (err) return console.log(err);
                        console.log(attendance)
                        res.redirect('/');

                    });
    
                });
            })
            
        }
    });

    router.get('/status', (req, res, next)=>{
        Status.find({}, (err, result)=>{
            
            res.send(result);
        })
    })

router.get('/report',passportConfig.isAuthenticated,(req, res, next)=>{
    res.render('report');
});

router.post('/report', passportConfig.isAuthenticated, (req, res, next)=>{
    var email = req.body.email;
    var from = req.body.from;
    var to = req.body.to;

    Employee.find({email: email}, (err, employee)=>{
        if(err) return console.log(err);
        console.log(employee);

        Attendance.find({employee: employee, "day": {"$gte": new Date(from), "$lt": new Date(to)}})
        .populate('status')
        .populate('employee')
        .exec((err, attendance)=>{
            if (err) return console.log(err);
            console.log(attendance)
            res.render('report', { att: attendance });
        })
        
            
        
    })
});

router.route('/employee-of-month')
    .get((req, res, next)=>{
        Attendance.find({/*  "day": { "$gte": new Date(from), "$lt": new Date(to) } */ })
            .populate('employee')
            .populate('status')
            .exec((err, attendance) => {
                if (err) return console.log(err);
                console.log(attendance);
                var result = [];

                for (var i in attendance)
                    result.push([i, attendance[i]]);
                
                console.log(attendance.reduce((total, obj) => obj.workingHours + total, 0));
                res.send(attendance);
            })
        
    })
    .post((req, res, next)=>{
        var from = req.body.from;
        var to = req.body.to;
        Attendance.find({/*  "day": { "$gte": new Date(from), "$lt": new Date(to) } */})
            .populate('employee')
            .exec((err, attendance)=>{
                if(err) return console.log(err);
                console.log(attendance.employee.email);
            })
    });
function distinct(arr) {
    
    for (var i = 0; i < arr.length; i++) {
        if (!arr.includes(arr[i])) {
            arr.push(arr[i]);
        }
    }
    console.log( Object.keys(arr).map(k => arr[k]['workingHours']))
    
    return arr;
}

module.exports = router;
