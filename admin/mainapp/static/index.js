/**
 * CREATE_EVENT_URL,
 * UPDATE_EVENT_URL
 * DELETE_EVENT_BASE_URL
 * 
 * sont définies dans le fichier HTML
*/

/**
 * Ouvre le modal pour créer un nouveau match
 * Initialise le formulaire avec des valeurs vides
 */
function openCreateEventModal() {
    document.getElementById('modalTitle').textContent = 'Créer un nouveau match';
    document.getElementById('eventForm').action = CREATE_EVENT_URL;
    document.getElementById('eventId').value = '';
    document.getElementById('eventForm').reset();
    openModal('eventModal');
}

/**
 * Permet de modifier un match
 * @param {string|number} eventId - Le handle du match à modifier
 */
function editEvent(eventId) {
    document.getElementById('modalTitle').textContent = 'Modifier le match';
    document.getElementById('eventForm').action = UPDATE_EVENT_URL;
    
    const event = events[eventId];
    if (!event) {
        console.error('Event non existant:', eventId);
        return;
    }
    
    document.getElementById('eventId').value = eventId;
    document.getElementById('homeTeam').value = event.team_home_id || '';
    document.getElementById('awayTeam').value = event.team_away_id || '';
    document.getElementById('stadium').value = event.stadium_id;
    document.getElementById('date').value = event.start;
    document.getElementById('score').value = event.score;
    
    openModal('eventModal');
}

/**
 * Permet de supprimer un match
 * @param {string|number} eventId - Le handle du match à supprimer
 */
function deleteEvent(eventId) {
    document.getElementById('deleteForm').action = DELETE_EVENT_BASE_URL.replace('0', eventId);
    openModal('deleteModal');
}

/**
 * Affiche un modal
 * @param {string} modalId - Le handle du modal à afficher
 */
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

/**
 * Masque un modal
 * @param {string} modalId - Le handle du modal à masquer
 */
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

/**
 * Listeners pour les bouttons
 */
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-id');
            editEvent(eventId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-id');
            deleteEvent(eventId);
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(modal.id);
            }
        });
    });
});