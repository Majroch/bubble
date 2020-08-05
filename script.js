let ws = new WebSocket("ws://localhost:8001");

document.body.onload = () => {
    let content = document.querySelector(".textbox .content");

    function insertText(pos, msg) {
        content.innerHTML += "<div class='msg float "+pos+"'>"+msg+"</div>";
        content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' })
    }
    let mainInput = document.querySelector("#mainInput");

    mainInput.onkeyup = event => {
        if(event.key == "Enter") {
            if(!mainInput.value == "") {
                ws.send(mainInput.value);
                insertText("right", mainInput.value);
                mainInput.value = "";
            }
        }
    };

    ws.onmessage = message => {
        insertText("left", message.data);
    };

    let bubble = document.querySelector(".bubble");
    let textbox = document.querySelector(".textbox");
    bubble.onclick = event => {
        textbox.classList.toggle("hide");
        bubble.classList.toggle("hide");
    };

    let close = document.querySelector(".close");
    close.onclick = event => {
        textbox.classList.toggle("hide");
        bubble.classList.toggle("hide");
    };
};