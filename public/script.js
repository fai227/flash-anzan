const ws = new WebSocket("ws://" + location.hostname + ":8081");

ws.onopen = () => {
    console.log("server connected");

    start();
}

ws.onmessage = (e) => {
    let command = e.data.charAt(0);
    let data = e.data.slice(1);
    interpreteCommand(command, JSON.parse(data));
}

// #region ゲーム関連関数
function setPlayers(playerNames) {
    let playerNamesElement = document.getElementById("playerNames");

    playerNamesElement.innerHTML = "";
    playerNames.forEach(name => {
        playerNamesElement.innerHTML += name + "<br>";
    });
}
function setRoomName(name) {
    document.getElementById("roomNameBox").innerHTML = name;
}
function startProblem(array, interval) {
    let problemElement = document.getElementById("problemBox");

    problemElement.innerHTML = "③";

    setTimeout(() => {
        problemElement.innerHTML = "②";
    }, 1000);

    setTimeout(() => {
        problemElement.innerHTML = "①";
    }, 2000);

    setTimeout(() => {
        array.forEach((num, i) => {
            setTimeout(() => {
                problemElement.innerHTML = num;
            }, i * Number(interval) * 1000);
        });
    }, 3000);

    setTimeout(() => {
        changeScene(sceneList.answer);
    }, array.length * Number(interval) * 1000 + 3000);
}

// #endregion


function sendMessage(command, data) {
    // 接続されていないときは送らない
    if (ws.readyState != 1) throw "not connected";

    if (data == undefined) {
        ws.send(command);
    }
    else {
        ws.send(command + JSON.stringify(data));
    }

    return true;
}


// #region コマンド送信関数一覧
function searchRoom() {
    sendMessage("r", {
        playerName: playerName,
        roomName: roomName
    });
}
function editGameSetting() {
    // ゲームの状態を取得
    let property = {};
    // 送信
    sendMessage("s", property);
}
function startGame() {
    sendMessage("b");
}
function sendAnswer(value) {
    sendMessage("a", value);
}
// #endregion

// #region コマンド受信関数
function interpreteCommand(command, data) {
    console.log(`${command}コマンド取得`);
    switch (command) {
        case "n":  // 部屋設定通知
            setPlayers(data.playerNames);
            setRoomName(data.roomName);
            changeScene(sceneList.room);
            break;

        case "j":  // プレイヤー入室通知
            setPlayers(data);
            break;

        case "p":  // 問題受け取り
            startProblem(data.problem, data.interval);
            changeScene(sceneList.problem);
            break;

        case "r": // 結果通知
            // 結果通知
            break;

        case "s":
            setSetting(data.editedProperties);
            break;

        case "b":
            // ゲーム開始
            break;

        case "e":  // エラーでリロード
            alert(data);
            location.reload();
            break;
    }
}
// #endregion

// #region スタート関数
function start() {
    playerName = localStorage.getItem("playerName");
    if (playerName) {
        document.getElementById("playerName").value = playerName;
    }
    changeScene(sceneList.home);
}

function startGame() {
    playerName = document.getElementById("playerName").value;
    roomName = document.getElementById("roomName").value;
    localStorage.setItem("playerName", playerName);
    searchRoom();

    // ロード開始
    changeScene(sceneList.load);
}
// #endregion