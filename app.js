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

io.on("connection",(socket) => {
    console.log("connected");
    socket.on("deleted user",(message) => {
        repo.contents("movieTemplate.json","movie",(err,data) => {
            let content = Buffer.from(data.content,data.encoding);
            let jsObj = JSON.parse(content);
            let sha = data.sha;
            let deletedData = [];

            for(let i = 0; i < jsObj.length;i++){
                let pushData = true;
                for(let j = 0; j < message.length;j++){
                    if(jsObj[i].id == message[j]){
                        pushData = false;
                    }
                }
                if(pushData) {
                    jsObj[i].id = deletedData.length + 1;
                    deletedData.push(jsObj[i]);
                }
            }

            repo.updateContents("movieTemplate.json","Test de api",JSON.stringify(deletedData),sha,"movie",(err,path) => {
                io.emit("update table","Objet supprimer")
            })
        })
    })
    socket.on("send data",(message) => {
        repo.contents("movieTemplate.json","movie",(err,data) => {
            let content = Buffer.from(data.content,data.encoding);
            let jsObj = JSON.parse(content);
            let sha = data.sha;

            let formatedData = []

            for(let j of message){
                jsObj.push(j);
            }

            for(let i = 0; i < jsObj.length;i++){
                if(jsObj[i].id != undefined){
                    jsObj[i].id = i + 1
                    formatedData.push(jsObj[i])
                }else{  
                    formatedData.push(Object.assign({id:i+1},jsObj[i]));
                }
            }

            console.log(formatedData);
            repo.updateContents("movieTemplate.json","Test de api",JSON.stringify(formatedData),sha,"movie",(err,path) => {
                io.emit("update table","Objet Inséré")
            })
        })
    })
})

http.listen(8080,()=>{
    console.log("Serveur lancer")
})