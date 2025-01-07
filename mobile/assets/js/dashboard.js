document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = '../../index.html';
        return;
    }

    const matchesGrid = document.getElementById('matchesGrid');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileBtn = document.getElementById('profileBtn');

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

    async function buyTicketForMatch(matchId) {
        try {
            const result = await post({ event_id: matchId }, 'buy-ticket');
            alert('Ticket acheté avec succès !');
            // Rafraîchir la page ou mettre à jour l'interface
            window.location.reload();
        } catch (error) {
            alert('Erreur lors de l\'achat du ticket');
        }
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
            // Équipe domicile
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
        button.onclick = () => buyTicketForMatch(match.id);

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