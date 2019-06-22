let socket = io();
let getCheckbox = document.querySelectorAll("table tr input[type='checkbox']");
let forTabTitle = document.getElementById("nav-tab");
let adder = document.getElementById("add");
let navContent = document.getElementById("nav-content");

let linktpl = document.getElementById("link-tpl").content;
let formtpl = document.getElementById("form-tpl").content;

link = () => {
    for(let i = 0; i < forTabTitle.children.length - 1;i++){
        let child = forTabTitle.children[i];

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
create = () =>{
    adder.addEventListener("click",() => {
        let copyLink = linktpl.cloneNode(true);
        copyLink.innerText = "No title";

        let aLink = copyLink.children[0]; 

        let content = "tab" + (forTabTitle.children.length - 1);

        let setAttr = (attribute,value) => {
            aLink.setAttribute(attribute,value)
        }

        setAttr("id",content + "-tab")
        setAttr("href","#" + content);
        setAttr("aria-controls",content);

        let copyTpl = formtpl.cloneNode(true);

        let formObj = copyTpl.children[0];

        formObj.setAttribute("id",content);
        formObj.setAttribute("aria-labelledby",content + "-tab");

        forTabTitle.prepend(copyLink);
        navContent.prepend(copyTpl);
        link();
    })
}
create();
link();

if(document.getElementById("deleteButton") != undefined){
    document.getElementById("deleteButton").addEventListener("click",() => {
        let ids = [];
        for(let i of getCheckbox){
            if(i.checked){
                ids.push(i.id);
            }
        }
        socket.emit("deleted user",ids);
    })
}
socket.on("update table",(message) =>{
    console.log(message);
    window.location.replace("/");
})