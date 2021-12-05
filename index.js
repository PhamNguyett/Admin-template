
const express = require('express')
const exphbs  = require('express-handlebars');
const moment =require('moment')
const path=require('path')
const app = express()
const passport=require('passport')

require('dotenv').config()

const route=require('./src/routes/index')

const db=require('./src/database/index') // connect database

app.use(express.static(path.join(__dirname,'/public'))) // public 

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
 // ovewrite method

app.engine('hbs', exphbs({extname:'hbs',
    helpers:{
        upperCase(item) { return item.charAt(0).toUpperCase() + item.slice(1);},
        increase(a,i){ return a+(i-1)*10+1},
        quantity(item){return item.reduce((total,i)=>{return total+i.quantity},0) },
        newLine(a){if(a) return a.replace(/\n/g, "<br />");},
        checkedBox(array,_this){ console.log(array); array.includes(_this)>0?"true":"false" },
        momentFormatL (date){return moment(date).format('L'); },
        momentFormatAgo (date){return moment(date).startOf('day').fromNow();  },
    }
}));         //set view engine
app.set('view engine', 'hbs');          //set view engine
app.set('views',path.join(__dirname,'src/resources/views'))         //set view engine

app.use((req,res,next)=>{
    if(!req.isAuthenticated()){
        if(req.path!=='/login'){
            res.redirect('/login')
            return
        }
    }
    else{
        res.locals.user=req.user
    }
    next()
})

app.use(express.urlencoded({ 
    extended:true
}))
app.use(express.json())

route(app)
db.connect()

app.listen(process.env.PORT||5000)