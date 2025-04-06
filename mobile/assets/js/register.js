document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    /* Requirements pour que le mot de passe sois OK */
    const requirements = {
        length: str => str.length >= 8,          /* 8 caractères*/
        uppercase: str => /[A-Z]/.test(str),     /* une majuscule */
        number: str => /[0-9]/.test(str)         /* un chiffre */
    };

    password.addEventListener('input', () => {
        const value = password.value;
        /* On check si les requirements sont ok et on met à jour selon ça */
        Object.keys(requirements).forEach(req => {
            const element = document.querySelector(`[data-requirement="${req}"]`);
            if (requirements[req](value)) {
                element.classList.add('valid');       /* Requirements OK */
            } else {
                element.classList.remove('valid');    /* Requirements non OK */
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        /* On récupére le nom complet et on le split */
        const nameValue = document.getElementById('name').value;
        const nameParts = nameValue.trim().split(' ');

        if (nameParts.length < 2) {
            showNotification("Il faut bien mettre un prénom et un nom dans le nom complet.", 3000);
            return;
        }
        
        /* Sépare le prénom du nom */
        const [firstName, ...lastNameParts] = nameParts;
        const lastName = lastNameParts.join(' ');

        /* On check si prénom et nom ne sont pas vide */
        if (!firstName || !lastName) {
            showNotification("Il faut bien mettre un prénom et un nom dans le nom complet.", 3000);
            return;
        }
        
        /* On génère un nombre au hasard */
        const randomNumbers = Math.floor(Math.random() * 10000);
        
        /* Nom d'utilisateur: prenom-nom-nombre */
        const username = String.format('{0}-{1}-{2}', firstName.toLowerCase(), lastName.toLowerCase(), randomNumbers);

        /* Tableau qu'on va envoyer à django */
        const formData = {
            first_name: firstName,
            last_name: lastName,
            email: document.getElementById('email').value,
            username: username,
            password: password.value,
            password2: confirmPassword.value
        };

        /* On check si tous les champs sont OK */
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.password2) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        /* Si les deux mdp ne sont pas les mêmes on met une notification */
        if (formData.password !== formData.password2) {
            showNotification('Les mots de passe ne correspondent pas');
            return;
        }

        /* On recheck que le mot de passe possède les requirements */
        const isPasswordValid = Object.keys(requirements).every(req => 
            requirements[req](formData.password)
        );

        /* Si le mdp n'est pas valide on abandonne */
        if (!isPasswordValid) {
            showNotification('Le mot de passe ne respecte pas les exigences minimales');
            return;
        }

        /* On envoie les données à Django */
        try {
            const data = await post(formData, 'register');
            if (data.user.email) {
                /* Si Django renvoie l'user, cela veut dire qu'il est bien créer */
                window.location.href = '../pages/login.html';
            } else {
                throw new Error('Erreur lors de l\'inscription');
            }
        } catch (error) {
            showNotification('Une erreur est survenue. Veuillez réessayer.');
            console.error('Erreur:', error);
        }
    });
});