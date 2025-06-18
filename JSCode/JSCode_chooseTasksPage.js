const ROOM_CODE = sessionStorage.getItem("roomCode");
const THIS_PLAYER_INDEX = sessionStorage.getItem("playerIndex");
const THIS_PLAYER_ENEMY_INDEX = sessionStorage.getItem("enemyIndex");
const GRADE_NUM = sessionStorage.getItem("gradeNum");
const SET_OF_TASKS = sessionStorage.getItem("setOfTasks");

const PLAYER_PROFILE_ICON = document.getElementById("playerIcon");
const PLAYER_PROFILE_NAME = document.getElementById("playerName");
const ENEMY_PROFILE_ICON = document.getElementById("enemyIcon");
const ENEMY_PROFILE_NAME = document.getElementById("enemyName");

const DIV_LIST_OF_CARDS = document.getElementById("cardsList");
const ENEMY_SPAN_LIST_OF_TASKS = document.getElementById("enemy_taskLetters");
const PLAYER_SPAN_LIST_OF_TASKS = document.getElementById("player_taskLetters");

var listOfCardsLetter = [];
var listOfPlayerLetter = [];
var listOfEnemyLetter = [];

var cardMade = false;
var cardIsOpen = false;

Loop();
SetUpProfiles();


async function SetUpProfiles() {
    let allPlayers = await SendPost("RoomManager", "GetAllPlayers", { roomCode: ROOM_CODE });

    let playerProfile = allPlayers.players[THIS_PLAYER_INDEX];
    let enemyProfile = allPlayers.players[playerProfile.enemy];

    PLAYER_PROFILE_ICON.src = ICONS_LIST[playerProfile.skin];
    PLAYER_PROFILE_NAME.innerHTML = playerProfile.name + " (Ти)";
    ENEMY_PROFILE_ICON.src = ICONS_LIST[enemyProfile.skin];
    ENEMY_PROFILE_NAME.innerHTML = enemyProfile.name;
}

async function Loop() {
    while (true) {
        await SomeAsyncFunction();
        await Delay(75);
    }
}

function Delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function SomeAsyncFunction() {
    let allPlayers = await SendPost("RoomManager", "GetAllPlayers", { roomCode: ROOM_CODE });
    let roomInfo = await SendPost("RoomManager", "GetRoomInfo", { roomCode: ROOM_CODE });

    if (allPlayers.status == 404 && allPlayers.description == "No room with this code!") window.location.href = "index.html";
    if (allPlayers.status != 200) PopUpWindow(allPlayers.description);
    if (roomInfo.status != 200) PopUpWindow(roomInfo.description);

    let myTasks = allPlayers.players[THIS_PLAYER_INDEX].tasks;
    let enemyTasks = allPlayers.players[THIS_PLAYER_ENEMY_INDEX].tasks;

    if (myTasks.length == roomInfo.maxTasks && enemyTasks.length == payload.maxTasks) {
        await sessionStorage.setItem("gradeNum", payload.rooms[ROOM_CODE].grade);
        await sessionStorage.setItem("setOfTasks", payload.rooms[ROOM_CODE].numberOfTasksSet);
        await sessionStorage.setItem("playerIndex", THIS_PLAYER_INDEX);
        await sessionStorage.setItem("enemyIndex", payload.rooms[ROOM_CODE].players[THIS_PLAYER_INDEX].enemy);

        window.location.href = "programmingPage.html";
    }

    if (allPlayers[THIS_PLAYER_INDEX].cardGive) {
        //TODO: Delete select card

        let playerTaskLatter = document.createElement("span");
        playerTaskLatter.innerHTML = myCurrentTask;
        PLAYER_SPAN_LIST_OF_TASKS.appendChild(playerTaskLatter);
        listOfPlayerLetter.push(myCurrentTask);

        let res = await SendPost("RoomManager", "ReceiveTask", { roomCode: ROOM_CODE, playerIndex: THIS_PLAYER_INDEX });
    
        if (res.status != 200) return PopUpWindow(res.description);
    }

    //TODO: Remake it to new fetch function ⬇️
    if (!cardMade) {
        for (let i = 0; i < 16; i++) {
            let taskChar = String.fromCharCode('A'.charCodeAt(0) + i);
            let res = await FetchTask(GRADE_NUM, SET_OF_TASKS, taskChar);
            CreateCardWithTask(res, taskChar);
        }
        cardMade = !cardMade;
    }
}

function CreateCardWithTask(task, taskPeriod) {
    let taskCard = document.createElement("div");
    taskCard.setAttribute('class', 'chooseTasks_cardOfTask');
    taskCard.id = taskPeriod;

    let selectButton = document.createElement("button");
    let infoButton = document.createElement("button");
    let taskLetter = document.createElement("p");
    let taskName = document.createElement("p");

    taskLetter.innerHTML = `<font size="3"> Задача ${taskPeriod} </font>`;
    taskName.innerHTML = `<font size="4"> ${task.name} </font>`;

    selectButton.innerHTML = "✓";
    selectButton.setAttribute('class', 'chooseTasks_cardOfTask_button_select');
    selectButton.onclick = async function () {
        let res = await SendPost("RoomManager", "GiveTaskToPlayer", { roomCode: ROOM_CODE, playerIndex: THIS_PLAYER_ENEMY_INDEX, task: taskPeriod });

        if (res.status != 200) return PopUpWindow(res.description);

        //TODO: Delete select card

        let enemyTaskLatter = document.createElement("span");
        enemyTaskLatter.innerHTML = taskPeriod;
        ENEMY_SPAN_LIST_OF_TASKS.appendChild(enemyTaskLatter);
    };
    infoButton.innerHTML = "I";
    infoButton.setAttribute('class', 'chooseTasks_cardOfTask_button_info');
    infoButton.onclick = () => FullTaskField(task, taskPeriod);

    taskCard.appendChild(taskLetter);
    taskCard.appendChild(taskName);
    taskCard.appendChild(selectButton);
    taskCard.appendChild(infoButton);

    listOfCardsLetter.push(taskCard);

    DIV_LIST_OF_CARDS.appendChild(taskCard);
}

function FullTaskField(task, taskPeriod) {
    if (cardIsOpen) return;

    let fullTask = document.createElement("div");
    fullTask.setAttribute('class', 'chooseTasks_fullTask');

    let closeButton = document.createElement("button");
    let taskLetter = document.createElement("p");
    let taskName = document.createElement("p");
    let taskCondition = document.createElement("p");

    taskLetter.innerHTML = ` <font size="3"> Задача ${taskPeriod} </font> `;
    taskName.innerHTML = ` <font size="4"> ${task.name} </font> `;
    taskCondition.innerHTML = ` <font size="3"> ${task.description} </font> `;

    taskLetter.setAttribute('class', 'chooseTasks_fullTask_p_letter');
    taskName.setAttribute('class', 'chooseTasks_fullTask_p_name');
    taskCondition.setAttribute('class', 'chooseTasks_fullTask_p_condition');

    closeButton.innerHTML = "✕";
    closeButton.onclick = function () {
        fullTask.remove();
        cardIsOpen = false;
    };
    closeButton.setAttribute('class', 'chooseTasks_fullTask_button_close');

    fullTask.appendChild(taskLetter);
    fullTask.appendChild(taskName);
    fullTask.appendChild(taskCondition);
    fullTask.appendChild(closeButton);

    document.body.appendChild(fullTask);
    cardIsOpen = true;
}
