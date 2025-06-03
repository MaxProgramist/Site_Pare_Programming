const API_SERVER_MANAGER = 'https://servermanager-plto.onrender.com';
const API_ROOM_MANAGER = 'https://roombackend-w2yg.onrender.com';
const API_CPP_REQUESTS = 'https://cpprequest.onrender.com';
const API_CPP_MANAGER = 'https://cppcompiler.onrender.com';

async function WakeUpServers() {
    await fetch(`${API_SERVER_MANAGER}/wake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            something: "Wake Up !"
        })
    });
    await fetch(`${API_ROOM_MANAGER}/wake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            something: "Wake Up !"
        })
    });
    await fetch(`${API_CPP_REQUESTS}/wake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            something: "Wake Up !"
        })
    });
    await fetch(`${API_CPP_MANAGER}/wake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            something: "Wake Up !"
        })
    });
}
