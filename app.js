if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

let pocetVyher = 0;
let vyhra = 0;
let celkemPrachu = 1000; // Začínáme s nějakým počátečním množstvím peněz

// Seznam symbolů
let zasobnik_znaku = ["⭐", "❤️", "🍕", "🍖", "🌍"];

// Funkce pro získání náhodného znaku z pole
function getRandomZnak() {
    const num = Math.floor(Math.random() * zasobnik_znaku.length);
    return zasobnik_znaku[num];
}

let autoSpinInterval = null; // Inicializace proměnné pro sledování autospinu

// Funkce pro roztáčení kotouče
function Roztoc() {
    const vlozenePrachy = parseInt(document.getElementById("sazka").value) || 0;
    if (vlozenePrachy <= 0) return alert("Zadejte platnou částku!");

    celkemPrachu -= vlozenePrachy;
    document.getElementById("stavPenezValue").textContent = celkemPrachu;

    // Počáteční animace
    let kotouce = document.querySelectorAll("#kotouce div");
    kotouce.forEach((kotouc) => {
        kotouc.textContent = getRandomZnak();
    });

    // Nastavení intervalů pro změnu symbolů během točení
    let intervaly = [100, 200, 300];
    let pocitadlo = 0;

    let interval = setInterval(function() {
        kotouce.forEach((kotouc) => {
            kotouc.textContent = getRandomZnak();
        });
        pocitadlo++;

        // Po dokončení animace zastavit interval a ukázat výsledek
        if (pocitadlo >= 15) {
            clearInterval(interval);
            // Konec animace, získání konečných symbolů
            kotouce.forEach((kotouc) => {
                kotouc.textContent = getRandomZnak(); // Nastavení posledního symbolu
            });

            const first = document.getElementById("first").textContent;
            const second = document.getElementById("second").textContent;
            const third = document.getElementById("third").textContent;

            if (first === second && second === third) {
                vyhra = vlozenePrachy * 25; // Výhra je vklad * 15
                pocetVyher++;
                document.getElementById("vysledek").textContent = "Počet výher: " + pocetVyher;
                document.getElementById("Vydelano").textContent = "Vyhráváte: " + vyhra + " CZK";
                celkemPrachu += vyhra;
                document.getElementById("stavPenezValue").textContent = celkemPrachu;

                // Animace pro kotouče, když uživatel vyhraje
                kotouce.forEach((kotouc) => {
                    kotouc.classList.add("winEffect");
                });

                // Odstranění efektu po 1 sekunde (aby mohl být znovu použit)
                setTimeout(() => {
                    kotouce.forEach((kotouc) => {
                        kotouc.classList.remove("winEffect");
                    });
                }, 1000);
            } else {
                document.getElementById("Vydelano").textContent = "Bohužel, nic jste nevyhráli.";
            }
        }
    }, 100); // Interval mezi změnami znaků (100ms)
}

// Start AutoSpin
function startAutoSpin() {
    if (autoSpinInterval !== null) return;  // Pokud už běží, neaktivujeme nový interval
    autoSpinInterval = setInterval(Roztoc, 2000); // Automatický spin každé 2 sekundy
    document.querySelector("#autospinForm button").textContent = "AutoSpin běží";  // Změna textu tlačítka
}

// Stop AutoSpin
function stopAutoSpin() {
    if (autoSpinInterval !== null) {
        clearInterval(autoSpinInterval);  // Zastavení intervalového autospinu
        autoSpinInterval = null;  // Resetování proměnné
        document.querySelector("#autospinForm button").textContent = "Start AutoSpin";  // Reset textu tlačítka
    }
}

// Připojit event listener k tlačítkům pro spuštění/zastavení autospinu
document.getElementById("startAutoSpinButton").addEventListener("click", startAutoSpin);
document.getElementById("stopAutoSpinButton").addEventListener("click", stopAutoSpin);

