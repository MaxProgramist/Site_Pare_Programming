const ROOM_CODE = sessionStorage.getItem("roomCode");
const GRADE_NUM = sessionStorage.getItem("gradeNum");
const SET_OF_TASKS = sessionStorage.getItem("setOfTasks");
const THIS_PLAYER_INDEX = sessionStorage.getItem("playerIndex");
const THIS_ENEMY_INDEX = sessionStorage.getItem("enemyIndex");

const EDITOR = document.getElementById("editor");
const TASK_FIELD = document.getElementById("tasksField");
const TASK_BUTTONS_FIELD = document.getElementById("tasksButtons");
const RESULT_FIELD = document.getElementById("resultField");
const TIMER_FIELD = document.getElementById("timer");

const PLAYER_PROFILE_ICON = document.getElementById("playerIcon");
const PLAYER_PROFILE_NAME = document.getElementById("playerName");
const PLAYER_PROFILE_SCORE = document.getElementById("playerScore");
const ENEMY_PROFILE_ICON = document.getElementById("enemyIcon");
const ENEMY_PROFILE_NAME = document.getElementById("enemyName");
const ENEMY_PROFILE_SCORE = document.getElementById("enemyScore");

const BOM_CHAR = '\uFEFF';

let myTasks;
let enemyTasks;

let currentTask = "A";

let setUpProfiles = false;

let resultScoresOnTasks = {};
let resultTextOnTasks = new Map();
let codeOnTasks = new Map();

Loop();

async function Loop() {
    while (true) {
        await SomeAsyncFunction();
        await Delay(1000);
    }
}

function Delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function SomeAsyncFunction() {
    let allPlayers = await SendPost("RoomManager", "GetAllPlayers", { roomCode: ROOM_CODE });
    let roomInfoPost = await SendPost("RoomManager", "GetRoomInfo", { roomCode: ROOM_CODE });
    let roomInfo = roomInfoPost.roomInfo;

    if (allPlayers.status == 404 && allPlayers.description == "No room with this code!") window.location.href = "index.html";
    if (allPlayers.status != 200) PopUpWindow(allPlayers.description);
    if (roomInfoPost.status != 200) PopUpWindow(roomInfoPost.description);

    SetTimer(roomInfo);

    myTasks = allPlayers.players[THIS_PLAYER_INDEX].tasks;
    enemyTasks = allPlayers.players[THIS_ENEMY_INDEX].tasks;
    resultScoresOnTasks = allPlayers.players[THIS_PLAYER_INDEX].scoreOnTask;

    RESULT_FIELD.innerText = resultScoresOnTasks[currentTask];

    SetUpProfiles(allPlayers, roomInfo);
}

function SetTimer(roomInfo) {
    const START_TIME = new Date(roomInfo.startTime);
    const TIME_FOR_TASKS = roomInfo.maxTime;
    let currentTime = new Date();
    let elapsedMilliseconds = currentTime - START_TIME;
    
    let totalSeconds = TIME_FOR_TASKS*60 - Math.floor(elapsedMilliseconds / 1000);

    if (totalSeconds <= 0) window.location.href = "resultPage.html";

    let currentMinutes = Math.floor(totalSeconds / 60);
    let currentSeconds = totalSeconds % 60;

    let formattedMinutes = String(currentMinutes).padStart(2, '0');
    let formattedSeconds = String(currentSeconds).padStart(2, '0');

    TIMER_FIELD.innerText = `${formattedMinutes}:${formattedSeconds}`;
}

function SetUpProfiles(allPlayers, roomInfo) {
    let playerScore = allPlayers.players[THIS_PLAYER_INDEX].score;
    let enemyScore = allPlayers.players[THIS_ENEMY_INDEX].score;
    let maxPossibleScore = roomInfo.maxTasks * 100;

    PLAYER_PROFILE_SCORE.innerHTML = `${playerScore}/${maxPossibleScore}`;
    ENEMY_PROFILE_SCORE.innerHTML = `${enemyScore}/${maxPossibleScore}`;

    if (setUpProfiles) return;
    setUpProfiles = true;

    let playerName = allPlayers.players[THIS_PLAYER_INDEX].name;
    let enemyName = allPlayers.players[THIS_ENEMY_INDEX].name;
    let playerIcon = allPlayers.players[THIS_PLAYER_INDEX].icon;
    let enemyIcon = allPlayers.players[THIS_ENEMY_INDEX].icon;

    PLAYER_PROFILE_ICON.src = ICONS_LIST[playerIcon];
    PLAYER_PROFILE_NAME.innerHTML = playerName + " (Ти)";
    ENEMY_PROFILE_ICON.src = ICONS_LIST[enemyIcon];
    ENEMY_PROFILE_NAME.innerHTML = enemyName;

    currentTask = allPlayers.players[THIS_PLAYER_INDEX].tasks[0];

    SetUpUI(allPlayers.players[THIS_PLAYER_INDEX].tasks);
    NewTask(currentTask);
}

async function SetUpUI(tasks) {
    for (let currentChar of tasks) {
        let taskButton = document.createElement("button");
        taskButton.innerText = currentChar;
        taskButton.addEventListener("click", () => NewTask(currentChar));

        resultTextOnTasks.set(currentChar, "0/100");

        TASK_BUTTONS_FIELD.appendChild(taskButton);
    }
}

async function NewTask(taskChar) {
    const CURRENT_NEW_TASK = (await SendPost("CPPCompiler", "GetTask", { taskGrade:GRADE_NUM, taskSet:SET_OF_TASKS, task:taskChar })).task;
    const CURRENT_TASK_EXAMPLES = CURRENT_NEW_TASK.examples;

    currentTask = taskChar;

    TASK_FIELD.innerHTML = "";

    let taskLetterAndName = document.createElement("p");
    let taskLimits = document.createElement("p");
    let taskCondition = document.createElement("p");
    let taskInputExplanation_Title = document.createElement("p");
    let taskInputExplanation = document.createElement("p");
    let taskOutputExplanation_Title = document.createElement("p");
    let taskOutputExplanation = document.createElement("p");
    let taskExample_Title = document.createElement("p");

    taskLimits.setAttribute('class', 'programming_limits');

    taskLetterAndName.innerHTML = `<font size="4"> Задача ${taskChar}</font> <br> <font size="6"><b>${CURRENT_NEW_TASK.name}</b></font>`;
    taskLimits.innerHTML = `<font size="4"> <em>${CURRENT_NEW_TASK.limits}</em></font>`;
    taskCondition.innerText = CURRENT_NEW_TASK.description;
    taskInputExplanation_Title.innerHTML = `<font size="5"><b>Вхідні файли</b></font>`;
    taskInputExplanation.innerText = CURRENT_NEW_TASK.inputExplanation;
    taskOutputExplanation_Title.innerHTML = `<font size="5"><b>Вихідні файли</b></font>`;
    taskOutputExplanation.innerText = CURRENT_NEW_TASK.outputExplanation;
    taskExample_Title.innerHTML = `<font size="5"><b>Приклади</b></font>`;

    TASK_FIELD.appendChild(taskLetterAndName);
    TASK_FIELD.appendChild(taskLimits);
    TASK_FIELD.appendChild(taskCondition);
    TASK_FIELD.appendChild(taskInputExplanation_Title);
    TASK_FIELD.appendChild(taskInputExplanation);
    TASK_FIELD.appendChild(taskOutputExplanation_Title);
    TASK_FIELD.appendChild(taskOutputExplanation);
    TASK_FIELD.appendChild(taskExample_Title);

    for (let currentExampleIndex = 0; currentExampleIndex < CURRENT_TASK_EXAMPLES; currentExampleIndex++) {
        currentExample = CURRENT_TASK_EXAMPLES[currentExampleIndex];
        let exampleCount = document.createElement("p");
        let exampleInputTitle = document.createElement("span");
        let exampleInput = document.createElement("p");
        let exampleOutputTitle = document.createElement("span");
        let exampleOutput = document.createElement("p");

        exampleInput.setAttribute('class', 'programming_examples');
        exampleOutput.setAttribute('class', 'programming_examples');

        exampleCount.innerHTML = `<font size="4"><b>Приклад №${currentExampleIndex+1}</b></font>`;
        exampleInputTitle.innerHTML = `<b>Ввід:</b>`;
        exampleInput.innerText = currentExample.input;
        exampleOutputTitle.innerHTML = `<b>Вивід:</b>`;
        exampleOutput.innerText = currentExample.output;

        TASK_FIELD.appendChild(exampleCount);
        TASK_FIELD.appendChild(exampleInputTitle);
        TASK_FIELD.appendChild(exampleInput);
        TASK_FIELD.appendChild(exampleOutputTitle);
        TASK_FIELD.appendChild(exampleOutput);

        currentExampleIndex++;
    }
}

async function UploadSolution() {
    let currentNewCode = EDITOR.innerText;
    let cleanedCode = CleanCode(currentNewCode);

    let res = await SendPost("CPPCompiler", "SendTask", { roomCode:ROOM_CODE, playerIndex:parseInt(THIS_PLAYER_INDEX), taskGrade:GRADE_NUM, taskSet:SET_OF_TASKS, task:currentTask, code:cleanedCode });

    if (res.status != 200) return PopUpWindow(res.description);
}

function CleanCode(rawCode) {
    let withoutBom = rawCode.replace(new RegExp(`^${BOM_CHAR}`), '');
    let normalized = withoutBom.normalize('NFKC');
    return normalized;
}

