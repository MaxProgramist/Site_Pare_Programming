const JOIN_ROOM_CODE_INPUT = document.getElementById('joinRoomCodeInput');
const NICKNAME_INPUT = document.getElementById('nicknameInput');
const MAKE_ROOM_CODE_INPUT = document.getElementById('makeRoomCodeInput');
const COUNT_OF_PLAYERS_INPUT = document.getElementById('countOfPlayersInput');


async function JoinRoom() {
    let joinRoomCodeValue = JOIN_ROOM_CODE_INPUT.value;
    let nicknameValue = NICKNAME_INPUT.value;

    if (joinRoomCodeValue.length < 4) return PopUpWindowOfError("Incorrect code type");
    if (nicknameValue.length < 1) return PopUpWindowOfError("Incorrect nickname type");

    for (let i = 0; i < joinRoomCodeValue.length; i++) {
        let charCode = joinRoomCodeValue.charCodeAt(i);
        if (charCode < 48 || charCode > 57) return PopUpWindowOfError("Incorrect code type");
    }

    let res = await SendPost("RoomManager", "JoinRoom", {roomCode: joinRoomCodeValue, name: joinRoomCodeValue});

    if (res.status != 200) return PopUpWindowOfError(res.description);

    await sessionStorage.setItem("roomCode", joinRoomCodeValue);
    await sessionStorage.setItem("playerIndex", payload.rooms[joinRoomCodeValue].players.length-1);
    window.location.href = "playerPage.html";
}

async function MakeRoom() {
    let makeRoomCodeValue = MAKE_ROOM_CODE_INPUT.value;
    let roomPlayersCount = COUNT_OF_PLAYERS_INPUT.value;

    if (makeRoomCodeValue.length < 4) return PopUpWindowOfError("Incorrect code type");
    if (roomPlayersCount < 2) return PopUpWindowOfError("Count of players is to small (at least 2)");
    if (roomPlayersCount > 199) return PopUpWindowOfError("Count of players is to big (at most 199)");

    for (let i = 0; i < makeRoomCodeValue.length; i++) {
        let charCode = makeRoomCodeValue.charCodeAt(i);
        if (charCode < 48 || charCode > 57) return PopUpWindowOfError("Incorrect code type");
    }

    let res = await SendPost("RoomManager", "MakeRoom", {roomCode: makeRoomCodeValue, maxCountOfPlayers: roomPlayersCount});

    if (res.status != 200) return PopUpWindowOfError(res.description);

    await sessionStorage.setItem("roomCode", makeRoomCodeValue);
    window.location.href = "adminPage.html";
}

async function MakeRandomRoomCode() {
    let currentRoomCode = RandomString(4);

    MAKE_ROOM_CODE_INPUT.value = `${currentRoomCode}`;
}

function RandomString(length) {
    let result = '';
    const CHARACTERS = '0123456789';

    for (let i = 0; i < length; i++) {
        let randomInd = Math.floor(Math.random() * CHARACTERS.length);
        result += CHARACTERS.charAt(randomInd);
    }

    return result;
}

async function WakeUpServersButton() {
    await WakeUpServers();
}
