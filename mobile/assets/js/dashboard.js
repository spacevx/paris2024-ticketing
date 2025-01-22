
// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = '../../index.html';
        return;
    }

    const matchesGrid = document.getElementById('matchesGrid');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileBtn = document.getElementById('profileBtn');
    const modal = document.getElementById('ticketModal');
    const closeModal = document.getElementById('closeModal');
    const ticketForm = document.getElementById('ticketForm');
    const ticketQuantity = document.getElementById('ticketQuantity');
    const categorySelect = document.getElementById('ticketCategory');
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
    }

    logoutBtn.addEventListener('click', () => {
        clearSession();
        window.location.href = '../../index.html';
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

    // Mettre à jour le prix total quand la quantité ou la catégorie change
    function updateTotalPrice() {
        const quantity = parseInt(ticketQuantity.value);
        const category = categorySelect.value;
        const price = CATEGORY_PRICES[category];
        const total = quantity * price;
        totalPrice.textContent = `${total} €`;
    }

    ticketQuantity.addEventListener('change', updateTotalPrice);
    categorySelect.addEventListener('change', updateTotalPrice);

    async function showTicketModal(match, teams) {
        const homeTeam = getTeamById(match.team_home, teams);
        const awayTeam = getTeamById(match.team_away, teams);
        
        document.getElementById('modalMatchDate').textContent = formatDate(match.start);
        document.getElementById('modalStadium').textContent = match.stadium;
        document.getElementById('modalTeams').textContent = `${homeTeam.name} VS ${awayTeam.name}`;
        
        ticketForm.reset();
        updateTotalPrice();
        
        ticketForm.onsubmit = async (e) => {
            e.preventDefault();
            try {
                const userData = JSON.parse(localStorage.getItem("userData"));
                console.log(userData.id, match.id, parseInt(ticketQuantity.value), capitalizeFirstLetter(categorySelect.value))
                const result = await post({
                    user: userData.id,
                    event: match.id,
                    ticket_count: parseInt(ticketQuantity.value),
                    category: capitalizeFirstLetter(categorySelect.value)
                }, 'buy-ticket');
                
                alert('Ticket(s) acheté(s) avec succès !');
                modal.style.display = 'none';
                window.location.reload();
            } catch (error) {
                alert('Erreur lors de l\'achat du/des ticket(s)');
            }
        };
        
        modal.style.display = 'block';
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

            // VS
            const vs = document.createElement('span');
            vs.className = 'vs';
            vs.textContent = 'VS';

            // Équipe extérieure
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
            teamsDiv.textContent = 'À déterminer';
        }

        const stadium = document.createElement('div');
        stadium.className = 'match-stadium';
        stadium.textContent = match.stadium;

        const button = document.createElement('button');
        button.className = 'buy-button';
        button.textContent = 'Acheter un ticket';
        button.onclick = () => showTicketModal(match, teams);

        if (!match.team_home || !match.team_away) {
            button.disabled = true;
        }

        div.appendChild(date);
        div.appendChild(teamsDiv);
        div.appendChild(stadium);
        div.appendChild(button);

        return div;
    }
});