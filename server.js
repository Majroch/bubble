#!/usr/bin/env node
let {createServer} = require("wss");

createServer((ws) => {
    ws.on("message", (data) => {
        console.log(data.toString());
        setTimeout((ws) => {
            ws.send(data.toString());
        }, 1000, ws);
    });
}).listen(8001, () => {
    console.log("Server running...");
});