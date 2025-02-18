function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStadiumName(stadiumId) {
    const stadium = window.APP.STADIUMS.find(stadium => stadium.id === stadiumId);
    return stadium ? stadium.name : "Stade non trouvé";
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
    const ticketQuantity = document.getElementById('ticketQuantity');
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const totalPrice = document.getElementById('totalPrice');

    const CATEGORY_PRICES = {
        'platinium': 200,
        'gold': 150,
        'silver': 100
    };

    try {
        const matches = await fetchData('events');
        const teams = await fetchData('teams');

        matches.forEach(match => {
            const matchCard = createMatchCard(match, teams);
            matchesGrid.appendChild(matchCard);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des matchs:', error);
        showNotification('Erreur lors du chargement des matchs', 3000);
    }

    logoutBtn.addEventListener('click', () => {
        clearSession();
        window.location.href = './index.html';
    });

    profileBtn.addEventListener('click', () => {
        window.location.href = './profile.html';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function updateTotalPrice() {
        const quantity = parseInt(ticketQuantity.value);
        const selectedCategory = document.querySelector('input[name="category"]:checked').value;
        const price = CATEGORY_PRICES[selectedCategory.toLowerCase()];
        const total = quantity * price;
        totalPrice.textContent = `${total} €`;
    }

    categoryInputs.forEach(input => {
        input.addEventListener('change', updateTotalPrice);
    });

    ticketQuantity.addEventListener('change', updateTotalPrice);

    async function showTicketModal(match, teams) {
        console.log("oooo", match);
        const homeTeam = getTeamById(match.team_home, teams);
        const awayTeam = getTeamById(match.team_away, teams);

        document.getElementById('modalMatchDate').textContent = formatDate(match.start);
        document.getElementById('modalStadium').textContent = getStadiumName(match.stadium);
        
        const homeTeamName = homeTeam ? homeTeam.name : "À déterminer";
        const awayTeamName = awayTeam ? awayTeam.name : "À déterminer";
        document.getElementById('modalTeams').textContent = `${homeTeamName} VS ${awayTeamName}`;

        ticketForm.reset();
        updateTotalPrice();

        ticketForm.onsubmit = async (e) => {
            e.preventDefault();
            try {
                const userData = JSON.parse(localStorage.getItem("userData"));
                const quantity = parseInt(ticketQuantity.value);
                const category = capitalizeFirstLetter(document.querySelector('input[name="category"]:checked').value);

                const result = await post({
                    user: userData.id,
                    event: match.id,
                    ticket_count: quantity,
                    category: category
                }, 'buy-ticket');

                const message = `Vous avez acheté ${quantity} billet${quantity > 1 ? 's' : ''} en catégorie ${category} pour le match ${document.getElementById('modalTeams').textContent} le ${document.getElementById('modalMatchDate').textContent}`;
                modal.style.display = 'none';

                setTimeout(() => {
                    showNotification(message, 7000);
                }, 1000);

            } catch (error) {
                console.error('Erreur lors de l\'achat:', error);
                showNotification('Une erreur est survenue lors de l\'achat des billets', 3000);
            }
        };

        modal.style.display = 'block';
    }

    function createMatchCard(match, teams) {
        const div = document.createElement('div');
        div.className = 'match-card';

        const date = document.createElement('div');
        date.className = 'match-date';
        date.textContent = formatDate(match.start);

        const teamsDiv = document.createElement('div');
        teamsDiv.className = 'match-teams';

        const homeTeam = getTeamById(match.team_home, teams);
        const awayTeam = getTeamById(match.team_away, teams);

        if (homeTeam && awayTeam) {
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

            const vs = document.createElement('span');
            vs.className = 'vs';
            vs.textContent = 'VS';

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
            button.textContent = 'Acheter un ticket';
            button.onclick = () => showTicketModal(match, teams);
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