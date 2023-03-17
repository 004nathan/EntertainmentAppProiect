const express = require('express');
const {response} = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const app = express();
const database = require('mysql');
const port = 5020;
let json = require('./data.json');

// connect database
let connection = database.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'EntertainmentApp'

});
let keys = Object.keys(json[0]);
console.log(keys)
// check database connection
connection.connect((err)=>{
    if(err){
        console.log('err')
    }
    else{
        console.log('database connected');
    }
});
// json.forEach(element=>{
//     console.log(element.title)
//         let sql = `insert into Moviestables (${keys[1]},${keys[2]},${keys[3]},${keys[4]},${keys[5]},${keys[6]},${keys[0]}) values (?,?,?,?,?,?,?)`;
//        let keyvalues = [JSON.stringify(element.thumbnail),element.year,element.category,element.rating,element.isBookmarked,element.isTrending,element.title];
//             connection.query(sql,keyvalues,(err,result)=>{
//              if(err){
//                  console.log(err)
//              }
//              else{
//                  console.log(result)
//              }
//             })
//     })
// set view engine
app.set('view engine','ejs');
app.use(express.static('public'));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
// app.use(helmet());
app.use(cookieParser());
app.get('/login',(req,res)=>{
    if (req.cookies.username) {
        res.redirect('/');
      } else {
        res.render('loginSignUp');
      }
})

app.get('/',(req,res)=>{
    let sql = `select * from Moviestables order by year desc`;
                connection.query(sql,(err,result)=>{
                 if(err){
                    console.log('/page')
                    res.redirect(`/index`);
                 }
                 else{
                    json = result;
                    if (req.cookies.username) {
                        res.render('index',{json});
                      } else {
                        res.render('loginSignUp');
                      }
                 
                 }
                })

})
app.get('/indexmovies',(req,res)=>{
    let sql = `select * from Moviestables where category='Movie'order by year desc`;
                connection.query(sql,(err,result)=>{
                 if(err){
                    console.log('/movies')
                    res.redirect(`/index`);
                 }
                 else{
                    json = result;
                    if (req.cookies.username) {
                        res.render('movies',{json});
                      } else {
                        res.render('loginSignUp');
                      }
                   
                 }
                })

})
app.get('/indextvseries',(req,res)=>{
    console.log(req.query.userName);
    let sql = `select * from Moviestables where category='TV Series'order by year desc`;
                connection.query(sql,(err,result)=>{
                 if(err){
                    // console.log(err)
                    console.log('/tvseries',err)
                     res.redirect(`/index`);
                 }
                 else{
                    if (req.cookies.username) {
                        json = result
                        res.render('tvseries',{json});
                      } else {
                        res.render('loginSignUp');
                      }
                   
                   
                 }
                })

})
app.get('/indexbookmark',(req,res)=>{
    let sql = `select * from Moviestables where isBookMarked = '1' order by year desc`;
                connection.query(sql,(err,result)=>{
                 if(err){
                    console.log('/bookmark',err)
                    res.redirect(`/index`);
                 }
                 else{
                    if (req.cookies.username) {
                        res.render('bookmarked',{json});
                      } else {
                        res.render('loginSignUp');
                      }
                  
                    
                 }
                })

})
app.get('/indexuser',(req,res)=>{
    connection.query(`select * from Moviestables`,(err,result)=>{
        if(err){
            console.log('/indexuser',err);
        }
        else{
            if (req.cookies.username) {
                res.render('index',{json});
              } else {
                res.render('loginSignUp');
              }
        }
    })
})
// app.get('/index',(req,res)=>{
//     let bookMarked = req.query.boolean;
//     let sql = `UPDATE ${req.query.userName} SET isBookMarked = ${bookMarked} WHERE title = '${req.query.title}'`;
//     connection.query(sql,(err,result)=>{
//      if(err){
//          console.log(err);
//          res.redirect(`/index`);
//      }
//      else{
//         console.log(result);
//         res.redirect(`/index`);
//      }
//     })

// })
app.post('/index',(req,res)=>{
    let userData = req.body.UserData;
    console.log(userData.userName)
    let sql = `insert into UserTable (UserName,Password) values ('${userData.userName}','${userData.password}')`;
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            let tenMinutes = 10*60*1000;
            const expirationTime = new Date(Date.now() + tenMinutes);
            res.cookie("username", userData.userName,{expires:expirationTime})
         res.send(200);
        }
    })
})

app.post('/login',(req,res)=>{
    console.log(req.body)
    let userData = req.body.UserData;
    let userName =userData.userName;
    let password = userData.password;
    const sqlSearch = `SELECT * from UserTable where UserName= '${userName}';`;
    const search_query = database.format(sqlSearch,[userName]);
    connection.query(search_query,((err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            if(result.length == 0){
               res.send(409);
            }
            else{
                console.log(result);
                let id = result[0].id;
                let oneDay = 24*60*60*1000;
                const expirationTime = new Date(Date.now() + oneDay);
                res.cookie("username", userName,{expires:expirationTime})
                res.send(JSON.stringify({status:200,id:id}));
            }
        }
    }))
})
app.post('/indexupdate',(req,res)=>{
    console.log(req.body);
    connection.query(`select id from Moviestables where title = '${req.body.id}'`,(err,result)=>{
if(err){
    console.log(err);
    res.redirect(`/indexuser?id=${req.body.userId}`)
}
else{
    let bookmarkId = result[0].id;
    let sql = `insert into bookmarked (userid,bookmarkedid,isBookMarkedUpdate) values(${req.body.userId},'${bookmarkId}',${req.body.value})`;
    connection.query(sql,err,result=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
        }
    })
}
    })

    
})
app.get('/video',(req,res)=>{
    res.render('video')
})
app.listen(port ,() =>{
    console.log(`server listen port ${port}`);
})