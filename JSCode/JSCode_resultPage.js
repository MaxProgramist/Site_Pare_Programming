const ROOM_CODE = sessionStorage.getItem("roomCode");
const THIS_PLAYER_INDEX = sessionStorage.getItem("playerIndex");
const THIS_ENEMY_INDEX = sessionStorage.getItem("enemyIndex");

const PLAYER_PROFILE_ICON = document.getElementById("playerIcon");
const PLAYER_PROFILE_NAME = document.getElementById("playerName");
const PLAYER_PROFILE_SCORE = document.getElementById("playerScore");
const ENEMY_PROFILE_ICON = document.getElementById("enemyIcon");
const ENEMY_PROFILE_NAME = document.getElementById("enemyName");
const ENEMY_PROFILE_SCORE = document.getElementById("enemyScore");

Start();

async function Start() {
    let allPlayers = await SendPost("RoomManager", "GetAllPlayers", { roomCode: ROOM_CODE });
    let roomInfo = await SendPost("RoomManager", "GetRoomInfo", { roomCode: ROOM_CODE });

    if (allPlayers.status == 404 && allPlayers.description == "No room with this code!") window.location.href = "index.html";

    SetUpProfiles(allPlayers, roomInfo);
}

function SetUpProfiles(allPlayers, roomInfo) {
    let playerScore = allPlayers.players[THIS_PLAYER_INDEX].score;
    let enemyScore = allPlayers.players[THIS_ENEMY_INDEX].score;
    let maxPossibleScore = roomInfo.maxTasks * 100;

    let playerName = allPlayers.players[THIS_PLAYER_INDEX].name;
    let enemyName = allPlayers.players[THIS_ENEMY_INDEX].name;
    let playerIcon = allPlayers.players[THIS_PLAYER_INDEX].skin;
    let enemyIcon = allPlayers.players[THIS_ENEMY_INDEX].skin;

    PLAYER_PROFILE_SCORE.innerHTML = `${playerScore}/${maxPossibleScore}`;
    ENEMY_PROFILE_SCORE.innerHTML = `${enemyScore}/${maxPossibleScore}`;

    PLAYER_PROFILE_ICON.src = `./Icons/icon_${playerIcon}.png`;
    PLAYER_PROFILE_NAME.innerHTML = playerName + " (Ти)";
    ENEMY_PROFILE_ICON.src = `./Icons/icon_${enemyIcon}.png`;
    ENEMY_PROFILE_NAME.innerHTML = enemyName;
}