const API_SERVER_MANAGER = 'https://servermanager-plto.onrender.com';
const API_ROOM_MANAGER = 'https://roombackend-w2yg.onrender.com';
const API_CPP_REQUESTS = 'https://cpprequest.onrender.com';
const API_CPP_MANAGER = 'https://cppcompiler.onrender.com';

async function WakeUpServers() {
    const urls = [
        API_SERVER_MANAGER,
        API_ROOM_MANAGER,
        API_CPP_REQUESTS,
        API_CPP_MANAGER
    ];

    try {
        const requests = urls.map(url => fetch(url).then(res => res.json()));

        const results = await Promise.all(requests);

        return PopUpWindow("Servers are await", "./Icons/WakeUpIcon.png");
    } catch (error) {
        return PopUpWindow(error);
    }
}
