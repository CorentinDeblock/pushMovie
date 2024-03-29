let socket = io();
let getCheckbox = document.querySelectorAll("table tr input[type='checkbox']");
let adder = document.getElementById("add");

class FormMotor {
    constructor() {
        this.linktpl = document.getElementById("link-tpl").content;
        this.formtpl = document.getElementById("form-tpl").content;
        this.navContent = document.getElementById("nav-content");
        this.navTab = document.getElementById("nav-tab");
        this.formButton = document.getElementById("open-form");
        this.insertContent = document.getElementById("insert-content");
        this.commitInsert = document.getElementById('commit');
        this.errorLog = document.getElementById("error-log");
        this.loader = document.getElementById("loader");
        console.log(this.errorLog);
        this.canPush = false;
    }
    link() {
        for(let i = 0; i < this.navTab.children.length - 1;i++){
            let child = this.navTab.children[i];
    
            console.log(child.getAttribute("href"))
            document.querySelector(child.getAttribute("href") + " #title").addEventListener("keyup",(e) => {
                if(e.target.value == ""){
                    child.innerText = "No title";
                }else{
                    child.innerText = e.target.value;
                }
            });
        }
    }
    
    
    create() {
        adder.addEventListener("click",() => {
            let copyLink = this.linktpl.cloneNode(true);
            copyLink.innerText = "No title";
    
            let aLink = copyLink.children[0]; 
    
            let content = "tab" + (this.navTab.children.length - 1);
    
            let setAttr = (attribute,value) => {
                aLink.setAttribute(attribute,value)
            }
    
            setAttr("id",content + "-tab")
            setAttr("href","#" + content);
            setAttr("aria-controls",content);
    
            let copyForm = this.formtpl.cloneNode(true);
    
            let formObj = copyForm.children[0];
    
            formObj.setAttribute("id",content);
            formObj.setAttribute("aria-labelledby",content + "-tab");
    
            this.navTab.prepend(copyLink);
            this.navContent.prepend(copyForm);
            this.link();
        })
    }
    addError(message){
        let p = document.createElement('p');
        p.innerText = message;
        this.errorLog.appendChild(p); 
        this.canPush = false;
    }
    send() {
        document.getElementById("send").addEventListener("click",() => {
            let tabPane = this.navContent.querySelectorAll("form");
            let newArray = [];
            let data = {};
            this.errorLog.innerHTML = ""

            for(let i of tabPane){
                if(i.reportValidity()){
                    this.canPush = true;
                    for(let j of i.children){
        
                        if(j.tagName == "DIV"){
                            for(let k of j.children){
                                if(k.tagName != "LABEL"){
                                    if(k.checked){
                                        data[k.name] = k.value;
                                    }
                                }
                            }
                        }else{
                            if(j.value.indexOf(", ") != -1){
                                data[j.name] = j.value.split(", ")
                            }else if(j.value.indexOf(",") != -1){
                                data[j.name] = j.value.split(",")
                            }else{
                                data[j.name] = j.value;
                            }
                        }
                    }
                    if(this.commitInsert.value != ""){
                        data["commit"] = this.commitInsert.value;
                    }else{
                        this.addError("Veuillez indiquez un message dans le commit");
                        break;
                    }

                    newArray.push(data);
                }else{
                    this.canPush = false;
                    break;
                }
            }
            if(this.canPush){
                socket.emit("send data",newArray); 
                this.loader.classList.add("show");
            } 
        })
    }

    openForm() {
        this.formButton.addEventListener("click",() => {
            if(this.insertContent.classList.contains("form-top-anim")) {
                this.insertContent.classList.remove("form-top-anim");
            }else{
                this.insertContent.classList.add("form-top-anim");
            }
        })
    }
}

let formMotor = new FormMotor();

formMotor.create();
formMotor.link();
formMotor.send();
formMotor.openForm();

if(document.getElementById("deleteButton") != undefined){
    document.getElementById("deleteButton").addEventListener("click",() => {
        let ids = [];
        for(let i of getCheckbox){
            if(i.checked){
                ids.push(i.id);
            }
        }
        socket.emit("deleted user",ids);
        this.loader.classList.add("show");
    })
}
socket.on("update table",(message) =>{
    console.log(message);
    window.location.replace("/");
})