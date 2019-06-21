const git = require('octonode');
const express = require("express");
const app = express();
const form = require("formidable");

let client = git.client({
    username:"Your username",
    password:"Your password"
})

let repo = client.repo("Your repo");

app.use(express.static("assets"));

app.set("view engine","pug")
app.get("/",(req,res) => {
    repo.contents("movieTemplate.json","movie",(err,data) => {
        let content = Buffer.from(data.content,data.encoding);
        let jsObj = JSON.parse(content);
        res.render("index",{
            data:jsObj
        })
    })
})

app.delete("/eraseUser",(req,res) => {

})

app.post("/postData",(req,res) => {
    console.log("I'm here")
    let incoming = new form.IncomingForm();
    incoming.parse(req,(err,fields,files) => {
        console.log(fields);
        repo.contents("movieTemplate.json","movie",(err,data) => {
            let content = Buffer.from(data.content,data.encoding);
            let jsObj = JSON.parse(content);
            let sha = data.sha;

            repo.updateContents("movieTemplate.json","Test de api",content.toString("ascii") + jsObj,sha,"movie")
        })
        res.redirect("/")
    })
})

app.listen(8080,()=>{
    console.log("Serveur lancer")
})