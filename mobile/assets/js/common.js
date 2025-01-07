let CSRF_TOKEN = null;

async function getCookie(name) {
    try {
        console.log("called")
        if (!document.cookie || document.cookie === "") return null;

        const cookie = document.cookie
            .split(';')
            .map(c => c.trim())
            .find(c => c.startsWith(`${name}=`));

        return cookie
            ? decodeURIComponent(cookie.substring(name.length + 1))
            : null;

    } catch (error) {
        console.error('Erreur lors de la récupération du cookie:', error);
        return null;
    }
}

async function fetchData(...routes) {
    const path = routes.join('/');
    const url = `http://localhost:8000/api/${path}`;
    console.log(url)

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }

        const json = await response.json();
        return json;

    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        throw error;
    }
}

async function post(bodyParameters, ...routes) {
    // Construire l'URL avec les segments de route
    const path = routes.join('/');
    const url = `http://localhost:8000/api/${path}/`;

    try {
        if (!CSRF_TOKEN) {
            await fetchData("stadiums"); // Pour avoir le cookie
            CSRF_TOKEN = await getCookie('csrftoken');
            if (!CSRF_TOKEN) {
                throw new Error('CSRF Token non trouvé');
            }
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': CSRF_TOKEN,
            },
            credentials: 'include',
            body: JSON.stringify(bodyParameters)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }

        const json = await response.json();
        return json;

    } catch (error) {
        console.error('Erreur lors de la requête POST:', error);
        throw error;
    }
}

function isAuthenticated() {
    return !!localStorage.getItem('username');
}

function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Fonction pour les requêtes authentifiées
async function authenticatedFetch(url, options = {}) {
    const username = localStorage.getItem('username');

    if (!username) {
        throw new Error('Non authentifié');
    }

    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include'
        });

        if (response.status === 401) {
            clearSession();
            window.location.href = '/login';
            throw new Error('Session expirée');
        }

        return response;
    } catch (error) {
        console.error('Erreur requête authentifiée:', error);
        throw error;
    }
}

function clearSession() {
    localStorage.removeItem('username');
    localStorage.removeItem('userData');
}

function getCachedUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// On écrit dans le prototype de String pour rajouter la methdode format
// comme en Lua avec string.format
if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}