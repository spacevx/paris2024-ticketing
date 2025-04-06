document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const errorMessage = document.getElementById('errorMessage');
 
    /* Le bouton pour cacher/voir le MDP */
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passwordToggle.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
 
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        errorMessage.style.display = 'none';
        
        /* On check si la case email et MDP sont OK */
        if (!emailInput.value || !passwordInput.value) {
            showError('Veuillez remplir tous les champs');
            return;
        }
 
        /*
        On check que l'email est valide
        TODO: check que quelqu'un n'a pas déjà un compte avec cet email
        TODO: fix l'exploit du +1 dans l'email
        */
        if (!isValidEmail(emailInput.value)) {
            showError('Veuillez entrer une adresse email valide');
            return;
        }
 
        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';
 
        try {
            const loginData = {
                login: emailInput.value,
                password: passwordInput.value
            };
            
            /* On envoie les données à Django */
            const data = await post(loginData, "login");
            console.log('Login OK:', data);
            
            /* Une fois l'utilisateur OK, on stock dans le localStorage */
            if (data.user && data.user.username) {
                localStorage.setItem('username', data.user);
                localStorage.setItem('userData', JSON.stringify(data.user));                
                window.location.href = '../../index.html';
            } else {
                throw new Error('Session non créée');
            }
 
        } catch (error) {
            /* On affiche une erreur si ça n'a pas marché */
            showError(error.message || 'Une erreur est survenue lors de la connexion');
        } finally {
            submitBtn.disabled = false;
            spinner.style.display = 'none';
        }
    });
 
    /* Fonction qui gère l'affichage des messages d'erreur */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
 
    /*  check d'email avec regex */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
 });