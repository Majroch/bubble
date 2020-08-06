let ws = new WebSocket("ws://"+window.location.hostname+":8001");
let error = 0;
let window_closed = 1;
let count_unseen_messages = 0;
const old_title = document.title;
document.body.onload = () => {
    let content = document.querySelector(".textbox .content");

    function scrollToBottom() {
        content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' })
    }

    function insertText(pos, msg) {
        content.innerHTML += "<div class='msg float "+pos+"'>"+msg+"</div>";
        scrollToBottom();
    }
    let mainInput = document.querySelector("#mainInput");


    ws.onerror = () => {
        error = 1;
        insertText("left", "Some error when connecting to server!");
    };
    ws.onclose = () => {
        error = 1;
        insertText("left", "Closed Connection to server!");
    };
    mainInput.onkeyup = event => {
        if(event.key == "Enter") {
            if(!mainInput.value == "") {
                insertText("right", mainInput.value);
            }
            if(error == 0) {
                ws.send(mainInput.value);
            } else {
                insertText("left", "Cannot send message to server... Sorry about that :(")
            }
            mainInput.value = "";
        }
    };

    ws.onmessage = message => {
        insertText("left", message.data);
        if(window_closed == 1) {
            let badge = document.querySelector(".badge");
            badge.classList.remove("hide");
            count_unseen_messages += 1;
            badge.innerHTML = count_unseen_messages;
            if(document.title == old_title)
                document.title = "(New Messages) " + document.title;
            let new_message_sound = new Audio("sound.mp3");
            new_message_sound.play();
        }
    };

    let bubble = document.querySelector(".bubble");
    let textbox = document.querySelector(".textbox");
    bubble.onclick = event => {
        if(error == 0) {
            let badge = document.querySelector(".badge");
            badge.classList.add("hide");
            count_unseen_messages = 0;
            document.title = old_title;
            ws.send("/bubble");
            textbox.classList.toggle("hide");
            bubble.classList.toggle("hide");
            if(window_closed == 0) {
                window_closed = 1;
            } else {
                window_closed = 0;
            }
            scrollToBottom();
        }
    };

    let close = document.querySelector(".close");
    close.onclick = event => {
        if(error == 0)
            ws.send("/window_close");
        textbox.classList.toggle("hide");
        bubble.classList.toggle("hide");
        if(window_closed == 0) {
            window_closed = 1;
        } else {
            window_closed = 0;
        }
    };
};