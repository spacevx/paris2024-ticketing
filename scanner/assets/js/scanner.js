document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('scannerVideo');
    const startButton = document.getElementById('startButton');
    const toggleCameraButton = document.getElementById('toggleCameraButton');
    const ticketDetails = document.getElementById('ticketDetails');

    let scanning = false;
    let currentStream = null;
    let canvasElement = document.createElement('canvas');
    let canvas = canvasElement.getContext('2d');
    let availableCameras = [];
    let currentCameraIndex = 0;

    async function getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            availableCameras = devices.filter(device => device.kind === 'videoinput');
            console.log('Caméras disponibles:', availableCameras);
            return availableCameras;
        } catch (error) {
            console.error('Erreur caméras:', error);
            showNotification("Impossible d'accéder aux caméras", 3000);
            return [];
        }
    }

    async function startCamera(cameraIndex = 0) {
        if (currentStream) {
            stopCamera();
        }

        if (availableCameras.length === 0) {
            await getCameras();
        }

        if (availableCameras.length === 0) {
            showNotification('Aucune caméra disponible', 3000);
            return false;
        }

        currentCameraIndex = cameraIndex % availableCameras.length;
        const cameraId = availableCameras[currentCameraIndex].deviceId;

        try {
            const constraints = {
                video: {
                    deviceId: cameraId ? { exact: cameraId } : undefined,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment'
                }
            };

            currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = currentStream;

            return new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play();
                    resolve(true);
                };
            });
        } catch (error) {
            console.error('Erreur lors du démarrage de la caméra:', error);

            let errorMessage = 'Impossible de démarrer la caméra';

            if (error.name === 'NotAllowedError') {
                errorMessage = 'Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.';

                ticketDetails.innerHTML = `
                    <div class="ticket-valid error">
                        <p>❌ Accès à la caméra refusé</p>
                        <p style="font-size: 0.9rem; margin-top: 10px;">Pour résoudre ce problème:</p>
                        <ul style="text-align: left; margin-top: 10px; font-size: 0.9rem;">
                            <li>Vérifiez que vous avez autorisé l'accès à la caméra</li>
                            <li>Pour les tests en local, utilisez HTTPS ou modifiez les paramètres de votre navigateur</li>
                            <li>Si vous utilisez Chrome, activez l'option "Insecure origins treated as secure" dans chrome://flags/</li>
                        </ul>
                        <button id="simulateButton" class="scan-btn" style="margin-top: 15px; background-color: #e67e22;">
                            Simuler un scan (pour les tests)
                        </button>
                    </div>
                `;

                document.getElementById('simulateButton').addEventListener('click', () => {
                    const testQRData = 'test-ticket-123456';
                    processQRCode(testQRData);
                });
            }

            showNotification(errorMessage, 5000);
            return false;
        }
    }

    function stopCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
            video.srcObject = null;
        }
        scanning = false;
        startButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <rect x="7" y="7" width="3" height="3"></rect>
                <rect x="14" y="7" width="3" height="3"></rect>
                <rect x="7" y="14" width="3" height="3"></rect>
                <rect x="14" y="14" width="3" height="3"></rect>
            </svg>
            Démarrer
        `;
    }

    function scanQRCode() {
        if (!currentStream) return;

        requestAnimationFrame(scanQRCode);

        if (!scanning) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;

            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);

            try {
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    scanning = false;
                    startButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <rect x="7" y="7" width="3" height="3"></rect>
                            <rect x="14" y="7" width="3" height="3"></rect>
                            <rect x="7" y="14" width="3" height="3"></rect>
                            <rect x="14" y="14" width="3" height="3"></rect>
                        </svg>
                        Démarrer
                    `;

                    processQRCode(code.data);
                }
            } catch (error) {
                console.error('Erreur avec le check du QR CODE:', error);
            }
        }
    }

    async function processQRCode(qrData) {
        try {
            // Animation loading
            ticketDetails.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div class="loader"></div>
                    <p>Vérification du billet en cours...</p>
                </div>
            `;

            console.log("QR Code scanné:", qrData);
            let ticket;

            try {
                ticket = await fetchData("getInfo", qrData);
                console.log("Ticket trouvé:", ticket);
            } catch (error) {
                console.error("Erreur getInfo ticket:", error);

                ticketDetails.innerHTML = `
                    <div class="ticket-info">
                        <div class="info-item">
                            <span class="info-label">QR Code:</span>
                            <span class="info-value">${qrData}</span>
                        </div>
                    </div>
                    
                    <div class="ticket-valid error">
                        ❌ Billet invalide: QR code non reconnu
                    </div>
                `;

                showNotification('Billet invalide: QR code non reconnu', 3000);
                return;
            }

            const events = await fetchData("events");
            const event = events.find(e => e.id === ticket.event);

            const teams = await fetchData("teams");
            const homeTeam = teams.find(t => t.id === event.team_home);
            const awayTeam = teams.find(t => t.id === event.team_away);

            let userData = null;
            if (ticket && ticket.user) {
                userData = {
                    id: ticket.user,
                    username: ticket.user_info ? ticket.user_info.username : "utilisateur",
                    first_name: ticket.user_info ? ticket.user_info.first_name : "",
                    last_name: ticket.user_info ? ticket.user_info.last_name : "",
                    email: ticket.user_info ? ticket.user_info.email : ""
                }
            }

            let categories = [];
            if (ticket.categories && ticket.categories.length > 0) {
                categories = ticket.categories;
            } else if (ticket.category) {
                categories = [{ category: ticket.category, count: ticket.ticket_count || 1 }];
            }

            const userBlock = userData ? `
               <div class="user-info">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}" alt="Avatar" class="user-avatar">
                   <h3 class="user-name">${userData.first_name || ''} ${userData.last_name || ''}</h3>
                   <p class="user-email">${userData.email || ''}</p>
               </div>
           ` : '';

            const eventName = homeTeam && awayTeam ?
                `${homeTeam.name} vs ${awayTeam.name}` :
                "Événement #" + event.id;

            const categoriesHtml = categories.map(cat =>
                `<span class="category ${cat.category.toLowerCase()}">${cat.category} (${cat.count})</span>`
            ).join(' ');

            ticketDetails.innerHTML = `
               ${userBlock}
               
               <div class="ticket-info">
                   <div class="info-item">
                       <span class="info-label">Événement:</span>
                       <span class="info-value">${eventName}</span>
                   </div>
                   <div class="info-item">
                       <span class="info-label">Date:</span>
                       <span class="info-value">${formatDate(event.start)}</span>
                   </div>
                   <div class="info-item">
                       <span class="info-label">Stade:</span>
                       <span class="info-value">${getStadiumName(event.stadium)}</span>
                   </div>
                   <div class="info-item">
                       <span class="info-label">Catégorie(s):</span>
                       <span class="info-value">${categoriesHtml}</span>
                   </div>
                   <div class="info-item">
                       <span class="info-label">UUID:</span>
                       <span class="info-value">${ticket.uuid}</span>
                   </div>
               </div>
               
               <div class="ticket-valid success">
                   ✅ Billet valide
               </div>
           `;

            showNotification('Billet valide', 3000);
        } catch (error) {
            console.error('Erreur lors de la vérification du QR code:', error);

            ticketDetails.innerHTML = `
               <div class="ticket-info">
                   <div class="info-item">
                       <span class="info-label">QR Code:</span>
                       <span class="info-value">${qrData}</span>
                   </div>
               </div>
               
               <div class="ticket-valid error">
                   ❌ Erreur lors de la vérification: ${error.message || 'Veuillez réessayer'}
               </div>
           `;

            showNotification('Erreur lors de la vérification du QR code', 3000);
        } finally {
            // On ré active le scan
            setTimeout(() => {
                startButton.disabled = false;
            }, 1500);
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

    function getStadiumName(stadiumId) {
        if (window.APP && window.APP.STADIUMS) {
            const stadium = window.APP.STADIUMS.find(stadium => stadium.id === stadiumId);
            return stadium ? stadium.name : "Stade non trouvé";
        }
        return "Stade #" + stadiumId;
    }

    async function init() {
        await getCameras();

        if (availableCameras.length === 0) {
            ticketDetails.innerHTML = `
               <div class="ticket-valid error">
                   ❌ Aucune caméra n'est disponible sur cet appareil
               </div>
               <button id="simulateButton" class="scan-btn" style="margin-top: 15px; background-color: #e67e22;">
                   Simuler un scan (pour les tests)
               </button>
           `;
            startButton.disabled = true;
            toggleCameraButton.disabled = true;

            document.getElementById('simulateButton').addEventListener('click', () => {
                const testQRData = 'test-ticket-123456';
                processQRCode(testQRData);
            });
            return;
        }

        startButton.addEventListener('click', async () => {
            if (scanning) {
                scanning = false;
                startButton.innerHTML = `
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                       <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                       <rect x="7" y="7" width="3" height="3"></rect>
                       <rect x="14" y="7" width="3" height="3"></rect>
                       <rect x="7" y="14" width="3" height="3"></rect>
                       <rect x="14" y="14" width="3" height="3"></rect>
                   </svg>
                   Démarrer
               `;
            } else {
                if (!currentStream) {
                    const started = await startCamera(currentCameraIndex);
                    if (!started) return;
                }

                scanning = true;
                startButton.innerHTML = `
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                       <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
                   </svg>
                   Arrêter
               `;

                scanQRCode();
            }
        });

        toggleCameraButton.addEventListener('click', async () => {
            if (availableCameras.length <= 1) {
                showNotification('Une seule caméra disponible', 2000);
                return;
            }

            const wasScanning = scanning;
            scanning = false;

            const nextCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
            const started = await startCamera(nextCameraIndex);

            if (started && wasScanning) {
                scanning = true;
                scanQRCode();
            }

            showNotification(`Caméra ${nextCameraIndex + 1}/${availableCameras.length} activée`, 2000);
        });
    }

    init();
});