#!/usr/bin/env node
let {createServer} = require("wss");

createServer((ws) => {
    setTimeout((ws) => {
        ws.send("Hey!");
    }, 2000, ws);
    ws.on("message", (data) => {
        console.log(data.toString());
        setTimeout((ws) => {
            ws.send(data.toString());
        }, 1000, ws);
    });
}).listen(8001, () => {
    console.log("Server running...");
});