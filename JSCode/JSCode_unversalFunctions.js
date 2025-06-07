const THEME_LIST = {
    "linar_1": "Лінійні алгоритми 1",
    "linar_2": "Лінійні алгоритми 2",
    "linar_3": "Лінійні алгоритми 3",
    "branching": "Розгалуження",
    "Cycles_1": "Цикли 1",
    "Cycles_2": "Цикли 2",
    "GCD_LCM": "НСД та НСК"
};

// * ------------ Universal Functions ------------ //
// * --------------- Without Server -------------- //

function PopUpWindowOfError(errorType, icon = "./Icons/ErrorIcon.png") {
    let popUpBox = document.createElement("div");
    popUpBox.setAttribute('class', 'classField_2 popUpBox');

    let popUpBoxIcon = document.createElement("img");
    popUpBoxIcon.src = icon;
    popUpBoxIcon.setAttribute('class', 'popUpBoxIcon');

    let closeButton = document.createElement("button");
    closeButton.innerHTML = `
    <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <path
        d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
        fill="currentColor"
    />
    </svg>`;

    closeButton.setAttribute('class', 'button popUpBoxButton');
    closeButton.onclick = function () {
        popUpBox.remove();
    };

    popUpBox.appendChild(popUpBoxIcon);
    popUpBox.innerHTML += `<br> <font size=6> ${errorType} </font> <br>`;
    popUpBox.appendChild(closeButton);

    document.body.appendChild(popUpBox);
}

// * ---------------- With Server --------------- //
const API = 'https://servermanager-plto.onrender.com';

async function SendPost(servername, functionName, arguments) {
    return (await fetch(`${API}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            server: servername,
            arguments: { name: functionName, arguments: arguments }
        })
    }));
}

async function ResetData() {
    let res = await fetch(`${API}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            server: servername,
            arguments: { name: "ResetData", arguments: {} }
        })
    });

    if (res.status != 200) {
        return PopUpWindowOfError(res.description);
    }
}