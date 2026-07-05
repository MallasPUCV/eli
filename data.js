const semesters = {
    1: [
        { code: "EIE142", name: "Introducción a la Ingeniería Electrica y Electrónica", prereq: [], credits: 3 },
        { code: "FIN100", name: "Desarrollo Integral y Comunicación Para Ingeniería", prereq: [], credits: 3 },
        { code: "FIS1121", name: "Introducción a la Física", prereq: [], credits: 5 },
        { code: "MAT1001", name: "Fundamentos de Matematicas para Ingenieria", prereq: [], credits: 6 },
        { code: "IER010", name: "Antropologia Cristiana", prereq: [], credits: 2 }
    ],
    2: [
        { code: "FIS1001", name: "Física Mecanica", prereq: ["MAT1001"], credits: 5 },
        { code: "MAT1002", name: "Cálculo Diferencial e Integral", prereq: ["MAT1001"], credits: 6 },
        { code: "MAT1004", name: "Algebra Lineal", prereq: ["MAT1001"], credits: 4 },
        { code: "QUI1140", name: "Fundamentos de Quimica", prereq: [], credits: 4 }
    ],
    3: [
        { code: "EIE100", name: "Programación", prereq: [], credits: 4 },
        { code: "EIE253", name: "Tecno Mecanica de Materiales", prereq: ["QUI1140"], credits: 2 },
        { code: "FIS1141", name: "Fisica General: Ondas y Termodinamica", prereq: ["FIS1001"], credits: 3 },
        { code: "MAT1003", name: "Cálculo en Varias Variables", prereq: ["MAT1002"], credits: 4 },
        { code: "MAT1005", name: "Ecuaciones Diferenciales", prereq: ["MAT1004"], credits: 4 },
        { code: "IER020", name: "Etica Cristiana", prereq: [], credits: 2 }
    ],
    4: [
        { code: "EIE211", name: "Estadistica y Probabilidades Para Ingeniería", prereq: ["MAT1002"], credits: 3 },
        { code: "EIE267", name: "Electromagnetismo", prereq: ["MAT1003"], credits: 4 },
        { code: "EIE274", name: "Laboratorio de Mediciones", prereq: ["MAT1005"], credits: 3 },
        { code: "EIE275", name: "Señales y Sistemas", prereq: ["MAT1003"], credits: 4 },
        { code: "EIE280", name: "Teoría de Circuitos 1", prereq: ["MAT1005"], credits: 4 },
        { code: "FOFU1", name: "Formacion Fundamental 1", prereq: [], credits: 2 }
    ],
    5: [
        { code: "EIE200", name: "Programacion Numerica", prereq: ["EIE100"], credits: 3 },
        { code: "EIE315", name: "Control Automatico", prereq: ["EIE275"], credits: 4 },
        { code: "EIE318", name: "Campos y Ondas Electromagneticas", prereq: ["EIE267"], credits: 4 },
        { code: "EIE326", name: "Teoría de Circuitos 2", prereq: ["EIE274", "EIE280"], credits: 4 },
        { code: "ICM347", name: "Termofluidos", prereq: ["EIE253"], credits: 4 },
        { code: "ING9001", name: "Inglés 1", prereq: [], credits: 2 }
    ],
    6: [
        { code: "EIE313", name: "Metodos de Optimizacion", prereq: ["EIE200"], credits: 4 },
        { code: "EIE346", name: "Conversion Electromecanica de la Energia", prereq: ["EIE318", "EIE326"], credits: 4 },
        { code: "EIE374", name: "Circuitos Electrónicos", prereq: ["EIE280"], credits: 4 },
        { code: "EIE400", name: "Ingeniería Económica y Formulación de Proyectos", prereq: ["EIE275", "EIE274", "EIE267", "EIE280", "EIE211"], credits: 4 },
        { code: "ING9002", name: "Inglés 2", prereq: ["ING9001"], credits: 2 },
        { code: "FOFU2", name: "Formacion Fundamental 2", prereq: [], credits: 2 }
    ],
    7: [
        { code: "EIE430", name: "Electrónica de Potencia", prereq: ["EIE374"], credits: 4 },
        { code: "EIE432", name: "Maquinas Electricas", prereq: ["EIE346"], credits: 4 },
        { code: "EIE433", name: "Sistemas de Comunicaciones", prereq: ["EIE315"], credits: 4 },
        { code: "EIE450", name: "Sistemas Electricos de Potencia", prereq: ["EIE346"], credits: 4 },
        { code: "EIE453", name: "Innovación y Emprendimiento", prereq: ["EIE275", "EIE274", "EIE267", "EIE280", "EIE211"], credits: 2 },
        { code: "ING9003", name: "Inglés 3", prereq: ["ING9002"], credits: 2 }
    ],
    8: [
        { code: "EIE502", name: "Accionamiento de Maquinas", prereq: ["EIE430"], credits: 4 },
        { code: "EIE504", name: "Protecciones de Sistemas Electricos", prereq: ["EIE450"], credits: 4 },
        { code: "EIE509", name: "Laboratorio Electrico", prereq: ["EIE432"], credits: 2 },
        { code: "EII509", name: "Gestión y Administración", prereq: ["EIE400", "EIE346", "EIE374", "EIE313", "ING9002"], credits: 4 },
        { code: "ING9004", name: "Inglés 4", prereq: ["ING9003"], credits: 2 },
        { code: "FOFU3", name: "Formacion Fundamental 3", prereq: [], credits: 2 }
    ],
    9: [
        { code: "DER1170", name: "Legislación, Normativa Social, Laboral y Ambiental", prereq: ["EIE400", "EIE346", "EIE374", "EIE313", "ING9002"], credits: 4 },
        { code: "EIE518", name: "Distribucion Electrica", prereq: ["EIE450"], credits: 4 },
        { code: "EIE524", name: "Mercado Electrico", prereq: ["EIE450"], credits: 4 },
        { code: "OPT1", name: "Optativo 1", prereq: [], credits: 4 },
        { code: "OPT2", name: "Optativo 2", prereq: [], credits: 4 }
    ],
    10: [
        { code: "EIE529", name: "Produccion y Almacenamiento de Energia", prereq: ["EIE509"], credits: 4 },
        { code: "EIE630", name: "Seminario de Proyectos", prereq: ["EIE504", "EIE509", "EIE502", "EII509", "ING9004"], credits: 8 },
        { code: "OPT3", name: "Optativo 3", prereq: [], credits: 4 },
        { code: "OPT4", name: "Optativo 4", prereq: [], credits: 4 }
    ],
    11: [
        { code: "EIE636", name: "Proyecto de Titulación", prereq: ["EIE630"], credits: 16 }
    ]
};
