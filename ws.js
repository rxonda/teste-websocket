const WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', (error) => {
    console.log('Connect Error: ', error);
});

client.on('connect', (connection) => {
    console.log('WebSocket Client Connected');
    
    connection.on('error', (error) => {
        console.log("Connection Error: " + error.toString());
    });
    
    connection.on('close', () => {
        console.log('Connection Closed');
    });
    
    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
    // const sendNumber = () => {
    //     if (connection.connected) {
    //         var number = Math.round(Math.random() * 0xFFFFFF);
    //         connection.sendUTF(number.toString());
    //         setTimeout(sendNumber, 1000);
    //     }
    // };

    // sendNumber();
});

client.connect('ws://localhost:8082/ws');