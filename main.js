const RoomManager = require("./script/room");

// #region Express
const express = require("express");
const app = express();
const expressPort = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.json());


app.listen(expressPort, () => {
    console.log(`web server started with port ${expressPort}`);
});
// #endregion

// #region Websocket
const { WebSocketServer } = require("ws");
const websocketPort = 8081;
const wss = new WebSocketServer({ port: websocketPort });

wss.on("connection", (ws) => {
    ws.onmessage = (e) => {
        interpreteCommand(ws, e.data.charAt(0), JSON.parse(e.data.slice(1)));
    }

    ws.onclose = (e) => {
        // プレイヤー切断
        ws.room.disconnect(ws);

        let room = ws.room;
        let length = room.wsList.length;

        // 参加人数が1人の時はゲーム終了
        if (length == 1) {
            sendError(room.wsList[0], "参加人数が1人になったのでルームを解散します。");
        }
        // プレイヤーが居なくなったときはリストから削除
        else if (ws.room.length == 0) {
            RoomManager.deleteRoom(room);
        }
    }
})
// #endregion

function sendMessage(ws, command, data) {
    ws.send(command + JSON.stringify(data));
}


// #region コマンド受信関数
function interpreteCommand(ws, command, data) {
    console.log(`${command}コマンド取得`);
    switch (command) {
        case "r":  // 部屋検索
            getRCommand(ws, data);
            break;

        case "s":  // ゲーム設定変更
            // ゲーム設定変更
            break;

        case "b":  // ゲームスタート

            break;

        case "a":  // 回答取得

            break;
    }
}
function getRCommand(ws, data) {
    // プレイヤー名設定
    ws.playerName = data.playerName;

    // 部屋設定
    let roomExist = RoomManager.existRoom(data.roomName);
    if (!roomExist) {  // 1人目なので作成
        RoomManager.createRoom(data.roomName);
    }

    // 参加情報を返す
    let room = RoomManager.joinRoom(data.roomName, ws);
    let names = room.getPlayerNames();

    // 2人目なので通知
    if (roomExist) {
        room.wsList.forEach(element => {
            sendMessage(element, "j", names);
        });
    }

    // wsにルームを設定
    ws.room = room;

    sendMessage(ws, "n", {
        playerNames: names,
        roomName: data.roomName
    });
}
// #endregion

// #region コマンド送信関数
function sendError(ws, content) {
    sendMessage(ws, "e", content);
}
// #endregion