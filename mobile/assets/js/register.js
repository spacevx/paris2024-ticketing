document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const requirements = {
        length: str => str.length >= 8,
        uppercase: str => /[A-Z]/.test(str),
        number: str => /[0-9]/.test(str)
    };

    password.addEventListener('input', () => {
        const value = password.value;
        Object.keys(requirements).forEach(req => {
            const element = document.querySelector(`[data-requirement="${req}"]`);
            if (requirements[req](value)) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameValue = document.getElementById('name').value;
        const nameParts = nameValue.trim().split(' ');
        
        if (nameParts.length < 2) {
            showNotification("Il faut bien mettre un prénom et un nom dans le nom complet.", 3000);
            return;
        }
        const [firstName, ...lastNameParts] = nameParts;
        const lastName = lastNameParts.join(' ');

        if (!firstName || !lastName) {
            showNotification("Il faut bien mettre un prénom et un nom dans le nom complet.", 3000);
            return;
        }
        
        const randomNumbers = Math.floor(Math.random() * 10000);
        
        const username = String.format('{0}-{1}-{2}', firstName.toLowerCase(), lastName.toLowerCase(), randomNumbers);

        const formData = {
            first_name: firstName,
            last_name: lastName,
            email: document.getElementById('email').value,
            username: username,
            password: password.value,
            password2: confirmPassword.value
        };

        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.password2) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        if (formData.password !== formData.password2) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        const isPasswordValid = Object.keys(requirements).every(req => 
            requirements[req](formData.password)
        );

        if (!isPasswordValid) {
            alert('Le mot de passe ne respecte pas les exigences minimales');
            return;
        }

        try {
            const data = await post(formData, 'register');
            if (data.user.email) {
                console.log("OK => OK")
                window.location.href = '../pages/login.html';
            } else {
                throw new Error('Erreur lors de l\'inscription');
            }
        } catch (error) {
            alert('Une erreur est survenue. Veuillez réessayer.');
            console.error('Erreur:', error);
        }
    });
});