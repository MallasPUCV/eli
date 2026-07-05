document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const progressText = document.getElementById("progress-text");
    const progressFill = document.getElementById("progress-fill");
    const creditsText = document.getElementById("credits-text");

    // ===== CLAVE LOCALSTORAGE ELA =====
    const STORAGE_KEY = "approvedCourses_ELI";

    // ===== CLAVE PRACTICA ELA =====
    const PRACTICA_KEY = "practica_aprobada_ELI";

    // ===== CARGAR RAMOS APROBADOS DESDE LOCALSTORAGE =====
    let approved = [];
    try {
        approved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        approved = [];
    }

    // ===== CARGAR PRACTICA DESDE LOCALSTORAGE =====
    let practicaAprobada = localStorage.getItem(PRACTICA_KEY) === "true";

    // ===== CREAR SWITCH PRACTICA (ARRIBA DERECHA) =====
    const practicaContainer = document.createElement("div");
    practicaContainer.style.position = "absolute"; // 🔴 CAMBIO AQUÍ (ANTES fixed)
    practicaContainer.style.top = "20px";
    practicaContainer.style.right = "20px";
    practicaContainer.style.zIndex = "9999";
    practicaContainer.style.display = "flex";
    practicaContainer.style.alignItems = "center";
    practicaContainer.style.gap = "10px";
    practicaContainer.style.fontWeight = "bold";

    const practicaLabel = document.createElement("span");
    practicaLabel.textContent = "Práctica aprobada";

    const practicaSwitch = document.createElement("label");
    practicaSwitch.style.position = "relative";
    practicaSwitch.style.display = "inline-block";
    practicaSwitch.style.width = "50px";
    practicaSwitch.style.height = "26px";

    const practicaInput = document.createElement("input");
    practicaInput.type = "checkbox";
    practicaInput.checked = practicaAprobada;
    practicaInput.style.opacity = "0";
    practicaInput.style.width = "0";
    practicaInput.style.height = "0";

    const practicaSlider = document.createElement("span");
    practicaSlider.style.position = "absolute";
    practicaSlider.style.cursor = "pointer";
    practicaSlider.style.top = "0";
    practicaSlider.style.left = "0";
    practicaSlider.style.right = "0";
    practicaSlider.style.bottom = "0";
    practicaSlider.style.backgroundColor = practicaAprobada ? "#2ecc71" : "#e74c3c";
    practicaSlider.style.transition = "0.4s";
    practicaSlider.style.borderRadius = "26px";

    const practicaCircle = document.createElement("span");
    practicaCircle.style.position = "absolute";
    practicaCircle.style.height = "20px";
    practicaCircle.style.width = "20px";
    practicaCircle.style.left = practicaAprobada ? "26px" : "3px";
    practicaCircle.style.bottom = "3px";
    practicaCircle.style.backgroundColor = "white";
    practicaCircle.style.transition = "0.4s";
    practicaCircle.style.borderRadius = "50%";

    practicaSlider.appendChild(practicaCircle);
    practicaSwitch.appendChild(practicaInput);
    practicaSwitch.appendChild(practicaSlider);
    practicaContainer.appendChild(practicaLabel);
    practicaContainer.appendChild(practicaSwitch);
    document.body.appendChild(practicaContainer);

    practicaInput.addEventListener("change", () => {
        practicaAprobada = practicaInput.checked;
        localStorage.setItem(PRACTICA_KEY, practicaAprobada);

        practicaSlider.style.backgroundColor = practicaAprobada ? "#2ecc71" : "#e74c3c";
        practicaCircle.style.left = practicaAprobada ? "26px" : "3px";

        // ===== SI SE DESMARCA LA PRACTICA, QUITAR EIE620 =====
        if (!practicaAprobada && approved.includes("EIE630")) {
            removeWithDependents("EIE630");

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(approved)
            );
        }

        render();
    });

    // ===== LISTA COMPLETA DE RAMOS =====
    const allCourses = [];
    const courseMap = {};

    for (let sem in semesters) {
        semesters[sem].forEach(course => {
            allCourses.push(course.code);
            courseMap[course.code] = course;
        });
    }

    // ===== LIMPIEZA AUTOMÁTICA (POR SI CAMBIAS DATA) =====
    approved = approved.filter(code => allCourses.includes(code));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(approved));

    // ===== VALIDAR PRERREQUISITOS =====
    function isUnlocked(course) {
        if (!course.prereq || course.prereq.length === 0) {
            return true;
        }

        // ===== REGLA PRACTICA PARA EIE620 =====
        if (course.code === "EIE620" && !practicaAprobada) {
            return false;
        }

        return course.prereq.every(req => approved.includes(req));
    }

    // ===== DESAPROBACIÓN EN CASCADA =====
    function removeWithDependents(code) {
        const toRemove = new Set();
        toRemove.add(code);

        let changed = true;
        while (changed) {
            changed = false;

            approved.forEach(c => {
                const prereq = courseMap[c]?.prereq || [];
                if (prereq.some(p => toRemove.has(p)) && !toRemove.has(c)) {
                    toRemove.add(c);
                    changed = true;
                }
            });
        }

        approved = approved.filter(c => !toRemove.has(c));
    }

    // ===== CÁLCULO DE CRÉDITOS =====
    function calculateApprovedCredits() {
        let total = 0;
        for (let sem in semesters) {
            semesters[sem].forEach(course => {
                if (approved.includes(course.code)) {
                    total += Number(course.credits) || 0;
                }
            });
        }
        return total;
    }

    function calculateTotalCredits() {
        let total = 0;
        for (let sem in semesters) {
            semesters[sem].forEach(course => {
                total += Number(course.credits) || 0;
            });
        }
        return total;
    }

    // ===== ACTUALIZAR PROGRESO =====
    function updateProgress() {
        const approvedCredits = calculateApprovedCredits();
        const totalCredits = calculateTotalCredits();

        const approvedCourses = approved.length;
        const totalCourses = allCourses.length;

        const percent = totalCredits === 0
            ? 0
            : ((approvedCredits / totalCredits) * 100).toFixed(1);

        progressFill.style.width = percent + "%";
        progressText.textContent = `Progreso: ${percent}%`;
        creditsText.innerHTML = `
            Créditos aprobados: ${approvedCredits} / ${totalCredits}<br>
            Ramos aprobados: ${approvedCourses} / ${totalCourses}
        `;
    }

    // ===== RENDER PRINCIPAL =====
    function render() {
        grid.innerHTML = "";

        for (let sem = 1; sem <= 11; sem++) {
            if (!semesters[sem]) continue;

            const semDiv = document.createElement("div");
            semDiv.className = "semester";

            const title = document.createElement("h2");
            title.textContent = `S${sem}`;
            semDiv.appendChild(title);

            semesters[sem].forEach(course => {
                const div = document.createElement("div");
                div.classList.add("course");

                if (course.code.startsWith("MAT")) div.classList.add("mat");
                if (course.code.startsWith("EIE")) div.classList.add("eie");
                if (course.code.startsWith("QUI")) div.classList.add("qui");
                if (course.code.startsWith("FIS")) div.classList.add("fis");
                if (course.code.startsWith("ING")) div.classList.add("ing");
                if (course.code.startsWith("FIN")) div.classList.add("fin");
                if (course.code.startsWith("DER")) div.classList.add("der");
                if (course.code.startsWith("EII")) div.classList.add("eii");

                if (
                    course.code.startsWith("ICR") ||
                    course.code.startsWith("IER") ||
                    course.code.startsWith("FOFU")
                ) div.classList.add("rosado");

                if (course.code.startsWith("OPT")) div.classList.add("opt");

                div.innerHTML = `
                    <strong>${course.code}</strong><br>
                    ${course.name}<br>
                    <small>${course.credits} créditos</small>
                `;

                const unlocked = isUnlocked(course);

                if (approved.includes(course.code)) {
                    div.classList.add("approved");
                } else if (unlocked) {
                    div.classList.add("available");
                } else {
                    div.classList.add("locked");
                }

                if (unlocked || approved.includes(course.code)) {
                    div.addEventListener("click", () => {
                        if (approved.includes(course.code)) {
                            removeWithDependents(course.code);
                        } else {
                            approved.push(course.code);
                        }

                        localStorage.setItem(
                            STORAGE_KEY,
                            JSON.stringify(approved)
                        );

                        render();
                    });
                }

                semDiv.appendChild(div);
            });

            grid.appendChild(semDiv);
        }

        updateProgress();
    }

    render();
});
