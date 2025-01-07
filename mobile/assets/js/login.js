document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const errorMessage = document.getElementById('errorMessage');

    // Le bouton pour cacher/voir le MDP
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passwordToggle.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // Event submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset error message
        errorMessage.style.display = 'none';
        
        // Validation
        if (!emailInput.value || !passwordInput.value) {
            showError('Veuillez remplir tous les champs');
            return;
        }

        if (!isValidEmail(emailInput.value)) {
            showError('Veuillez entrer une adresse email valide');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';

        try {
            const loginData = {
                login: emailInput.value,
                password: passwordInput.value
            };
            
            const data = await post(loginData, "login");
            console.log('Login successful:', data);
            
            const username = await data.user.username;
            if (username) {
                localStorage.setItem('username', data.user);
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                // On redirige l'utilisateur
                window.location.href = '/mobile/assets/pages/dashboard.html';
            } else {
                throw new Error('Session non créée');
            }

        } catch (error) {
            showError(error.message || 'Une erreur est survenue lors de la connexion');
        } finally {
            submitBtn.disabled = false;
            spinner.style.display = 'none';
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});