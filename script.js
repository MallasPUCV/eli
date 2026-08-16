document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const progressText = document.getElementById("progress-text");
    const progressFill = document.getElementById("progress-fill");
    const creditsText = document.getElementById("credits-text");

    // ===== CLAVE LOCALSTORAGE ELI =====
    const STORAGE_KEY = "approvedCourses_ELI";

    // ===== CLAVE PRACTICA ELI =====
    const PRACTICA_KEY = "practica_aprobada_ELI";

    // ===== CARGAR RAMOS APROBADOS =====
    let approved = [];

    try {
        approved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        approved = [];
    }

    // ===== CARGAR PRACTICA =====
    let practicaAprobada =
        localStorage.getItem(PRACTICA_KEY) === "true";

    // ===== CREAR SWITCH PRACTICA =====
    const practicaContainer = document.createElement("div");

    practicaContainer.style.position = "absolute";
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
    practicaSlider.style.backgroundColor =
        practicaAprobada ? "#2ecc71" : "#e74c3c";
    practicaSlider.style.transition = "0.4s";
    practicaSlider.style.borderRadius = "26px";

    const practicaCircle = document.createElement("span");

    practicaCircle.style.position = "absolute";
    practicaCircle.style.height = "20px";
    practicaCircle.style.width = "20px";
    practicaCircle.style.left =
        practicaAprobada ? "26px" : "3px";
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

    // ===== CAMBIO DE PRACTICA =====
    practicaInput.addEventListener("change", () => {
        practicaAprobada = practicaInput.checked;

        localStorage.setItem(
            PRACTICA_KEY,
            practicaAprobada
        );

        practicaSlider.style.backgroundColor =
            practicaAprobada ? "#2ecc71" : "#e74c3c";

        practicaCircle.style.left =
            practicaAprobada ? "26px" : "3px";

        // ===== SI SE DESMARCA LA PRACTICA, QUITAR EIE630 =====
        if (
            !practicaAprobada &&
            approved.includes("EIE630")
        ) {
            removeWithDependents("EIE630");

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(approved)
            );
        }

        render();
    });

    // =====================================================
    // ===== LISTA COMPLETA DE RAMOS =======================
    // =====================================================

    const allCourses = [];
    const courseMap = {};

    for (let sem in semesters) {
        semesters[sem].forEach(course => {
            allCourses.push(course.code);
            courseMap[course.code] = course;
        });
    }

    // ===== LIMPIEZA AUTOMATICA =====

    approved = approved.filter(code =>
        allCourses.includes(code)
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(approved)
    );

    // =====================================================
    // ===== VALIDAR PRERREQUISITOS ========================
    // =====================================================

    function isUnlocked(course) {

        if (
            !course.prereq ||
            course.prereq.length === 0
        ) {
            return true;
        }

        // ===== REGLA PRACTICA PARA EIE630 =====

        if (
            course.code === "EIE630" &&
            !practicaAprobada
        ) {
            return false;
        }

        return course.prereq.every(req =>
            approved.includes(req)
        );
    }

    // =====================================================
    // ===== DESAPROBACION EN CASCADA =====================
    // =====================================================

    function removeWithDependents(code) {

        const toRemove = new Set();
        toRemove.add(code);

        let changed = true;

        while (changed) {

            changed = false;

            approved.forEach(c => {

                const prereq =
                    courseMap[c]?.prereq || [];

                if (
                    prereq.some(p =>
                        toRemove.has(p)
                    ) &&
                    !toRemove.has(c)
                ) {
                    toRemove.add(c);
                    changed = true;
                }

            });
        }

        approved = approved.filter(
            c => !toRemove.has(c)
        );
    }

    // =====================================================
    // ===== CALCULO DE CREDITOS ==========================
    // =====================================================

    function calculateApprovedCredits() {

        let total = 0;

        for (let sem in semesters) {

            semesters[sem].forEach(course => {

                if (
                    approved.includes(course.code)
                ) {
                    total +=
                        Number(course.credits) || 0;
                }

            });
        }

        return total;
    }

    function calculateTotalCredits() {

        let total = 0;

        for (let sem in semesters) {

            semesters[sem].forEach(course => {

                total +=
                    Number(course.credits) || 0;

            });
        }

        return total;
    }

    // =====================================================
    // ===== ACTUALIZAR PROGRESO ==========================
    // =====================================================

    function updateProgress() {

        const approvedCredits =
            calculateApprovedCredits();

        const totalCredits =
            calculateTotalCredits();

        const approvedCourses =
            approved.length;

        const totalCourses =
            allCourses.length;

        const percent =
            totalCredits === 0
                ? 0
                : (
                    (approvedCredits / totalCredits) *
                    100
                ).toFixed(1);

        progressFill.style.width =
            percent + "%";

        progressText.textContent =
            `Progreso: ${percent}%`;

        creditsText.innerHTML = `
            Créditos aprobados:
            ${approvedCredits} / ${totalCredits}<br>
            Ramos aprobados:
            ${approvedCourses} / ${totalCourses}
        `;
    }

    // =====================================================
    // ===== MOSTRAR / OCULTAR PRERREQUISITOS =============
    // =====================================================

    function createPrerequisiteSection(course) {

        // Si no tiene prerrequisitos, no se crea flecha
        if (
            !course.prereq ||
            course.prereq.length === 0
        ) {
            return null;
        }

        // ===== BOTON FLECHA =====

        const prereqButton =
            document.createElement("button");

        prereqButton.className =
            "prereq-button";

        prereqButton.type = "button";

        prereqButton.textContent = "▼";

        // ===== CONTENEDOR =====

        const prereqContainer =
            document.createElement("div");

        prereqContainer.className =
            "prereq-container";

        prereqContainer.style.display =
            "none";

        // ===== TITULO =====

        const prereqTitle =
            document.createElement("div");

        prereqTitle.className =
            "prereq-title";

        prereqTitle.textContent =
            "Prerrequisitos:";

        prereqContainer.appendChild(
            prereqTitle
        );

        // ===== CADA PRERREQUISITO =====

        course.prereq.forEach(reqCode => {

            const prereqCourse =
                courseMap[reqCode];

            const prereqItem =
                document.createElement("div");

            prereqItem.className =
                "prereq-item";

            if (
                approved.includes(reqCode)
            ) {

                prereqItem.classList.add(
                    "prereq-approved"
                );

            } else {

                prereqItem.classList.add(
                    "prereq-not-approved"
                );

            }

            if (prereqCourse) {

                prereqItem.innerHTML = `
                    <strong>${reqCode}</strong> -
                    ${prereqCourse.name}
                `;

            } else {

                prereqItem.textContent =
                    reqCode;

            }

            prereqContainer.appendChild(
                prereqItem
            );
        });

        // ===== ABRIR / CERRAR =====

        prereqButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const abierto =
                    prereqContainer.style.display !==
                    "none";

                if (abierto) {

                    prereqContainer.style.display =
                        "none";

                    prereqButton.textContent =
                        "▼";

                } else {

                    prereqContainer.style.display =
                        "block";

                    prereqButton.textContent =
                        "▲";
                }
            }
        );

        return {
            button: prereqButton,
            container: prereqContainer
        };
    }

    // =====================================================
    // ===== RENDER PRINCIPAL ==============================
    // =====================================================

    function render() {

        grid.innerHTML = "";

        for (
            let sem = 1;
            sem <= 11;
            sem++
        ) {

            if (!semesters[sem]) {
                continue;
            }

            const semDiv =
                document.createElement("div");

            semDiv.className =
                "semester";

            const title =
                document.createElement("h2");

            title.textContent =
                `S${sem}`;

            semDiv.appendChild(title);

            semesters[sem].forEach(course => {

                const div =
                    document.createElement("div");

                div.classList.add("course");

                // ===== COLORES POR SIGLA =====

                if (
                    course.code.startsWith("MAT")
                )
                    div.classList.add("mat");

                if (
                    course.code.startsWith("EIE")
                )
                    div.classList.add("eie");

                if (
                    course.code.startsWith("ICM")
                )
                    div.classList.add("icm");

                if (
                    course.code.startsWith("QUI")
                )
                    div.classList.add("qui");

                if (
                    course.code.startsWith("FIS")
                )
                    div.classList.add("fis");

                if (
                    course.code.startsWith("ING")
                )
                    div.classList.add("ing");

                if (
                    course.code.startsWith("FIN")
                )
                    div.classList.add("fin");

                if (
                    course.code.startsWith("DER")
                )
                    div.classList.add("der");

                if (
                    course.code.startsWith("EII")
                )
                    div.classList.add("eii");

                if (
                    course.code.startsWith("ICR") ||
                    course.code.startsWith("IER") ||
                    course.code.startsWith("FOFU")
                ) {
                    div.classList.add("rosado");
                }

                if (
                    course.code.startsWith("OPT")
                ) {
                    div.classList.add("opt");
                }

                // ===== CONTENIDO DEL RAMO =====

                div.innerHTML = `
                    <strong>${course.code}</strong><br>
                    ${course.name}<br>
                    <small>${course.credits} créditos</small>
                `;

                // ===== PRERREQUISITOS =====

                const prereqSection =
                    createPrerequisiteSection(course);

                if (prereqSection) {

                    div.appendChild(
                        prereqSection.button
                    );

                    div.appendChild(
                        prereqSection.container
                    );
                }

                // ===== ESTADO DEL RAMO =====

                const unlocked =
                    isUnlocked(course);

                if (
                    approved.includes(course.code)
                ) {

                    div.classList.add(
                        "approved"
                    );

                } else if (unlocked) {

                    div.classList.add(
                        "available"
                    );

                } else {

                    div.classList.add(
                        "locked"
                    );
                }

                // ===== CLICK PARA APROBAR =====

                if (
                    unlocked ||
                    approved.includes(course.code)
                ) {

                    div.addEventListener(
                        "click",
                        () => {

                            if (
                                approved.includes(
                                    course.code
                                )
                            ) {

                                removeWithDependents(
                                    course.code
                                );

                            } else {

                                approved.push(
                                    course.code
                                );
                            }

                            localStorage.setItem(
                                STORAGE_KEY,
                                JSON.stringify(
                                    approved
                                )
                            );

                            render();
                        }
                    );
                }

                semDiv.appendChild(div);
            });

            grid.appendChild(semDiv);
        }

        updateProgress();
    }

    render();
});
