const ROOM_CODE = sessionStorage.getItem("roomCode");

const PLAYER_DIV_LIST = document.getElementById("playersGrid");

let divToPlayer = [];
let playersCircles = [];

MakePlayersGroups();
Loop();


async function Loop() {
    while (true) {
        await SomeAsyncFunction();
        await Delay(1000);
        await WakeUpServers();
    }
}

function Delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function SomeAsyncFunction() {
    let allPlayers = await SendPost("RoomManager", "GetAllPlayers", { roomCode: ROOM_CODE });
    let roomInfo = (await SendPost("RoomManager", "GetRoomInfo", { roomCode: ROOM_CODE })).roomInfo;

    if (allPlayers.status == 404 && allPlayers.description == "No room with this code!") window.location.href = "index.html";
    if (allPlayers.status != 200) PopUpWindow(allPlayers.description);

    for (let i = 0; i < allPlayers.players.length; i++)
        ChangePlayersScore(allPlayers, roomInfo, i);
}

function ChangePlayersScore(playerInfo, roomInfo, playerIndex) {
    let playerDiv = divToPlayer[playerIndex];

    let playerScore = playerInfo.players[playerIndex].score;

    let pInsideDiv = playerDiv.querySelectorAll('div.spectator_progressCircle_text');
    pInsideDiv[0].textContent = `${playerScore}/<br>${roomInfo.maxTasks * 100}`;

    SetProgress(playerScore/roomInfo.maxTasks*100 ,playerIndex);
}

async function MakePlayersGroups() {
    let payload = await SendPost("RoomManager", "GetAllPlayers", { roomCode: ROOM_CODE });

    if (payload.status == 404 && payload.description == "No room with this code!") window.location.href = "index.html";
    if (payload.status != 200) return PopUpWindow(payload.description);

    let usedPlayers = [];
    for (let i = 0; i < payload.players.length; i++) {
        if (usedPlayers.includes(i)) continue;

        NewPlayerIcon(payload, i);
        NewPlayerIcon(payload, payload.players[i].enemy);
        usedPlayers.push(i);
        usedPlayers.push(payload.rooms[ROOM_CODE].players[i].enemy);
    }
}

function SetProgress(percentage, circleIndex) {
    const CIRCLE = playersCircles[circleIndex];
    const angle = (percentage / 100) * 360;

    let color;
    if (percentage < 50) {
        const green = Math.round((percentage / 50) * 255);
        color = `rgb(255, ${green}, 0)`;
    } else {
        const red = Math.round(255 - ((percentage - 50) / 50) * 255);
        color = `rgb(${red}, 255, 0)`;
    }

    CIRCLE.style.setProperty('--percentage', `${angle}deg`);
    CIRCLE.style.setProperty('--progress-color', color);
}

function NewPlayerIcon(payload, playerIndex) {
    let playerName = payload.players[playerIndex].name;
    let playerSkin = payload.players[playerIndex].skin; 

    let playerBox = document.createElement("div");
    playerBox.setAttribute('class', 'classField_1 spectator_playerIcon');

    let playerBoxSkinImage = document.createElement("img");
    playerBoxSkinImage.src = ICONS_LIST[playerSkin];
    playerBoxSkinImage.setAttribute('class', 'universal_iconImage');

    let playerBoxName = document.createElement("span");
    playerBoxName.innerText = `${playerName}`;
    playerBoxName.setAttribute('class', 'spectator_playerIcon_name');

    let playerBoxScore = document.createElement("div");
    playerBoxScore.innerText = `0/${payload.rooms[ROOM_CODE].maxCountOfTasks * 100}`;
    playerBoxName.setAttribute('class', 'spectator_progressCircle_text');

    let progressCircle = document.createElement("div");
    playerBox.setAttribute('class', 'spectator_progressCircle');

    let playerInfo = document.createElement("div");
    playerBox.setAttribute('class', 'spectator_playerIcon_info');

    progressCircle.appendChild(playerBoxScore);

    playerInfo.appendChild(playerBoxSkinImage);
    playerInfo.appendChild(document.createElement("br"));
    playerInfo.appendChild(playerBoxName);

    playerBoxProfile.appendChild(playerInfo);
    playerBoxProfile.appendChild(progressCircle);

    divToPlayer[playerIndex] = playerBox;
    playersCircles[playerIndex] = progressCircle;

    PLAYER_DIV_LIST.appendChild(playerBox);
}