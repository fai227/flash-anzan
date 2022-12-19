class Room {
    constructor(name) {
        this.name = name;
        this.wsList = [];
    }

    join(ws) {
        this.wsList.push(ws);

        return this;
    }

    disconnect(ws) {
        let index = this.wsList.indexOf(ws);

        if (index < 0) return;

        this.wsList.splice(index, 1);
    }

    getPlayerNames() {
        let names = [];
        this.wsList.forEach(ws => {
            names.push(ws.playerName);
        })

        return names;
    }
}

module.exports = {
    roomList: [],
    existRoom(name) {
        for (let i = 0; i < this.roomList.length; i++) {
            let room = this.roomList[i];
            if (room.name == name) {
                return true;
            }
        }
        return false;
    },
    createRoom(name) {
        this.roomList.push(new Room(name));
    },
    deleteRoom(room) {
        let index = this.roomList.indexOf(room);

        if (index < 0) return;

        this.roomList.splice(index, 1);
    },
    joinRoom(name, ws) {
        for (let i = 0; i < this.roomList.length; i++) {
            let room = this.roomList[i];
            if (room.name == name) {
                room.join(ws);
                return room;
            }
        }

        return false;
    }
}