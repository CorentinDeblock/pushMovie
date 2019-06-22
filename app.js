const git = require('octonode');
const express = require("express");
const app = express();
const form = require("formidable");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let client = git.client({
    username:"Your username",
    password:"Your password"
})

app.use(express.static("assets"));

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

app.post("/postData",(req,res) => {
    console.log("I'm here")
    let incoming = new form.IncomingForm();
    incoming.parse(req,(err,fields,files) => {
        repo.contents("movieTemplate.json","movie",(err,data) => {
            let content = Buffer.from(data.content,data.encoding);
            let jsObj = JSON.parse(content);
            let sha = data.sha;
            let formatedData = []

            jsObj.unshift(fields);
            for(let i = 0; i < jsObj.length;i++){
                if(i == 0){
                    let newObj = {};
                    newObj.id = i + 1;
                    Object.assign(newObj,jsObj[i]);
                    formatedData.push(newObj);
                }else{
                    jsObj[i].id = i + 1;
                    formatedData.push(jsObj[i]);
                }
            }
            console.log(formatedData);
            repo.updateContents("movieTemplate.json","Test de api",JSON.stringify(formatedData),sha,"movie",(err,path) => {
                res.redirect("/")
            })
        })
    })
})

io.on("connection",(socket) => {
    console.log("connected");
    socket.on("deleted user",(message) => {
        repo.contents("movieTemplate.json","movie",(err,data) => {
            let content = Buffer.from(data.content,data.encoding);
            let jsObj = JSON.parse(content);
            let sha = data.sha;

            for(let i = 0; i < message.length;i++){
                jsObj = jsObj.filter((value) => {
                    return value.id == message[i]; 
                })
            }
            repo.updateContents("movieTemplate.json","Test de api",JSON.stringify(jsObj),sha,"movie",(err,path) => {
                socket.emit("update table","Objet supprimer")
            })
        })
    })
})

http.listen(8080,()=>{
    console.log("Serveur lancer")
})