const lastResponseIndex = new Map();

function pickResponse(arr, type) {
  if (arr.length <= 1) return arr[0];
  const lastIndex = lastResponseIndex.get(type);
  let index;
  do {
    index = Math.floor(Math.random() * arr.length);
  } while (arr.length > 1 && index === lastIndex);
  lastResponseIndex.set(type, index);
  return arr[index];
}

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeKey(str) {
  return removeAccents(str)
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const dimensionContext = {
  "EL RUIDO": "el ruido",
  "AUTOCONSCIENCIA": "la autoconsciencia",
  "EL CUERPO Y EL ARRAIGO": "el cuerpo y el arraigo",
  "LA SOMBRA": "la sombra",
  "LAS RELACIONES": "las relaciones",
  "EL PODER PERSONAL": "el poder personal",
  "EL DINERO Y EL VALOR": "el dinero y el valor",
  "EL SILENCIO": "el silencio",
  "LA DISCIPLINA": "la disciplina",
  "EL LIDERAZGO": "el liderazgo",
  "LAS EXPECTATIVAS": "las expectativas",
  "LA INTEGRACION FINAL": "la integración final",
};

const tonePrefixes = {
  justification: (ctx) => `En ${ctx}, el ego externaliza la causa para no cargar con el peso.`,
  intellectualization: (ctx) => `En ${ctx}, la mente confunde el mapa con el territorio.`,
  martyr: (ctx) => `En ${ctx}, el ego se cobra con sufrimiento exhibido.`,
};

const dimensionalFeedback = {
  "EL RUIDO": [
    "La atención es el único recurso que no podés recuperar. ¿A qué ruido entregaste hoy tu soberanía?",
    "El silencio no es ausencia de sonido: es la presencia de tu propia voz. ¿La escuchás entre tanto estímulo?",
    "Cada notificación que atendés sin intención es un fragmento de tu consciencia entregado a otros. ¿Qué dejarás de alimentar?",
  ],
  "AUTOCONSCIENCIA": [
    "El espejo no muestra lo que sos; muestra lo que estás dispuesto a ver. ¿Qué parte del reflejo ignorás?",
    "La autoconsciencia no es autocrítica: es observar sin juzgar al observador. ¿Podés mirar sin absolverte ni condenarte?",
    "Detrás de cada máscara hay un miedo. ¿Qué miedo sostiene la que usaste hoy?",
  ],
  "EL CUERPO Y EL ARRAIGO": [
    "El cuerpo no miente; acumula lo que la mente se niega a confesar. Volvé al hueso, al músculo, a la respiración.",
    "Habitas la mente y abandonás la materia. El hombre integrado arraiga su consciencia en sus actos físicos cotidianos.",
    "La tensión que ignorás hoy se convertirá en la enfermedad de mañana. Escuchá el mensaje biológico de tu resistencia.",
  ],
  "LA SOMBRA": [
    "La sombra no se combate: se ilumina con honestidad. ¿Qué parte oscura estás dispuesto a nombrar?",
    "Lo que negás en vos, lo proyectás sobre el otro. ¿Qué cualidad criticaste hoy que habita en tu interior?",
    "El demonio interno no es enemigo: es guardián de lo reprimido. ¿Qué mensaje trae?",
  ],
  "LAS RELACIONES": [
    "El otro es siempre un espejo de aquello que no has integrado en vos. ¿Qué parte de tu propia sombra estás culpando en el vínculo?",
    "La vulnerabilidad exige la muerte del orgullo. ¿Qué preferís tener: la razón o la paz de la integración?",
    "Proyectás tus carencias esperando que el otro las resuelva. Nadie puede sostener el peso de tu vacío.",
  ],
  "EL PODER PERSONAL": [
    "El poder no se pide ni se negocia; se ejerce asumiendo las consecuencias. ¿Qué excusa te mantiene esperando permiso?",
    "La indecisión es una decisión disfrazada de espera. ¿A qué fracaso le temés más que al propio estancamiento?",
    "El poder personal colapsa cuando buscás que el entorno valide tu siguiente paso. Actuá sin red.",
  ],
  "EL DINERO Y EL VALOR": [
    "El dinero mide circulación, no valía. ¿Estás confundiendo precio con valor propio?",
    "La escasez que temés es, a menudo, la escasez de reconocimiento hacia tu propio trabajo. ¿Qué valor no te atrevés a cobrar?",
    "El verdadero capital es la integridad de tu palabra y la claridad de tu dirección. ¿En qué has invertido hoy?",
  ],
  "EL SILENCIO": [
    "El silencio asusta porque desenmascara el ruido con el que te anestesiás. Sostení el vacío sin intentar llenarlo.",
    "Hacer no es sinónimo de ser. ¿Podés permanecer diez minutos contemplando tu mente sin intervenir en ella?",
    "El verdadero refugio no está en los lugares silenciosos, sino en tu capacidad de mantener la calma en medio del caos.",
  ],
  "LA DISCIPLINA": [
    "La disciplina basada en el castigo o en el odio a uno mismo siempre fenece. ¿Podés elegir tu dirección desde el amor y el respeto al proceso?",
    "No necesitás más fuerza de voluntad; necesitás dejar de negociar con tus propias excusas cotidianas.",
    "La constancia sin presencia es solo automatismo mecánico. ¿Estás presente en el hábito que sostenés?",
  ],
  "EL LIDERAZGO": [
    "Un verdadero líder no busca aplausos ni seguidores, sino coherencia en la sombra. ¿Qué harías si nadie jamás supiera de tu acierto?",
    "El liderazgo externo es un eco del desorden interno. Ordená tu caos antes de intentar guiar a otros.",
    "La popularidad es la tumba de la integridad. ¿Estás dispuesto a ser incomprendido por mantenerte fiel a tu centro?",
  ],
  "LAS EXPECTATIVAS": [
    "Cada expectativa no expresada es un contrato invisible que el otro nunca firmó. ¿Qué trato pretendés sin haberlo nombrado?",
    "Morir a las expectativas no es rendirse: es liberar la vida de tus condiciones. ¿A qué resultado aferrás que te roba el presente?",
    "El sufrimiento empieza donde las expectativas chocan con la realidad. ¿Qué realidad estás negando?",
  ],
  "LA INTEGRACION FINAL": [
    "El ego busca una línea de llegada definitiva para descansar. La integración es un estado de atención perpetua, no un título.",
    "Aceptar que sos un trabajo en progreso implica dejar de buscar la perfección ilusoria. Asumí tu humanidad descarnada.",
    "La obra no termina con una respuesta brillante. El verdadero trabajo comienza al cerrar esta pantalla y volver al mundo.",
  ],
};

const defaultPool = [
  "El conocimiento sin observación es solo acumulación de ruido. Sostén esta verdad en silencio: ¿podés aceptar este fragmento de tu sombra sin juzgarlo ni justificarlo?",
  "Has puesto tu verdad sobre la mesa. Mirala sin intentar corregirla, sin juzgarla, sin absolverla. ¿Qué te devuelve el reflejo?",
  "La mente busca conclusiones rápidas para calmar la incomodidad. Rompé el ciclo: observá tu respuesta sin absolverte ni condenarte.",
];

const superficialPool = [
  "La brevedad es otra forma de huir del espejo. Nombrá los hechos con precisión quirúrgica. ¿Qué es lo que verdaderamente temés mirar?",
  "Una respuesta tan corta revela prisa por cerrar el portal. Detente. ¿Qué hay debajo de esa línea apresurada?",
  "El silencio es sabio, pero el tuyo ahora es evasión. Escribí lo que tu mente calla por vergüenza.",
];

const tonePatterns = {
  justification: [
    { regex: /\bculpa\b/i, weight: 3 },
    { regex: /\bporque\b/i, weight: 1 },
    { regex: /\b(?:otros|ellas?|ellos|gentes?|demas|demás)\b/i, weight: 2 },
    { regex: /\bsistema\b/i, weight: 3 },
    { regex: /\bfueron\b|\bes de\b|\bse debe a\b/i, weight: 1 },
    { regex: /\bcircunstancias?\b/i, weight: 2 },
    { regex: /nadie me entiende|nadie me comprende|nadie me escucha/i, weight: 3 },
    { regex: /por (?:su|la|tu|mi) culpa|culpa (?:suya|tuya|de)/i, weight: 3 },
    { regex: /fuera de mi control|no depend[íi]a? de m[ií]|no pude evitar|no tuve (?:opción|opcion|otra)|no ten[íi]a (?:opción|opcion)/i, weight: 3 },
    { regex: /(?:la vida|el destino|la suerte|el universo|dios) (?:me|lo|me lo|me la)/i, weight: 2 },
    { regex: /\bdestino\b|\bsuerte\b/i, weight: 2 },
    { regex: /\b(?:sociedad|mundo|gobierno|empresa|país|pais|trabajo|jefe|familia)\b/i, weight: 2 },
    { regex: /me (?:obligaron|forzaron|compelieron|exigieron)/i, weight: 3 },
    { regex: /ten[íi]a que|tuve que|me vi obligado|no me qued[oó] otra/i, weight: 2 },
    { regex: /\bno (?:pude|pod[íi]a|puedo|logro)\b/i, weight: 2 },
  ],
  intellectualization: [
    { regex: /\bteor[íi]a\b|\bteorizo\b/i, weight: 3 },
    { regex: /\banalizando\b|\ban[áa]lisis\b/i, weight: 3 },
    { regex: /\bsicol[óo]gicamente\b|\bpsicol[óo]gicamente\b/i, weight: 3 },
    { regex: /\bmental\b|\bmente\b.*\banaliza/i, weight: 2 },
    { regex: /\bconcepto\b|\bconceptualmente\b/i, weight: 2 },
    { regex: /\bfilos[óo]ficamente\b/i, weight: 3 },
    { regex: /\bintelectualmente\b|\bintelecto\b/i, weight: 2 },
    { regex: /\bentendiendo\b|\bcomprendiendo\b/i, weight: 1 },
    { regex: /\brazonando\b|\brazonamiento\b/i, weight: 2 },
    { regex: /\babstracto\b|\babstracci[óo]n\b/i, weight: 2 },
    { regex: /punto de vista|desde una [óo]ptica|en t[ée]rminos de/i, weight: 2 },
    { regex: /\bparadigma\b|\bframework\b|\bmodelo\b|\bte[óo]rico/i, weight: 2 },
    { regex: /\bseg[úu]n\b.*\b(?:estudio|libro|autor|teor[íi]a|filosof)/i, weight: 2 },
    { regex: /\bliteratura\b|\bestudios\b|\bcient[íi]ficamente\b/i, weight: 2 },
    { regex: /\bpsicol[óo]gico\b|\bterap[ée]uticamente\b/i, weight: 2 },
  ],
  martyr: [
    { regex: /\bsiempre\b/i, weight: 1 },
    { regex: /\bnunca\b/i, weight: 2 },
    { regex: /\btodos?\b.*\b(?:contra|conmigo|dependen)\b/i, weight: 2 },
    { regex: /\bm[áa]rtir\b/i, weight: 3 },
    { regex: /\bsacrificio\b|\bsacrificad[oa]\b|\bme sacrifico\b/i, weight: 3 },
    { regex: /nadie me valora|nadie valora|fui el [uú]nico|nadie nota|no me reconocen/i, weight: 3 },
    { regex: /cargar con todo|carg[oó] con todo|me toca a m[ií]|solo yo\b/i, weight: 3 },
    { regex: /\binvisibilizado\b|\binvisibilizada\b/i, weight: 2 },
    { regex: /\baguant[oa]r\b|\baguante\b/i, weight: 2 },
    { regex: /\bme doy por\b/i, weight: 1 },
    { regex: /es mi cruz|es mi carga|dependen de m[ií]|cuentan conmigo/i, weight: 3 },
    { regex: /\bhar[íi]a? (?:todo|lo imposible|lo que sea)\b/i, weight: 2 },
    { regex: /\bsin que nadie\b.*\b(?:pida|sepa|vea)\b/i, weight: 2 },
    { regex: /\bpara ellos\b|\bpor ellos\b/i, weight: 1 },
  ],
};

function scoreTone(patternList, text) {
  return patternList.reduce((sum, { regex, weight }) => sum + (regex.test(text) ? weight : 0), 0);
}

export function analyzeUserResponse(dimension, questionText, inputText) {
  const dimensionKey = normalizeKey(dimension);
  const text = removeAccents(inputText.toLowerCase().trim());

  if (!text) {
    return { type: "SILENCIO", response: "El espejo solo puede devolver lo que se entrega." };
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const ctx = dimensionContext[dimensionKey] || "esta dimensión";

  if (wordCount < 4) {
    return {
      type: `${dimensionKey} — SUPERFICIAL`,
      response: pickResponse(superficialPool, "SUPERFICIAL"),
    };
  }

  const scores = {
    justification: scoreTone(tonePatterns.justification, text),
    intellectualization: scoreTone(tonePatterns.intellectualization, text),
    martyr: scoreTone(tonePatterns.martyr, text),
  };

  let toneKey = "neutral";
  let maxScore = 0;
  for (const key of ["justification", "intellectualization", "martyr"]) {
    const score = scores[key];
    if (score > maxScore) {
      maxScore = score;
      toneKey = key;
    }
  }

  // Threshold: a strong tone needs at least 4 points to override the dimension context.
  if (maxScore < 4) {
    toneKey = "neutral";
  }

  const pool = dimensionalFeedback[dimensionKey] || defaultPool;
  const core = pickResponse(pool, dimensionKey);

  let response = core;
  if (toneKey !== "neutral" && tonePrefixes[toneKey]) {
    response = `${tonePrefixes[toneKey](ctx)} ${core}`;
  }

  const typeLabel = toneKey === "neutral" ? dimensionKey : `${dimensionKey} — ${toneKey.toUpperCase()}`;

  return { type: typeLabel, response };
}
