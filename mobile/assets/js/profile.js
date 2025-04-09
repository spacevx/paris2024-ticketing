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
        
        if (ticket.categories && Array.isArray(ticket.categories)) {
            const categorySelector = document.createElement('div');
            categorySelector.className = 'category-selector';
            
            const selectorTitle = document.createElement('div');
            selectorTitle.className = 'selector-title';
            selectorTitle.textContent = 'Sélectionnez une catégorie:';
            categorySelector.appendChild(selectorTitle);
            
            const categoryButtons = document.createElement('div');
            categoryButtons.className = 'category-buttons';
            
            let selectedCategory = null;
            let selectedCategoryData = null;
            
            ticket.categories.forEach(categoryObj => {
                const button = document.createElement('button');
                button.className = 'category-select-btn';
                button.dataset.category = categoryObj.category;
                button.innerHTML = `
                    <span class="category ${categoryObj.category.toLowerCase()}">${categoryObj.category}</span>
                    <span class="count">${categoryObj.count} billet${categoryObj.count > 1 ? 's' : ''}</span>
                `;
                
                button.addEventListener('click', () => {
                    document.querySelectorAll('.category-select-btn').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    
                    button.classList.add('selected');
                    
                    selectedCategory = categoryObj.category;
                    selectedCategoryData = categoryObj;
                    
                    displayQRCodes(selectedCategoryData);
                });
                
                categoryButtons.appendChild(button);
                
                if (!selectedCategory) {
                    button.classList.add('selected');
                    selectedCategory = categoryObj.category;
                    selectedCategoryData = categoryObj;
                }
            });
            
            categorySelector.appendChild(categoryButtons);
            modalBody.appendChild(categorySelector);
            
            const qrWrapper = document.createElement('div');
            qrWrapper.id = 'qrCodeContainer';
            qrWrapper.className = 'qr-wrapper';
            modalBody.appendChild(qrWrapper);
            
            function displayQRCodes(categoryData) {
                const qrWrapper = document.getElementById('qrCodeContainer');
                qrWrapper.innerHTML = '';
                
                if (categoryData.single_tickets && categoryData.single_tickets.length > 0) {
                    const sliderContainer = document.createElement('div');
                    sliderContainer.className = 'qr-slider';
                    
                    // const prevButton = document.createElement('button');
                    // prevButton.className = 'slider-control prev';
                    // prevButton.setAttribute('aria-label', 'Billet précédent');
                    // prevButton.innerHTML = '←';
                    
                    // const nextButton = document.createElement('button');
                    // nextButton.className = 'slider-control next';
                    // nextButton.setAttribute('aria-label', 'Billet suivant');
                    // nextButton.innerHTML = '→';
                    
                    const counter = document.createElement('div');
                    counter.className = 'slider-counter';
                    
                    const qrDisplay = document.createElement('div');
                    qrDisplay.className = 'qr-display';
                    
                    // sliderContainer.appendChild(prevButton);
                    sliderContainer.appendChild(qrDisplay);
                    // sliderContainer.appendChild(nextButton);
                    sliderContainer.appendChild(counter);
                    
                    let currentIndex = 0;
                    
                    function updateQRCode() {
                        qrDisplay.innerHTML = '';
                        counter.textContent = `${currentIndex + 1}/${categoryData.single_tickets.length}`;
                        
                        new QRCode(qrDisplay, {
                            text: categoryData.single_tickets[currentIndex].uuid,
                            width: 256,
                            height: 256,
                            colorDark: "#1B1F3B",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.H
                        });
                    }
                    
                    // prevButton.onclick = () => {
                    //     currentIndex = (currentIndex - 1 + categoryData.single_tickets.length) % categoryData.single_tickets.length;
                    //     updateQRCode();
                    // };
                    
                    // nextButton.onclick = () => {
                    //     currentIndex = (currentIndex + 1) % categoryData.single_tickets.length;
                    //     updateQRCode();
                    // };
                    
                    qrWrapper.appendChild(sliderContainer);
                    updateQRCode();
                } else if (categoryData.count > 1) {
                    const sliderContainer = document.createElement('div');
                    sliderContainer.className = 'qr-slider';
                    
                    // const prevButton = document.createElement('button');
                    // prevButton.className = 'slider-control prev';
                    // prevButton.setAttribute('aria-label', 'Billet précédent');
                    // prevButton.innerHTML = '←';
                    
                    // const nextButton = document.createElement('button');
                    // nextButton.className = 'slider-control next';
                    // nextButton.setAttribute('aria-label', 'Billet suivant');
                    // nextButton.innerHTML = '→';
                    
                    const counter = document.createElement('div');
                    counter.className = 'slider-counter';
                    
                    const qrDisplay = document.createElement('div');
                    qrDisplay.className = 'qr-display';
                    
                    // sliderContainer.appendChild(prevButton);
                    sliderContainer.appendChild(qrDisplay);
                    // sliderContainer.appendChild(nextButton);
                    sliderContainer.appendChild(counter);
                    
                    let currentIndex = 0;
                    
                    function updateQRCode() {
                        qrDisplay.innerHTML = '';
                        counter.textContent = `${currentIndex + 1}/${categoryData.count}`;
                        
                        new QRCode(qrDisplay, {
                            text: `${categoryData.uuid || ticket.uuid}-${categoryData.category}-${currentIndex + 1}`,
                            width: 256,
                            height: 256,
                            colorDark: "#1B1F3B",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.H
                        });
                    }
                    
                    // prevButton.onclick = () => {
                    //     currentIndex = (currentIndex - 1 + categoryData.count) % categoryData.count;
                    //     updateQRCode();
                    // };
                    
                    // nextButton.onclick = () => {
                    //     currentIndex = (currentIndex + 1) % categoryData.count;
                    //     updateQRCode();
                    // };
                    
                    qrWrapper.appendChild(sliderContainer);
                    updateQRCode();
                } else {
                    new QRCode(qrWrapper, {
                        text: categoryData.uuid || (ticket.uuid ? `${ticket.uuid}-${categoryData.category}` : "ticket-error"),
                        width: 256,
                        height: 256,
                        colorDark: "#1B1F3B",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
            }
            
            if (selectedCategoryData) {
                displayQRCodes(selectedCategoryData);
            }
        } else {
            const qrWrapper = document.createElement('div');
            qrWrapper.id = 'qrCodeContainer';
            
            if (ticket.single_tickets && ticket.single_tickets.length > 0) {
                const sliderContainer = document.createElement('div');
                sliderContainer.className = 'qr-slider';
                
                // const prevButton = document.createElement('button');
                // prevButton.className = 'slider-control prev';
                // prevButton.setAttribute('aria-label', 'Billet précédent');
                // prevButton.innerHTML = '←';
                
                // const nextButton = document.createElement('button');
                // nextButton.className = 'slider-control next';
                // nextButton.setAttribute('aria-label', 'Billet suivant');
                // nextButton.innerHTML = '→';
                
                const counter = document.createElement('div');
                counter.className = 'slider-counter';
                
                // sliderContainer.appendChild(prevButton);
                sliderContainer.appendChild(qrWrapper);
                sliderContainer.appendChild(nextButton);
                sliderContainer.appendChild(counter);
                
                let currentIndex = 0;
                
                function updateQRCode() {
                    qrWrapper.innerHTML = '';
                    counter.textContent = `${currentIndex + 1}/${ticket.single_tickets.length}`;
                    
                    new QRCode(qrWrapper, {
                        text: ticket.single_tickets[currentIndex].uuid,
                        width: 256,
                        height: 256,
                        colorDark: "#1B1F3B",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
                
                // prevButton.onclick = () => {
                //     currentIndex = (currentIndex - 1 + ticket.single_tickets.length) % ticket.single_tickets.length;
                //     updateQRCode();
                // };
                
                // nextButton.onclick = () => {
                //     currentIndex = (currentIndex + 1) % ticket.single_tickets.length;
                //     updateQRCode();
                // };
                
                modalBody.appendChild(sliderContainer);
                updateQRCode();
            } else if (ticket.ticket_count > 1) {
                const sliderContainer = document.createElement('div');
                sliderContainer.className = 'qr-slider';
                
                // const prevButton = document.createElement('button');
                // prevButton.className = 'slider-control prev';
                // prevButton.setAttribute('aria-label', 'Billet précédent');
                // prevButton.innerHTML = '←';
                
                // const nextButton = document.createElement('button');
                // nextButton.className = 'slider-control next';
                // nextButton.setAttribute('aria-label', 'Billet suivant');
                // nextButton.innerHTML = '→';
                
                const counter = document.createElement('div');
                counter.className = 'slider-counter';
                
                // sliderContainer.appendChild(prevButton);
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
                
                // prevButton.onclick = () => {
                //     currentIndex = (currentIndex - 1 + ticket.ticket_count) % ticket.ticket_count;
                //     updateQRCode();
                // };
                
                // nextButton.onclick = () => {
                //     currentIndex = (currentIndex + 1) % ticket.ticket_count;
                //     updateQRCode();
                // };
                
                modalBody.appendChild(sliderContainer);
                updateQRCode();
            } else {
                modalBody.appendChild(qrWrapper);
                
                new QRCode(qrWrapper, {
                    text: ticket.uuid || (ticket.single_tickets && ticket.single_tickets[0] ? ticket.single_tickets[0].uuid : "ticket-error"),
                    width: 256,
                    height: 256,
                    colorDark: "#1B1F3B",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
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

    logoutBtn.addEventListener('click', async () => {
        await clearSession();
        window.location.href = '../index.html';
    });

    
    function createTicketCard(ticket, event, teams, index) {
        const div = document.createElement('div');
        div.className = 'ticket-card';
        div.style.setProperty('--animation-order', index);
    
        if (event.score && event.score.trim() !== '') {
            div.classList.add('has-score');
        }
    
        const header = document.createElement('div');
        header.className = 'ticket-header';
    
        if (ticket.categories && Array.isArray(ticket.categories)) {
            /* Si plusieurs catégories */
            ticket.categories.forEach(categoryObj => {
                const category = document.createElement('span');
                const categoryClass = categoryObj.category.toLowerCase();
                category.className = `category ${categoryClass}`;
                category.textContent = `${categoryObj.category} (${categoryObj.count})`;
                header.appendChild(category);
                
                /* Espace entre les catégories */
                if (ticket.categories.indexOf(categoryObj) < ticket.categories.length - 1) {
                    const spacer = document.createElement('span');
                    spacer.className = 'category-spacer';
                    header.appendChild(spacer);
                }
            });
        } else {
            const category = document.createElement('span');
            const categoryClass = ticket.category.toLowerCase();
            category.className = `category ${categoryClass}`;
            category.textContent = ticket.category;
            header.appendChild(category);
        }
    
        const date = document.createElement('div');
        date.className = 'match-date';
        date.textContent = formatDate(event.start);
    
        const teamsDiv = document.createElement('div');
        teamsDiv.className = 'match-teams';
    
        const homeTeam = getTeamById(event.team_home, teams);
        const awayTeam = getTeamById(event.team_away, teams);
    
        if (homeTeam && awayTeam) {
            if (event.score && event.score.trim() !== '') {
                teamsDiv.innerHTML = `
                    <div class="team">
                        <span class="fi fi-${homeTeam.code.toLowerCase()} team-flag"></span>
                        <span class="team-name">${homeTeam.name}</span>
                        ${homeTeam.nickname ? `<span class="team-nickname">${homeTeam.nickname}</span>` : ''}
                    </div>
                    <span class="vs score-display">${event.score}</span>
                    <div class="team">
                        <span class="fi fi-${awayTeam.code.toLowerCase()} team-flag"></span>
                        <span class="team-name">${awayTeam.name}</span>
                        ${awayTeam.nickname ? `<span class="team-nickname">${awayTeam.nickname}</span>` : ''}
                    </div>
                `;
            } else {
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
            }
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
    
        let totalTickets = 0;
        let totalPrice = 0;
    
        if (ticket.categories && Array.isArray(ticket.categories)) {
            ticket.categories.forEach(categoryObj => {
                totalTickets += categoryObj.count;
                totalPrice += categoryObj.price * categoryObj.count;
            });
        } else {
            totalTickets = ticket.ticket_count;
            totalPrice = ticket.price * ticket.ticket_count;
        }
    
        const count = document.createElement('div');
        count.className = 'ticket-count';
        count.textContent = `${totalTickets} billet${totalTickets > 1 ? 's' : ''}`;
    
        const priceElem = document.createElement('div');
        priceElem.className = 'ticket-price';
        priceElem.textContent = `${totalPrice} €`;
    
        leftSection.appendChild(count);
        leftSection.appendChild(priceElem);
    
        const qrButton = document.createElement('button');
        
        const qrIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <rect x="7" y="7" width="3" height="3"></rect>
            <rect x="14" y="7" width="3" height="3"></rect>
            <rect x="7" y="14" width="3" height="3"></rect>
            <rect x="14" y="14" width="3" height="3"></rect>
        </svg>`;
        
        if (event.score && event.score.trim() !== '') {
            qrButton.className = 'qr-button match-finished';
            qrButton.innerHTML = `${qrIcon} Voir QR Code`;
        } else {
            qrButton.className = 'qr-button';
            qrButton.innerHTML = `${qrIcon} Voir QR Code`;
        }
    
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