let CSRF_TOKEN = null;

window.APP = window.APP || {};

window.APP.STADIUMS = null;

/* Lorsque quelqu'un rejoins le site on récupère les stades directement */
document.addEventListener('DOMContentLoaded', async () => {
    window.APP.STADIUMS = await fetchData("stadiums");
});

/*
Nous permet d'afficher des notifications en bas à droite
de l'écran de l'utilisateur
*/
function showNotification(message, time) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    setTimeout(hideNotification, time != null ? time : 5000);
}

/*
Permet de cacher une notification
(normalement pas besoin de l'appeler, showNotification le fais déjà)
 */
function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

/*
Permet de récupérer un cookie par son nom, on utilise ça
pour récupérer le token CSRF de Django afin de pouvoir envoyer des
requêtes POST
*/
async function getCookie(name) {
    try {
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

/*
Permet de récupérer les données depuis l'API django
(comme un fetch mais version django quoi)
*/
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

/*
Permet de faire une requête POST vers l'API Django
*/
async function post(bodyParameters, ...routes) {
    const path = routes.join('/');
    const url = `http://localhost:8000/api/${path}/`;

    try {
        if (!CSRF_TOKEN) {
            // Si l'utilisateur ne possède pas de token alors on fait un
            // fetch dans le vide afin de pouvoir récupérer le token
            await fetchData("stadiums");
            CSRF_TOKEN = await getCookie('csrftoken');
            if (!CSRF_TOKEN) {
                throw new Error('CSRF Token non trouvé');
            }
        }
        console.log("TOKEN" + CSRF_TOKEN);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': CSRF_TOKEN,
            },
            credentials: 'include',
            body: JSON.stringify(bodyParameters)
        });

        console.log(response);

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

/*
Permet de savoir si l'utilisateur est connecté ou non
TODO: check si cela n'est pas exploitable
*/
function isAuthenticated() {
    return !!localStorage.getItem('username');
}

/*
Permet de clear la session d'un utilsateur
(lors d'une déconnection)
*/
function clearSession() {
    localStorage.removeItem('username');
    localStorage.removeItem('userData');
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