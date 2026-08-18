// FLUJO Y LÓGICA DE JUEGO
let teamName = "Equipo Ciber";
let bossInstance = null;

function initQuiz() {
    const input = document.getElementById("playerName").value.trim();
    if (input !== "") teamName = input;
    
    document.getElementById("welcomeCard").classList.add("hidden");
    document.getElementById("quizCard").classList.remove("hidden");
}

function startCollapse() {
    document.getElementById("ans1").classList.add("fall-1");
    document.getElementById("ans2").classList.add("fall-2");
    document.getElementById("ans3").classList.add("fall-3");
    
    sounds.play('alarm');

    setTimeout(() => {
        document.getElementById("quizCard").classList.add("hidden");
        const warning = document.getElementById("warningOverlay");
        warning.classList.remove("hidden");

        let alarmInterval = setInterval(() => sounds.play('alarm'), 280);

        setTimeout(() => {
            clearInterval(alarmInterval);
            warning.classList.add("hidden");
            document.getElementById("canvasWrapper").classList.remove("hidden");
            
            // Iniciar Jefe Omega
            bossInstance = new BossEngine("bossCanvas");
            bossInstance.start();
        }, 2300);
    }, 900);
}

function onBossDefeated() {
    document.getElementById("canvasWrapper").classList.add("hidden");
    triggerMassiveAdware();
}

// INUNDACIÓN DE POPUPS ADWARE
const scamTexts = [
    "⚠️ ¡GANASTE UN IPHONE 17 PRO! Haz clic para reclamar",
    "🚨 Su cuenta bancaria ha sido BLOQUEADA temporalmente.",
    "💰 ¡Transferencia de $5,000 USD pendiente de aprobación!",
    "👾 999 VIRUS DETECTADOS. Descargue CleanPC_Pro.exe",
    "🛑 ¡ALERTA DE SEGURIDAD CRÍTICA DEL SISTEMA!",
    "🎁 ¡Felicidades Usuario! Fuiste seleccionado hoy."
];

function triggerMassiveAdware() {
    const timerBanner = document.getElementById("timerBanner");
    const timerSeconds = document.getElementById("timerSeconds");
    timerBanner.classList.remove("hidden");

    let timeLeft = 20;

    const popupInterval = setInterval(() => {
        createRetroPopup(scamTexts[Math.floor(Math.random() * scamTexts.length)]);
        sounds.play('pop');
    }, 190);

    const countdown = setInterval(() => {
        timeLeft--;
        timerSeconds.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(popupInterval);
            clearInterval(countdown);
            timerBanner.classList.add("hidden");

            // Limpiar popups
            document.querySelectorAll(".retro-popup").forEach(el => el.remove());

            // Pantalla final con botón evasivo
            showFinalScreen();
        }
    }, 1000);
}

function createRetroPopup(text) {
    const pop = document.createElement("div");
    pop.className = "retro-popup";

    const rx = Math.floor(Math.random() * (window.innerWidth - 320));
    const ry = Math.floor(Math.random() * (window.innerHeight - 200));
    pop.style.left = `${Math.max(10, rx)}px`;
    pop.style.top = `${Math.max(10, ry)}px`;

    pop.innerHTML = `
        <div class="popup-title-bar">
            <span>⚠️ ADVERTENCIA DEL SISTEMA</span>
            <div class="close-btn-x" onclick="this.parentElement.parentElement.remove()">✕</div>
        </div>
        <div class="popup-content">
            <p>${text}</p>
            <button class="popup-action-btn" onclick="this.parentElement.parentElement.remove()">BLOQUEAR</button>
        </div>
    `;

    document.body.appendChild(pop);
}

// PANTALLA FINAL Y BOTÓN ESCAPISTA "NO"
function showFinalScreen() {
    document.getElementById("finalTeamName").innerText = teamName;
    document.getElementById("finalCard").classList.remove("hidden");
    setupEvasiveButton();
}

function setupEvasiveButton() {
    const btnNo = document.getElementById("btnNo");
    const container = document.getElementById("feedbackArea");

    function moveNoButton() {
        sounds.play('dodge');
        const containerRect = container.getBoundingClientRect();
        const btnRect = btnNo.getBoundingClientRect();

        const maxX = containerRect.width - btnRect.width - 20;
        const maxY = containerRect.height - btnRect.height - 20;

        const newX = Math.max(10, Math.floor(Math.random() * maxX));
        const newY = Math.max(10, Math.floor(Math.random() * maxY));

        btnNo.style.left = `${newX}px`;
        btnNo.style.top = `${newY}px`;
    }

    btnNo.addEventListener("mouseover", moveNoButton);
    btnNo.addEventListener("touchstart", (e) => {
        e.preventDefault();
        moveNoButton();
    });
}

function confirmYes() {
    alert(`¡Gracias por tu confirmación, ${teamName}! 🎉 ¡Has superado con éxito toda la experiencia interactiva!`);
}
