#!/usr/bin/env node
let WebSocketServer = require("ws").Server;
let wss = new WebSocketServer({
    port: 8001,
});

let messages_stack = [];
let client_id = 0;

setInterval(() => {
    console.log(messages_stack);
}, 1000);

function loggedIn(ws) {
    ws.whoami = ws.whoami.replace("Guest", "Listener");
    ws.send("Logged in as `Listener`!");
    messages_stack.forEach(saved => {
        if(ws.listener == "") {
            ws.listener = saved[0];
            ws.send("New user found with problem! Messages from him:");
        }
    });
    let messages_stack_copy = JSON.parse(JSON.stringify(messages_stack));
    messages_stack.forEach((saved, index, array) => {
        if(ws.listener == saved[0]) {
            ws.send(saved[1]);
            let ind = messages_stack_copy.indexOf(saved);
            messages_stack_copy.splice(ind, 1);
        }
    });
    messages_stack = JSON.parse(JSON.stringify(messages_stack_copy));
    if(ws.listener != "") {
        wss.clients.forEach(user => {
            if(user.whoami == ws.listener) {
                user.send("One user connected to you!");
                user.listener = ws.whoami;
            }
        });
    }
}

wss.on("connection", (ws) => {
    ws.whoami = "Guest" + client_id.toString();
    ws.listener = "";
    client_id += 1;
    setTimeout((ws) => {
        ws.send("Hey! Czy potrzebujesz pomocy? Napisz co potrzebujesz!");
    }, 2000, ws);
    ws.on("message", (data) => {
        let message = data.toString();
        if(message[0] == "/") {
            // This is some kind of command for server
            message = message.split(" ");
            if(message[0] == "/help") {
                ws.send("No help menu!");
            } else if(message[0] == "/bubble") {
                // console.log("Bubble clicked!");
            } else if(message[0] == "/window_close") {
                // console.log("Window Closed!");
            } else if(message[0] == "/login") {
                if(!ws.whoami.includes("Listener")) {
                    if(message[1] == "test" && message[2] == "test") {
                        loggedIn(ws);
                    } else {
                        ws.send("Wrong login or password!");
                    }
                } else {
                    ws.send("You've been already logged!");
                }
            } else if(message[0] == "/whoami") {
                ws.send(ws.whoami);
            } else if(message[0] == "/close") {
                if(ws.listener != "") {
                    wss.clients.forEach(user => {
                        if(ws.listener == user.whoami) {
                            user.listener = "";
                            user.send("User Disconnected!");
                            if(user.whoami.includes("Listener")) {
                                loggedIn(user);
                            }
                        }
                    });
                    ws.listener = "";
                }
                if(ws.whoami.includes("Listener"))
                    ws.send("You've been logged out!");
                ws.whoami = "Guest" + client_id.toString();
                client_id += 1;
            } else {
                // console.log("Command: " + message[0] + " not found!");
                ws.send("Command: " + message[0] + " not found!");
            }
        } else {
            // Normal message :P
            // console.log(message);
            if(ws.listener == "") {
                if(ws.whoami.includes("Guest")) {
                    let found = false;
                    wss.clients.forEach(element => {
                        if(element.whoami.includes("Listener") && element.listener == "") {
                            element.send(message);
                            ws.listener = element.whoami;
                            element.listener = ws.whoami;
                            found = true;
                        }
                    });
                    if(!found) {
                        ws.send("Cannot find any Listeners. Please be in patient.")
                        messages_stack[messages_stack.length] = [ws.whoami, message];
                    }
                } else {
                    ws.send("You don't have any connections pending...");
                }
            } else {
                wss.clients.forEach(user => {
                    if(user.whoami == ws.listener) {
                        user.send(message);
                    }
                });
            }
        }
        ws.on("close", () => {
            if(ws.listener != "") {
                wss.clients.forEach(user => {
                    if(ws.listener == user.whoami) {
                        user.send("User Disconnected!")
                        ws.listener = "";
                        user.listener = "";
                    }
                });
            }
        });
    });
});