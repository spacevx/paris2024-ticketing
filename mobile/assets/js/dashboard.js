function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* Me permet de récupérer le nom du stade selon son ID */
function getStadiumName(stadiumId) {
    const stadium = window.APP.STADIUMS.find(stadium => stadium.id === stadiumId);
    return stadium ? stadium.name : "Stade non trouvé";
}

function initTicketForm() {
    const ticketForm = document.getElementById('ticketForm');
    const totalPrice = document.getElementById('totalPrice');
    const ticketSummary = document.getElementById('ticketSummary');
    const confirmPurchaseBtn = document.getElementById('confirmPurchase');

    const qtyButtons = document.querySelectorAll('.qty-btn');
    const qtyInputs = document.querySelectorAll('.ticket-quantity');

    /* Prix selon la catégorie, les prix sont hardcodé */
    const CATEGORY_PRICES = {
        'platinium': 200,
        'gold': 150,
        'silver': 100
    };

    /* CSS classe pour les catégories */
    const CATEGORY_CLASSES = {
        'platinium': 'platinum',
        'gold': 'gold',
        'silver': 'silver'
    };

    /* Animation du prix total quand on achète des tickets */
    function animateTotal(newTotal) {
        const currentTotal = parseInt(totalPrice.textContent) || 0;
        const step = Math.ceil(Math.abs(newTotal - currentTotal) / 10);
        let current = currentTotal;

        const interval = setInterval(() => {
            if (current < newTotal) {
                current = Math.min(current + step, newTotal);
            } else if (current > newTotal) {
                current = Math.max(current - step, newTotal);
            }

            totalPrice.textContent = `${current} €`;

            if (current === newTotal) {
                clearInterval(interval);
            }
        }, 20);
    }

    /* Permet de gérer le bouton +/- dans l'achat des tickets */
    function updateQuantityButtons(category, quantity) {
        const minusBtn = document.querySelector(`.qty-minus[data-category="${category}"]`);
        const plusBtn = document.querySelector(`.qty-plus[data-category="${category}"]`);
        const input = document.getElementById(`${category}Quantity`);
        const max = parseInt(input.max);

        /* Si quantity = 0 alors on enlève le bouton - */
        minusBtn.disabled = quantity <= 0;

        /* Si quantity = max alors on enlève le bouton + */
        plusBtn.disabled = quantity >= max;
    }

    // Update du prix total
    function updateTotalPrice() {
        let total = 0;
        let hasTickets = false;
        let summaryHTML = '';

        qtyInputs.forEach(input => {
            const category = input.name;
            const quantity = parseInt(input.value);
            const price = CATEGORY_PRICES[category.toLowerCase()];
            const categoryItem = input.closest('.category-item');

            if (quantity > 0) {
                hasTickets = true;
                total += quantity * price;

                /* On ajoute ça au résumé du prix total avec la bonne couleur (selon le type de ticket) */
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                const categoryClass = CATEGORY_CLASSES[category.toLowerCase()];

                summaryHTML += `
                    <div class="ticket-summary-item">
                        <span class="ticket-summary-category ${categoryClass}">${quantity} × ${categoryName}</span>
                        <span class="ticket-summary-price">${quantity * price} €</span>
                    </div>
                `;

                categoryItem.classList.add('has-tickets');

                updateQuantityButtons(category, quantity);
            } else {
                categoryItem.classList.remove('has-tickets');
                updateQuantityButtons(category, 0);
            }
        });

        ticketSummary.innerHTML = summaryHTML;

        if (hasTickets) {
            ticketSummary.classList.add('active');
        } else {
            ticketSummary.classList.remove('active');
        }

        confirmPurchaseBtn.disabled = !hasTickets;

        animateTotal(total);
    }

    qtyInputs.forEach(input => {
        updateQuantityButtons(input.name, parseInt(input.value));
    });

    qtyButtons.forEach(button => {
        /* Pour éviter les doublons */
        button.removeEventListener('click', handleQuantityButtonClick);

        button.addEventListener('click', handleQuantityButtonClick);
    });

    function handleQuantityButtonClick(event) {
        // Pour éviter le spam
        event.preventDefault();

        const button = this;
        if (button.disabled) return;

        // Pour éviter les clics accidentel
        if (button.dataset.processing === 'true') return;
        button.dataset.processing = 'true';

        const isPlus = button.classList.contains('qty-plus');
        const category = button.dataset.category;
        const input = document.getElementById(`${category}Quantity`);
        let value = parseInt(input.value);

        button.classList.add('btn-active');

        if (isPlus && value < parseInt(input.max)) {
            input.value = value + 1;

            // Animation de pulse
            const categoryItem = input.closest('.category-item');
            categoryItem.classList.add('pulse');
            setTimeout(() => categoryItem.classList.remove('pulse'), 300);
        } else if (!isPlus && value > 0) {
            input.value = value - 1;
        }

        updateTotalPrice();

        setTimeout(() => {
            button.classList.remove('btn-active');
            button.dataset.processing = 'false';
        }, 150);
    }

    qtyInputs.forEach(input => {
        input.addEventListener('change', () => {
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            let value = parseInt(input.value) || 0;

            if (value < min) input.value = min;
            if (value > max) input.value = max;

            updateTotalPrice();
        });
    });

    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            categoryItems.forEach(otherItem => {
                if (otherItem !== item && !otherItem.classList.contains('has-tickets')) {
                    otherItem.classList.add('category-dimmed');
                }
            });
        });

        item.addEventListener('mouseleave', () => {
            categoryItems.forEach(otherItem => {
                otherItem.classList.remove('category-dimmed');
            });
        });
    });

    updateTotalPrice();

    return {
        updateTotalPrice,
        resetForm: () => {
            qtyInputs.forEach(input => {
                input.value = 0;
                input.closest('.category-item').classList.remove('has-tickets');
                updateQuantityButtons(input.name, 0);
            });
            updateTotalPrice();
        }
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    const userActions = document.getElementById('userActions');
    const guestActions = document.getElementById('guestActions');
    const matchesGrid = document.getElementById('matchesGrid');

    if (isAuthenticated()) {
        userActions.style.display = 'flex';
        guestActions.style.display = 'none';
    } else {
        userActions.style.display = 'none';
        guestActions.style.display = 'flex';

        // Bannière pour les personnes sans compte
        const loginBanner = document.createElement('div');
        loginBanner.className = 'login-banner';
        loginBanner.innerHTML = `
            <div class="login-banner-content">
                <div class="login-banner-text">
                    Connectez-vous pour acheter des billets et profiter de l'expérience complète !
                </div>
                <div class="login-banner-buttons">
                    <a href="./assets/pages/login.html" class="nav-btn">Se connecter</a>
                    <a href="./assets/pages/register.html" class="nav-btn">S'inscrire</a>
                </div>
            </div>
        `;
        matchesGrid.parentNode.insertBefore(loginBanner, matchesGrid);
    }

    const logoutBtn = document.getElementById('logoutBtn');
    const profileBtn = document.getElementById('profileBtn');
    const modal = document.getElementById('ticketModal');
    const closeModal = document.getElementById('closeModal');
    const ticketForm = document.getElementById('ticketForm');

    // Charger les matchs depuis l'API
    try {
        const matches = await fetchData('events');
        const teams = await fetchData('teams');

        // Créer les matchs
        matches.forEach(match => {
            const matchCard = createMatchCard(match, teams);
            matchesGrid.appendChild(matchCard);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des matchs:', error);
        showNotification('Erreur lors du chargement des matchs', 3000);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            /*TODO: aussi le déco depuis Django? */
            clearSession();
            window.location.href = './index.html';
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = './assets/pages/profile.html';
        });
    }

    closeModal.addEventListener('click', () => {
        closeTicketModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeTicketModal();
        }
    });

    function closeTicketModal() {
        modal.classList.add('modal-closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('modal-closing');
        }, 300);
    }

    async function showTicketModal(match, teams) {
        const homeTeam = getTeamById(match.team_home, teams);
        const awayTeam = getTeamById(match.team_away, teams);

        document.getElementById('modalMatchDate').textContent = formatDate(match.start);
        document.getElementById('modalStadium').textContent = getStadiumName(match.stadium);

        const homeTeamName = homeTeam ? homeTeam.name : "À déterminer";
        const awayTeamName = awayTeam ? awayTeam.name : "À déterminer";
        document.getElementById('modalTeams').textContent = `${homeTeamName} VS ${awayTeamName}`;

        const ticketFormControls = initTicketForm();

        ticketFormControls.resetForm();

        ticketForm.onsubmit = async (e) => {
            e.preventDefault();

            const confirmBtn = document.getElementById('confirmPurchase');
            const originalText = confirmBtn.innerHTML;
            confirmBtn.innerHTML = '<div class="loader"></div> Traitement en cours...';
            confirmBtn.disabled = true;

            try {
                const userData = JSON.parse(localStorage.getItem("userData"));
                const tickets = {};
                let totalTickets = 0;

                document.querySelectorAll('.ticket-quantity').forEach(input => {
                    const category = input.name;
                    const quantity = parseInt(input.value);

                    if (quantity > 0) {
                        // on CAPS la première lettre pour Django
                        tickets[capitalizeFirstLetter(category)] = quantity;
                        totalTickets += quantity;
                    }
                });

                const result = await post({
                    user: userData.id,
                    event: match.id,
                    tickets: tickets
                }, 'buy-ticket');

                const categoryText = Object.entries(tickets)
                    .map(([category, quantity]) => `${quantity} ${category}`)
                    .join(', ');

                const message = `Vous avez acheté ${totalTickets} billet${totalTickets > 1 ? 's' : ''} (${categoryText}) pour le match ${homeTeamName} VS ${awayTeamName} le ${formatDate(match.start)}`;

                closeTicketModal();

                setTimeout(() => {
                    showNotification(message, 7000);
                }, 500);

            } catch (error) {
                console.error('Erreur lors de l\'achat:', error);
                showNotification('Une erreur est survenue lors de l\'achat des billets', 3000);

                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;
            }
        };

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 10);
    }

    function createMatchCard(match, teams) {
        const div = document.createElement('div');
        div.className = 'match-card';

        if (match.score && match.score.trim() !== '') {
            div.classList.add('has-score');
        }

        const date = document.createElement('div');
        date.className = 'match-date';
        date.textContent = formatDate(match.start);

        const teamsDiv = document.createElement('div');
        teamsDiv.className = 'match-teams';

        const homeTeam = getTeamById(match.team_home, teams);
        const awayTeam = getTeamById(match.team_away, teams);

        if (homeTeam && awayTeam) {
            // Équipe maison
            const homeTeamDiv = document.createElement('div');
            homeTeamDiv.className = 'team';

            const homeFlag = document.createElement('span');
            homeFlag.className = `fi fi-${homeTeam.code.toLowerCase()} team-flag`;

            const homeName = document.createElement('span');
            homeName.className = 'team-name';
            homeName.textContent = homeTeam.name;

            const homeNickname = document.createElement('span');
            homeNickname.className = 'team-nickname';
            homeNickname.textContent = homeTeam.nickname || '';

            homeTeamDiv.appendChild(homeFlag);
            homeTeamDiv.appendChild(homeName);
            if (homeTeam.nickname) homeTeamDiv.appendChild(homeNickname);

            // VS ou score
            const vs = document.createElement('span');
            vs.className = 'vs';

            if (match.score && match.score.trim() !== '') {
                vs.textContent = match.score;
                vs.className = 'vs score-display';
            } else {
                vs.textContent = 'VS';
            }

            // Équipe dehors
            const awayTeamDiv = document.createElement('div');
            awayTeamDiv.className = 'team';

            const awayFlag = document.createElement('span');
            awayFlag.className = `fi fi-${awayTeam.code.toLowerCase()} team-flag`;

            const awayName = document.createElement('span');
            awayName.className = 'team-name';
            awayName.textContent = awayTeam.name;

            const awayNickname = document.createElement('span');
            awayNickname.className = 'team-nickname';
            awayNickname.textContent = awayTeam.nickname || '';

            awayTeamDiv.appendChild(awayFlag);
            awayTeamDiv.appendChild(awayName);
            if (awayTeam.nickname) awayTeamDiv.appendChild(awayNickname);

            teamsDiv.appendChild(homeTeamDiv);
            teamsDiv.appendChild(vs);
            teamsDiv.appendChild(awayTeamDiv);
        } else {
            const createPlaceholderTeam = () => {
                const teamDiv = document.createElement('div');
                teamDiv.className = 'team';

                const placeholderFlag = document.createElement('span');
                placeholderFlag.className = 'team-flag placeholder';
                placeholderFlag.innerHTML = '?';

                const placeholderName = document.createElement('span');
                placeholderName.className = 'team-name';
                placeholderName.textContent = 'À déterminer';

                teamDiv.appendChild(placeholderFlag);
                teamDiv.appendChild(placeholderName);

                return teamDiv;
            };

            const vs = document.createElement('span');
            vs.className = 'vs';
            vs.textContent = 'VS';

            teamsDiv.appendChild(createPlaceholderTeam());
            teamsDiv.appendChild(vs);
            teamsDiv.appendChild(createPlaceholderTeam());
        }

        const stadium = document.createElement('div');
        stadium.className = 'match-stadium';
        stadium.textContent = getStadiumName(match.stadium);

        const button = document.createElement('button');

        if (isAuthenticated()) {
            button.className = 'buy-button';

            if (match.score) {
                button.classList.add('match-finished');
                button.textContent = 'Match terminé';
            } else {
                button.textContent = 'Acheter un ticket';
                button.onclick = () => showTicketModal(match, teams);
            }
        }

        div.appendChild(date);
        div.appendChild(teamsDiv);
        div.appendChild(stadium);
        div.appendChild(button);

        return div;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    function getTeamById(id, teams) {
        return teams.find(team => team.id === id);
    }
});