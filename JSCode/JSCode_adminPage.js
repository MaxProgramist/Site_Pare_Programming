const ROOM_CODE = sessionStorage.getItem("roomCode");

const CODE_TEXT_FIELD = document.getElementById("code");
const GRADE_TEXT_FIELD = document.getElementById("grade");
const SET_OF_TASKS_TEXT_FIELD = document.getElementById("setOfTasks");
const PLAYER_DIV_LIST = document.getElementById("playersGrid");
const COUNT_OF_TASKS_INPUT = document.getElementById("countOfTasks");
const TIME_FIELD = document.getElementById("timeField");

const GRADE_DIV_LIST = document.getElementById("gradeList");
const SET_OF_TASKS_DIV_LIST_GRADE_8 = document.getElementById("setList_grade_8");
const SET_OF_TASKS_DIV_LIST_GRADE_9 = document.getElementById("setList_grade_9");
const SET_OF_TASKS_DIV_LIST_GRADE_10 = document.getElementById("setList_grade_10");
const SET_OF_TASKS_DIV_LIST_GRADE_11 = document.getElementById("setList_grade_11");

CODE_TEXT_FIELD.innerText = "Код: " + ROOM_CODE;
GRADE_TEXT_FIELD.innerText = "Клас:" + 8;
SET_OF_TASKS_TEXT_FIELD.innerText = "Тема: Лінійні алгоритми 1";
COUNT_OF_TASKS_INPUT.value = 8;
TIME_FIELD.innerText = 45;

GRADE_DIV_LIST.style.display = "none";
SET_OF_TASKS_DIV_LIST_GRADE_8.style.display = "none";
SET_OF_TASKS_DIV_LIST_GRADE_9.style.display = "none";
SET_OF_TASKS_DIV_LIST_GRADE_10.style.display = "none";
SET_OF_TASKS_DIV_LIST_GRADE_11.style.display = "none";

let divToPlayer = [];
let timeForTasksInMinutes = 45;

let currentSetOfTasks = "linar_1";
let currentGrade = 8;
let currentMaxTasks = 8;

var currentRoomPlayers = 0;

Loop();

async function Loop() {
    let wakeUpCounter = 0;

    while (true) {
        await SomeAsyncFunction();
        await Delay(100);
        if (wakeUpCounter >= 200){
            await WakeUpServers();
            wakeUpCounter = -1;
        }

        wakeUpCounter++;
    }
}

function Delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function SomeAsyncFunction() {
    let payload = await SendPost("RoomManager", "GetAllPlayers", { roomCode: ROOM_CODE });

    if (payload.status == 404 && payload.description == "No room with this code!") window.location.href = "index.html";
    if (payload.status != 200) PopUpWindow(payload.description);

    TIME_FIELD.innerText = timeForTasksInMinutes;
    COUNT_OF_TASKS_INPUT.value = clamp(COUNT_OF_TASKS_INPUT.value, 1, 8);

    console.log(payload);

    for (let i = 0; i < divToPlayer.length; i++)
        UpdatePlayerSkin(payload.players, i);

    while (payload.players.length > currentRoomPlayers) {
        NewPlayerIcon(payload.players, currentRoomPlayers);
        currentRoomPlayers++;
    }
}

function UpdatePlayerSkin(payload, playerIndex) {
    let playerDiv = divToPlayer[playerIndex];

    let playerSkin = payload[playerIndex].icon;
    let playerName = payload[playerIndex].name;

    let imgInsideDiv = playerDiv.querySelector("img");
    let pInsideDiv = playerDiv.querySelector("p");
    imgInsideDiv.src = ICONS_LIST[playerSkin];
    pInsideDiv.textContent = playerName;
}

function NewPlayerIcon(payload, playerIndex) {
    let playerBox = document.createElement("div");
    playerBox.setAttribute('class', 'classField_1 admin_player_playerIcon');

    let playerBoxSkinImage = document.createElement("img");
    playerBoxSkinImage.src = ICONS_LIST[0];
    playerBoxSkinImage.setAttribute('class', 'universal_iconImage');

    let playerBoxName = document.createElement("p");
    playerBoxName.textContent = payload[playerIndex].name;
    playerBoxName.setAttribute('class', 'admin_player_playerIcon_name');

    playerBox.appendChild(playerBoxSkinImage);
    playerBox.appendChild(playerBoxName);

    divToPlayer[playerIndex] = playerBox;

    PLAYER_DIV_LIST.appendChild(playerBox);
}

function GradeMenu() {
    if (GRADE_DIV_LIST.style.display === "none") {
        GRADE_DIV_LIST.style.display = "block";
    } else {
        GRADE_DIV_LIST.style.display = "none";
    }

    SET_OF_TASKS_DIV_LIST_GRADE_8.style.display = "none";
    SET_OF_TASKS_DIV_LIST_GRADE_9.style.display = "none";
    SET_OF_TASKS_DIV_LIST_GRADE_10.style.display = "none";
    SET_OF_TASKS_DIV_LIST_GRADE_11.style.display = "none";
}

async function SetOfTasksMenu() {
    GRADE_DIV_LIST.style.display = "none";

    if (currentGrade == 8) {
        SET_OF_TASKS_DIV_LIST_GRADE_9.style.display = "none";
        SET_OF_TASKS_DIV_LIST_GRADE_10.style.display = "none";
        SET_OF_TASKS_DIV_LIST_GRADE_11.style.display = "none";
        if (SET_OF_TASKS_DIV_LIST_GRADE_8.style.display === "none")
            SET_OF_TASKS_DIV_LIST_GRADE_8.style.display = "block";
        else
            SET_OF_TASKS_DIV_LIST_GRADE_8.style.display = "none";
    }
    else if (currentGrade == 9) {
        SET_OF_TASKS_DIV_LIST_GRADE_8.style.display = "none";
        SET_OF_TASKS_DIV_LIST_GRADE_10.style.display = "none";
        SET_OF_TASKS_DIV_LIST_GRADE_11.style.display = "none";
        if (SET_OF_TASKS_DIV_LIST_GRADE_9.style.display === "none")
            SET_OF_TASKS_DIV_LIST_GRADE_9.style.display = "block";
        else
            SET_OF_TASKS_DIV_LIST_GRADE_9.style.display = "none";
    }
    else if (currentGrade == 10) {
        SET_OF_TASKS_DIV_LIST_GRADE_9.style.display = "none";
        SET_OF_TASKS_DIV_LIST_GRADE_8.style.display = "none";
        SET_OF_TASKS_DIV_LIST_GRADE_11.style.display = "none";
        if (SET_OF_TASKS_DIV_LIST_GRADE_10.style.display === "none")
            SET_OF_TASKS_DIV_LIST_GRADE_10.style.display = "block";
        else
            SET_OF_TASKS_DIV_LIST_GRADE_10.style.display = "none";
    }
    else if (currentGrade == 11) {
        SET_OF_TASKS_DIV_LIST_GRADE_8.style.display = "none";
        SET_OF_TASKS_DIV_LIST_GRADE_10.style.display = "none";
        SET_OF_TASKS_DIV_LIST_GRADE_9.style.display = "none";
        if (SET_OF_TASKS_DIV_LIST_GRADE_11.style.display === "none")
            SET_OF_TASKS_DIV_LIST_GRADE_11.style.display = "block";
        else
            SET_OF_TASKS_DIV_LIST_GRADE_11.style.display = "none";
    }
}

async function ChangeGradeOfRoom(numberOfGrade) {
    currentGrade = numberOfGrade;
    GRADE_TEXT_FIELD.innerText = "Клас:" + numberOfGrade;
}

async function AddTimeForTasks(timeChanger) {
    if ((timeChanger > 0 && timeForTasksInMinutes < 120) || (timeChanger < 0 && timeForTasksInMinutes > 5))
        timeForTasksInMinutes += timeChanger;
    TIME_FIELD.innerText = timeForTasksInMinutes;
}

async function ChangeSetOfTasksOfRoom(setOfTasks) {
    currentSetOfTasks = setOfTasks;
    SET_OF_TASKS_TEXT_FIELD.innerText = "Тема: " + THEME_LIST[setOfTasks];
}

async function StartGame() {
    let payload = await SendPost("RoomManager", "GetAllPlayers", { roomCode: ROOM_CODE });

    if (payload.players.length < 1)
        return PopUpWindow("Count of players is to small (at least 2)");

    let res = await SendPost("RoomManager", "StartGame", { roomCode: ROOM_CODE, setOfTasks: currentSetOfTasks, maxTasks: parseInt(COUNT_OF_TASKS_INPUT.value), grade: parseInt(currentGrade), timeForTasks: parseInt(timeForTasksInMinutes) });

    if (res.status != 200) return PopUpWindow(res.description);

    console.log("Spectate");

    window.location.href = "spectatorPage.html";
}

const clamp = (value, min, max) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}
