document.addEventListener('DOMContentLoaded', async () => {
    function getStadiumName(stadiumId) {
        console.log(window.APP.STADIUMS)
        const stadium = window.APP.STADIUMS.find(stadium => stadium.id === stadiumId);
        return stadium ? stadium.name : "Stade non trouvé";
    }

    function showQRModal(ticket) {
        const modalBody = modal.querySelector('.modal-body');
        const qrContainer = document.getElementById('qrCodeContainer');
        
        modalBody.innerHTML = '';
        qrContainer.innerHTML = '';
        
        const qrWrapper = document.createElement('div');
        qrWrapper.id = 'qrCodeContainer';
        
        if (ticket.ticket_count > 1) {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'qr-slider';
            
            const prevButton = document.createElement('button');
            prevButton.className = 'slider-control prev';
            prevButton.setAttribute('aria-label', 'Billet précédent');
            prevButton.innerHTML = '←';
            
            const nextButton = document.createElement('button');
            nextButton.className = 'slider-control next';
            nextButton.setAttribute('aria-label', 'Billet suivant');
            nextButton.innerHTML = '→';
            
            const counter = document.createElement('div');
            counter.className = 'slider-counter';
            
            sliderContainer.appendChild(prevButton);
            sliderContainer.appendChild(qrWrapper);
            sliderContainer.appendChild(nextButton);
            sliderContainer.appendChild(counter);
            
            let currentIndex = 0;
            
            function updateQRCode() {
                qrWrapper.innerHTML = '';
                counter.textContent = `${currentIndex + 1}/${ticket.ticket_count}`;
                
                new QRCode(qrWrapper, {
                    text: `${ticket.uuid}-${currentIndex + 1}`,
                    width: 256,
                    height: 256,
                    colorDark: "#1B1F3B",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
            
            prevButton.onclick = () => {
                currentIndex = (currentIndex - 1 + ticket.ticket_count) % ticket.ticket_count;
                updateQRCode();
            };
            
            nextButton.onclick = () => {
                currentIndex = (currentIndex + 1) % ticket.ticket_count;
                updateQRCode();
            };
            
            modalBody.appendChild(sliderContainer);
            updateQRCode();
        } else {
            modalBody.appendChild(qrWrapper);
            
            new QRCode(qrWrapper, {
                text: ticket.uuid,
                width: 256,
                height: 256,
                colorDark: "#1B1F3B",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
        
        modal.style.display = 'flex';
    }
    
    if (!isAuthenticated()) {
        window.location.href = '../../index.html';
        return;
    }

    const ticketsGrid = document.getElementById('ticketsGrid');
    const logoutBtn = document.getElementById('logoutBtn');

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>QR Code du billet</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div id="qrCodeContainer"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            modal.style.display = 'none';
        }
    });

    try {
        const tickets = await fetchData('getInfos');
        const events = await fetchData('events');
        const teams = await fetchData('teams');

        if(tickets.message) {
            const noTicket = document.createElement('div');
            noTicket.className = 'no-ticket';
            noTicket.textContent = tickets.message;
            ticketsGrid.appendChild(noTicket);
            return;
        }
        
        tickets.forEach((ticket, index) => {
            const event = events.find(e => e.id === ticket.event);
            const ticketCard = createTicketCard(ticket, event, teams, index);
            ticketsGrid.appendChild(ticketCard);
        });

    } catch (error) {
        console.error('Erreur lors du chargement des tickets:', error);
    }

    logoutBtn.addEventListener('click', () => {
        clearSession();
        window.location.href = '../index.html';
    });

    

    function createTicketCard(ticket, event, teams, index) {
        const div = document.createElement('div');
        div.className = 'ticket-card';
        div.style.setProperty('--animation-order', index);

        const header = document.createElement('div');
        header.className = 'ticket-header';

        const category = document.createElement('span');
        console.log("Avant conversion:", ticket.category);
        console.log("Après conversion:", ticket.category.toLowerCase());
        const categoryClass = ticket.category.toLowerCase();
        category.className = `category ${categoryClass}`;
        console.log("Classe finale:", category.className);
        category.textContent = ticket.category;

        const computedStyle = window.getComputedStyle(category);
        console.log("Style appliqué:", {
            background: computedStyle.background,
            color: computedStyle.color
        });
        
        
        header.appendChild(category);

        const date = document.createElement('div');
        date.className = 'match-date';
        date.textContent = formatDate(event.start);

        const teamsDiv = document.createElement('div');
        teamsDiv.className = 'match-teams';

        const homeTeam = getTeamById(event.team_home, teams);
        const awayTeam = getTeamById(event.team_away, teams);

        if (homeTeam && awayTeam) {
            teamsDiv.innerHTML = `
                <div class="team">
                    <span class="fi fi-${homeTeam.code.toLowerCase()} team-flag"></span>
                    <span class="team-name">${homeTeam.name}</span>
                    ${homeTeam.nickname ? `<span class="team-nickname">${homeTeam.nickname}</span>` : ''}
                </div>
                <span class="vs">VS</span>
                <div class="team">
                    <span class="fi fi-${awayTeam.code.toLowerCase()} team-flag"></span>
                    <span class="team-name">${awayTeam.name}</span>
                    ${awayTeam.nickname ? `<span class="team-nickname">${awayTeam.nickname}</span>` : ''}
                </div>
            `;
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
        const stadiumName = event.stadium ? getStadiumName(event.stadium) : "Stade non défini";
        stadium.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 20h20"/>
            <path d="M12 2L2 8l10 6 10-6-10-6z"/>
            <path d="M4 14l8 6 8-6"/>
        </svg> ${stadiumName}`;

        const details = document.createElement('div');
        details.className = 'ticket-details';

        const leftSection = document.createElement('div');
        leftSection.className = 'ticket-info';

        const count = document.createElement('div');
        count.className = 'ticket-count';
        count.textContent = `${ticket.ticket_count} billet${ticket.ticket_count > 1 ? 's' : ''}`;

        const totalPrice = document.createElement('div');
        totalPrice.className = 'ticket-price';
        totalPrice.textContent = `${ticket.price * ticket.ticket_count} €`;

        leftSection.appendChild(count);
        leftSection.appendChild(totalPrice);

        const qrButton = document.createElement('button');
        qrButton.className = 'qr-button';
        qrButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <rect x="7" y="7" width="3" height="3"></rect>
                <rect x="14" y="7" width="3" height="3"></rect>
                <rect x="7" y="14" width="3" height="3"></rect>
                <rect x="14" y="14" width="3" height="3"></rect>
            </svg>
            Voir QR Code
        `;

        qrButton.addEventListener('click', () => {
            showQRModal(ticket);
            modal.style.display = 'flex';
        });

        details.appendChild(leftSection);
        details.appendChild(qrButton);

        div.appendChild(header);
        div.appendChild(date);
        div.appendChild(teamsDiv);
        div.appendChild(stadium);
        div.appendChild(details);

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