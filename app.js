const express = require("express");

const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));



app.use(express.static('public'));//use of static web pages is allowwd only after this command.//public is the folder that contains your local files which we dont send directly like images and css.
app.get("/", function(req,res)
{
  res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res)
{
 const fName = req.body.firstname;//getting hold of the inputed data.
 const lName = req.body.lastname;
 const emailId = req.body.email;

 var data ={   //sending data in form of json packet i.e. in from of an object
   members : [
     {
       email_address : emailId,
       status : "subscribed",
       merge_fields : {
         FNAME : fName,
         LNAME : lName
       }

     }
   ]
 };
 const jsonData = JSON.stringify(data);
 const url = " https://us14.api.mailchimp.com/3.0/lists/b9edb6adb4";//using list id at last
 const  options = {
   method : "POST", //making a post request
   auth : "riya:10ac752f5956a281481d983564c5994a-us14"//giving the api id ..
 }
 const request = https.request(url , options, function(response)
{
  response.on ("data", function(data)

{
  if(response.statusCode == 200)
  {
    res.sendFile( __dirname + "/success.html");

  }
  else{
    res.sendFile(  __dirname+ "/failure.html");
  }
  console.log(JSON.parse(data));
});
});
request.write(jsonData);//sending data to mailchimp api.by placing the data in a constant called request.
request.end();
});
app.post("/failure",function(req,res)
{
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function()
{
  console.log("server is running on port 3000");
});
