const git = require('octonode');
const express = require("express");
const app = express();
const form = require("formidable");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const fs = require("fs");

fs.readFile("login.json",(err,data) => {
    if(err) throw err;
    let jsonObj = JSON.parse(data.toString()); 

    if(jsonObj.username == undefined || jsonObj.password == undefined || jsonObj.repo == undefined || jsonObj.branch == undefined || jsonObj.file == undefined){
        console.log("Erreur lors de la lecture du fichier login.json \nUn fichier json doit être stucturé comme cela : ");
        let demonstrate = {
            username:"Votre nom d'utilisateur",
            password:"Votre mot de passe",
            repo:"Votre repository",
            branch:"Votre branche",
            file:"Votre fichier"
        }
        console.log(JSON.stringify(demonstrate));
    }else{

        let client = git.client({
            username:jsonObj.username,
            password:jsonObj.password
        })
        
        client.get('/user', {}, function (err, status, body, headers) {
            if(err) throw err;

            app.use(express.static("assets"));
        
            let repo = client.repo(jsonObj.repo);
            
            repo.contents(jsonObj.file,jsonObj.branch,(err,data) => {
                if(err) throw err;
                app.use(express.static("assets"));
            
                app.set("view engine","pug")
                
                app.get("/",(req,res) => {
                    repo.contents(jsonObj.file,jsonObj.branch,(err,data) => {
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
                        repo.contents(jsonObj.file,jsonObj.branch,(err,data) => {
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
                
                            repo.updateContents(jsonObj.file,"Test de api",JSON.stringify(deletedData),sha,jsonObj.branch,(err,path) => {
                                socket.emit("update table","Objet supprimer")
                            })
                        })
                    })
                    socket.on("send data",(message) => {
                        repo.contents(jsonObj.file,jsonObj.branch,(err,data) => {
                            let content = Buffer.from(data.content,data.encoding);
                            let jsObj = JSON.parse(content);
                            let sha = data.sha;
                            let commit = "";
                            let formatedData = []
                            
                            for(let i in message){
                                let newObj = {}
                                for(let j in message[i]){
                                    if(j == 'commit'){
                                        commit = message[i][j]
                                    }else{
                                        newObj[j] = message[i][j]
                                    }
                                }
                                jsObj.push(newObj);
                            }
                
                            for(let i = 0; i < jsObj.length;i++){
                                if(jsObj[i].id != undefined){
                                    jsObj[i].id = i + 1
                                    formatedData.push(jsObj[i])
                                }
                                else{  
                                    formatedData.push(Object.assign({id:i+1},jsObj[i]));
                                }
                            }
                
                            repo.updateContents(jsonObj.file,commit,JSON.stringify(formatedData),sha,jsonObj.branch,(path) => {
                                socket.emit("update table","Objet inséré")
                            })
                            
                        })
                    })
                })
                
                http.listen(8080,()=>{
                    console.log("Serveur lancé sur le port 8080")
                })
            })
        });
    }
})