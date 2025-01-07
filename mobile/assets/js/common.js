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

    } catch(error) {
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
    return !!localStorage.getItem('sessionId');
}

function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Fonction pour les requêtes authentifiées
async function authenticatedFetch(url, options = {}) {
    const sessionId = localStorage.getItem('sessionId');
    
    if (!sessionId) {
        throw new Error('Non authentifié');
    }

    // Ajouter les headers d'authentification si nécessaire
    const headers = {
        ...options.headers,
        'X-Session-ID': sessionId
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
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
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userData');
}

function getCachedUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}