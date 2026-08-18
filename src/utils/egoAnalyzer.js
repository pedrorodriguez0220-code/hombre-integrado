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
    { regex: /\bsistemas?\b|\btecnolog[íi]a\b|\btiempos modernos\b/i, weight: 2 },
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
    { regex: /\bcomplejo\b|\bpatr[óo]n\b|\bdin[áa]mica\b/i, weight: 1 },
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
    { regex: /\bsolo\b.*\b(?:entiendo|aguanto|cargar|sostener)\b/i, weight: 2 },
  ],
};

function scoreTone(patternList, text) {
  return patternList.reduce(
    (sum, { regex, weight }) => sum + (regex.test(text) ? weight : 0),
    0,
  );
}

const doctrinePremises = [
  "La primera ley del Hombre Integrado dice: antes de aumentar el poder de un ser hay que observar cómo usa ese amplificador y su memoria.",
  "La civilización hipertecnológica entrenó máquinas para el trabajo y la velocidad, pero atrofió la presencia del ser humano.",
  "El espejo no miente: solo devuelve lo que se le entrega sin maquillaje.",
  "No hay destino final, solo una dirección elegida una y otra vez con atención.",
  "El cuerpo y la mente son un solo territorio; dividirlos es el primer ruido.",
  "El ego sobrevive construyendo coartadas, intelectualizaciones y sacrificios invisibles.",
  "La integración no es un título; es un estado de atención perpetua.",
  "La sombra no se combate, se ilumina; no se niega, se nombra.",
  "El silencio real no está en el lugar, sino en la calma que podés sostener dentro del caos.",
  "El verdadero poder no domina a otros; domina la propia reacción.",
  "La felicidad no es una meta; es el subproducto de una dirección coherente.",
  "Cada distracción es un fragmento de soberanía entregado a alguien que no va a devolverlo.",
];

const toneMechanisms = {
  justification: [
    "El ego externaliza la causa para no cargar con el peso.",
    "Buscás una coartada en el entorno antes de asumir tu centro.",
    "El relato culpa al sistema mientras tu poder se escapa por la puerta de atrás.",
    "Cada 'porque' es un cable que delega tu responsabilidad a factores ajenos.",
    "Decir que no depende de vos es elegir la impotencia como refugio.",
    "La circunstancia solo revela dónde aún no te has hecho cargo.",
    "El entorno no se mueve hasta que vos dejás de esperar su permiso.",
    "Justificar es construir una celda con las palabras 'no pude'.",
    "La culpa compartida con el sistema es responsabilidad negada.",
    "El relato que construís externaliza el conflicto para protegerte.",
    "Antes de aumentar tu poder, estás usando el amplificador para excusarte.",
    "El ruido digital se convierte en coartada cuando no querés escuchar el silencio.",
  ],
  intellectualization: [
    "La mente confunde el mapa con el territorio.",
    "Los conceptos abstractos armaron una muralla alrededor de la herida.",
    "Explicar se volvió estrategia para no sentir.",
    "La teoría se erige como túnel por donde huir del cuerpo.",
    "Cada concepto que agregás es otra capa que separa la mirada del hecho.",
    "Filosofar sobre el dolor es una forma elegente de no tocarlo.",
    "El intelecto ordena para no dejarse desordenar por lo real.",
    "Nombrar el trauma con palabras ricas no lo disuelve; lo distrae.",
    "El análisis infinito es el ruido que la herida pone para no ser sentida.",
    "Construís un lenguaje privado para habitar la herida sin curarla.",
    "La mente teórica analiza para no sentir y para no actuar.",
    "El mapa cada vez más detallado nunca reemplaza al territorio.",
  ],
  martyr: [
    "El ego se cobra con sufrimiento exhibido.",
    "El sacrificio exige un aplauso invisible.",
    "La víctima se viste de héroe para sobrevivir.",
    "Cargar con todo es una forma secreta de exigir reconocimiento.",
    "El mártir paga con sufrimiento para cobrar atención.",
    "El peso que elegís llevar solo para que vean es un yugo invisible.",
    "El dolor presentado como moneda es comercio, no consciencia.",
    "Te colocás en el centro del drama para exigir aplausos que nadie prometió.",
    "El sufrimiento exhibido como moneda de cambio es vanidad sutil.",
    "Decir 'nadie nota' es confirmar que el sufrimiento busca testigo.",
    "El sacrificio gratuito no existe; siempre hay un precio emocional.",
    "Aguantar para que admiren tu resistencia es seguir dependiendo del otro.",
  ],
  superficial: [
    "La brevedad es otra forma de huir del espejo.",
    "Una respuesta tan corta revela prisa por cerrar el portal.",
    "El silencio es sabio, pero el tuyo ahora es evasión.",
    "Esa frase apretada es una puerta que querés dejar cerrada.",
    "Huir del lenguaje no te libera; solo pospone el encuentro.",
    "La respuesta corta es una máscara que oculta el hecho.",
    "El espejo no acepta monedas de cobre por oro.",
    "Dos palabras no nombran un mundo.",
    "Cada palabra que omitís es una sombra que se queda sin luz.",
    "La prisa por cerrar es miedo a lo que aparece si te quedás.",
    "El lenguaje mínimo es defensa cuando la verdad pesa demasiado.",
    "No hay prisa: el espejo puede esperar, pero tu evasión no se esconde.",
  ],
  neutral: [
    "El espejo devuelve lo que le entregás, sin corregir ni absolver.",
    "La observación honesta vale más que la respuesta brillante.",
    "La mente busca conclusiones rápidas para calmar la incomodidad.",
    "Ninguna IA puede resolver lo que solo el observador interno debe presenciar.",
    "Has puesto tu verdad sobre la mesa; ahora solo hace falta mirarla.",
    "La integración es un estado de atención, no un título que conquistar.",
    "El conocimiento sin observación es solo acumulación de ruido.",
    "Permanece con lo que escribiste diez segundos sin moverte.",
    "La verdad que entregaste no necesita ser arreglada; necesita ser presenciada.",
    "El espejo no juzga; solo refleja.",
    "Lo que escribiste es un punto de partida, no una sentencia.",
    "La pregunta que evitás contiene la respuesta que el espejo guarda.",
  ],
};

const toneDirectives = {
  justification: [
    "Asumí el centro de tu propia gravedad en {ctx}.",
    "Dejá de delegar el poder a factores ajenos.",
    "Reclamá la responsabilidad que le regalaste al entorno.",
    "Nombrá lo que evitás asumir.",
    "Cortá el cable que conecta tu excusa con el mundo.",
    "Volvé a tu cuerpo y sentí el peso de tu propia elección.",
    "Pará de buscar permiso o culpables para actuar.",
    "Hacete cargo del amplificador antes de exigir más potencia.",
    "Convertí la queja en una pregunta de responsabilidad.",
    "Mirá cómo usás tu memoria: ¿está sirviendo a tu dirección o a tu defensa?",
  ],
  intellectualization: [
    "Bajá del mapa al territorio de {ctx}.",
    "Dejá los conceptos y tocá el hecho físico y descarnado.",
    "Descendé de la teoría a la sensación.",
    "Permití que la herida exista sin explicación.",
    "Traducí el pensamiento a una acción concreta en {ctx}.",
    "Sentí la pregunta en el cuerpo antes de responderla.",
    "Interrumpí el análisis con un acto de presencia.",
    "Hablá con la simplicidad de un hecho desnudo.",
    "Dejá las citas y volvé al territorio de tu propia experiencia.",
    "La teoría no reemplaza la observación; la observa desde arriba.",
  ],
  martyr: [
    "Hacé esto sin que nadie jamás lo note.",
    "Dejá de cobrar con sufrimiento.",
    "Soltá la cruz que elegiste como moneda de cambio.",
    "Mirá qué necesidad de validación camufla tu sacrificio.",
    "Actuá desde la plenitud, no desde la deuda.",
    "Pagá el precio emocional sin esperar recibo.",
    "Hacé lo que corresponde sin anunciarlo.",
    "Reclamá tu soberanía en lugar de tu dolor.",
    "Decidí si el sacrificio es amor o contrato invisible.",
    "El hombre integrado da sin exigir que el mundo lo vea.",
  ],
  superficial: [
    "Nombrá los hechos con precisión quirúrgica.",
    "Extendé la mano hacia lo incómodo.",
    "Escribí lo que tu mente calla por vergüenza.",
    "Detenete y sostené la mirada un minuto más.",
    "Abrí la puerta que querés dejar cerrada.",
    "Soltá la prisa y dejá que la verdad pese.",
    "Volvé a la pregunta y respondela con el cuerpo, no con una etiqueta.",
    "Escribí una línea que no estés dispuesto a mostrar.",
    "Descendé del resumen al hecho concreto.",
    "No cierres el portal hasta que haya algo real en la mesa.",
  ],
  neutral: [
    "Sostén esta verdad en silencio.",
    "Observá tu respuesta sin absolverte ni condenarte.",
    "Permanece con lo que escribiste durante diez segundos sin moverte.",
    "Mirá lo que surge sin intentar corregirlo.",
    "Volvé a la pregunta y dejala resonar en el cuerpo.",
    "Aceptá este fragmento de tu sombra sin juzgarlo ni justificarlo.",
    "Dejá que el reflejo hable antes de responder por él.",
    "Rompe el ciclo de conclusiones rápidas.",
    "Presenciá lo que escribiste como si fuera de otro.",
    "La atención es el único recurso que no podés recuperar: usala aquí.",
  ],
};

const toneQuestions = {
  justification: [
    "¿Qué decisión estás delegando?",
    "¿Qué parte de esta situación depende exclusivamente de vos?",
    "¿A qué le temés más que a asumir el centro?",
    "¿Qué excusa te mantiene esperando permiso?",
    "¿Qué responsabilidad estás intentando delegar?",
    "¿Qué pasaría si asumieras que el origen está íntegramente en vos?",
    "¿Quién o qué pierde poder si dejás de culpar?",
    "¿Qué elegís hacer hoy con la parte que sí depende de vos?",
    "¿Dónde dejaste el mando de tu atención?",
    "¿Qué mentira contás para no actuar?",
  ],
  intellectualization: [
    "¿Qué sensación física aparece si dejás de explicar?",
    "¿Podés dejar de analizar y simplemente sentirlo?",
    "¿Qué nombre desnudo le pondrías al hecho?",
    "¿Dónde está tu cuerpo mientras teorizás?",
    "¿Qué ocurre si bajás del mapa al territorio?",
    "¿Qué pasaría si no tuvieras palabras para describir esto?",
    "¿Qué parte de tu teoría es pura defensa?",
    "¿Sentís la pregunta o solo la pensás?",
    "¿Qué acción concreta surge si abandonás el concepto?",
    "¿Qué harías si nadie valorara tu análisis?",
  ],
  martyr: [
    "¿Qué necesidad de validación camufla este sacrificio?",
    "¿Qué harías si nadie jamás supiera de tu entrega?",
    "¿Cuándo empezó este peso a cobrarse con atención?",
    "¿Qué precio emocional estás exigiendo?",
    "¿Podés dar sin esperar que lo noten?",
    "¿Qué parte de tu dolor es moneda de cambio?",
    "¿Quién debería pagar lo que vos estás pagando?",
    "¿Qué pasaría si soltás la cruz?",
    "¿Tu sacrificio es amor o contrato invisible?",
    "¿De quién depende tu valía hoy?",
  ],
  superficial: [
    "¿Qué es lo que verdaderamente temés mirar?",
    "¿Qué hay debajo de esa línea apresurada?",
    "¿Qué escribiría una versión tuya sin miedo?",
    "¿Qué hecho evitás nombrar?",
    "¿Por qué cerrás el portal con tan pocas palabras?",
    "¿Qué ocurre si escribís cinco líneas más?",
    "¿Qué vergüenza oculta tu brevedad?",
    "¿Qué tendría que ser real para que te quedaras?",
    "¿Qué hay al otro lado de la puerta?",
    "¿Qué parte del espejo te asusta?",
  ],
  neutral: [
    "¿Qué te devuelve el reflejo?",
    "¿Podés aceptar este fragmento sin juzgarlo?",
    "¿Qué ocurre si permanecés diez segundos con esto?",
    "¿Qué dirección emerge de esta observación?",
    "¿Qué hacés ahora con lo que viste?",
    "¿Qué parte de vos apareció que no esperabas?",
    "¿Qué pregunta subyace debajo de tu respuesta?",
    "¿Cómo se siente esta verdad en el cuerpo?",
    "¿Qué decisión coherente nace de aquí?",
    "¿Dónde aplicarás lo que observaste hoy?",
  ],
};

const dimensionAnchors = {
  "EL RUIDO": [
    "el ruido digital no es un ambiente, es una decisión repetida",
    "cada alerta que atendés sin intención roba un fragmento de tu soberanía",
    "la tecnología es un amplificador; mirá qué amplifica en vos",
    "el cuerpo pide silencio mientras la pantalla exige respuesta",
    "la atención es el único recurso que no recuperás",
  ],
  "AUTOCONSCIENCIA": [
    "la autoconsciencia no es autocrítica, es observar al observador",
    "la máscara que defendiste hoy es una puerta",
    "detrás de cada personaje hay un miedo",
    "conocerse es dejar de creer las etiquetas",
    "el espejo no miente, solo refleja",
  ],
  "EL CUERPO Y EL ARRAIGO": [
    "el cuerpo grita lo que la mente niega",
    "el arraigo no es un lugar, es sentir el peso del propio cuerpo",
    "la respiración es el primer territorio de la presencia",
    "cada movimiento consciente es una rebelión contra la distracción",
    "la materia es sabia y no se deja engañar por palabras",
  ],
  "LA SOMBRA": [
    "la sombra no se combate, se ilumina",
    "lo que negás en vos lo proyectás sobre el otro",
    "cada secreto no confesado pesa el doble",
    "el demonio interno es guardián de lo reprimido",
    "integrar la sombra es devolverle su nombre sin dejar que gobierne",
  ],
  "LAS RELACIONES": [
    "el otro es espejo de lo que no integraste",
    "el vínculo roto comienza en una proyección no observada",
    "la soledad que temés es falta de presencia con vos",
    "el orgullo es el impuesto que pagamos para no pedir perdón",
    "relacionarse con integridad implica dejar de negociar afecto",
  ],
  "EL PODER PERSONAL": [
    "el poder no se pide, se ejerce asumiendo consecuencias",
    "la indecisión es una decisión disfrazada de espera",
    "delegar responsabilidad es delegar poder",
    "el miedo a fallar es miedo a responsabilizarse",
    "el poder se mide en la calma de decisiones impopulares",
  ],
  "EL DINERO Y EL VALOR": [
    "el dinero mide circulación, no valía",
    "gastar para impresionar es endeudar el alma",
    "el valor real no se negocia en mercados",
    "cobrar lo que valés no es avaricia, es honestidad",
    "el dinero es energía; si tu relación con él tiene miedo, el miedo se multiplica",
  ],
  "EL SILENCIO": [
    "el silencio asusta porque desenmascara el ruido",
    "hacer no es sinónimo de ser",
    "el verdadero refugio es la calma dentro del caos",
    "la mente ofrece urgencias para evitar el vacío",
    "el silencio disuelve el ruido, no lo combate",
  ],
  "LA DISCIPLINA": [
    "la disciplina real fluye, no se quiebra",
    "castigarte no te hace más fuerte, te hace más frágil",
    "la constancia sin presencia es automatismo",
    "la rigidez es otra forma de miedo",
    "la disciplina es presencia repetida, no violencia contra uno mismo",
  ],
  "EL LIDERAZGO": [
    "liderar es servir a una dirección, no controlar personas",
    "el líder que necesita ser amado genera dependencia",
    "la mejor enseñanza es la coherencia entre lo privado y lo público",
    "el silencio de un líder vale más que sus discursos",
    "el hombre integrado no lidera para ser grande",
  ],
  "LAS EXPECTATIVAS": [
    "cada expectativa no expresada es un contrato invisible",
    "morir a las expectativas no es rendirse, es liberar la vida",
    "el sufrimiento empieza donde la expectativa choca con la realidad",
    "la expectativa es una forma sutil de controlar el futuro",
    "el mundo no firmó tu contrato emocional",
  ],
  "LA INTEGRACION FINAL": [
    "la integración no es una meta, es una dirección",
    "no hay diploma de hombre integrado",
    "cada vez que creas que llegaste, el espejo se empaña",
    "el trabajo verdadero empieza al cerrar esta pantalla",
    "la integración es caerse, levantarse y seguir mirando",
  ],
};

const responseTemplates = {
  justification: [
    "{premise} {mechanism} {directive} {question}",
    "{mechanism} {premise} {directive} {question}",
    "{directive} {mechanism} En {ctx}, {question}",
    "{premise} {directive} {mechanism} {question}",
    "{mechanism} {question} {directive} {premise}",
    "En {ctx}, {mechanism} {directive} {question}",
  ],
  intellectualization: [
    "{premise} {mechanism} {directive} {question}",
    "{mechanism} {premise} {directive} {question}",
    "{directive} {mechanism} {question} {premise}",
    "{premise} {directive} {mechanism} {question}",
    "En {ctx}, {mechanism} {directive} {question}",
    "{mechanism} {directive} Dejá el mapa: {question}",
  ],
  martyr: [
    "{premise} {mechanism} {directive} {question}",
    "{mechanism} {premise} {directive} {question}",
    "{directive} {mechanism} {question} {premise}",
    "{premise} {directive} {mechanism} {question}",
    "En {ctx}, {mechanism} {directive} {question}",
    "{mechanism} {question} Hacé el siguiente paso en silencio.",
  ],
  superficial: [
    "{mechanism} {directive} {question}",
    "{directive} {mechanism} {question}",
    "{mechanism} En {ctx}, {directive} {question}",
    "{premise} {mechanism} {directive} {question}",
    "{directive} {question} {mechanism}",
    "{question} {mechanism} {directive}",
  ],
  neutral: [
    "{premise} En {ctx}, {anchor}. {directive} {question}",
    "En {ctx}, {anchor}. {directive} {question}",
    "{anchor}. {premise} {directive} {question}",
    "{directive} En {ctx}, {anchor}. {question}",
    "{question} {anchor}. {directive} {premise}",
    "{premise} {directive} En {ctx}, {anchor}. {question}",
  ],
};

let previousResponse = "";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function startLower(str) {
  return str.replace(/^(¿|¡)?([A-ZÁÉÍÓÚÑ])/, (_, punct, letter) =>
    (punct || "") + letter.toLowerCase(),
  );
}

function normalizeCasing(str) {
  // Ensure the first sentence and every sentence after . ? ! start with uppercase.
  return str.replace(/(^|[.?!]\s+)(¿|¡)?([a-záéíóúñ])/g, (_, boundary, punct, letter) =>
    boundary + (punct || "") + letter.toUpperCase(),
  );
}

function buildToneLabel(tone) {
  switch (tone) {
    case "justification":
      return "JUSTIFICATION";
    case "intellectualization":
      return "INTELLECTUALIZATION";
    case "martyr":
      return "MARTYR";
    case "superficial":
      return "SUPERFICIAL";
    default:
      return "NEUTRAL";
  }
}

function resolveTone(dimensionKey, text, wordCount) {
  if (wordCount < 4) {
    return { tone: "superficial", ctx: dimensionContext[dimensionKey] || "esta dimensión" };
  }

  const scores = {
    justification: scoreTone(tonePatterns.justification, text),
    intellectualization: scoreTone(tonePatterns.intellectualization, text),
    martyr: scoreTone(tonePatterns.martyr, text),
  };

  let tone = "neutral";
  let maxScore = 0;
  for (const key of ["justification", "intellectualization", "martyr"]) {
    const score = scores[key];
    if (score > maxScore) {
      maxScore = score;
      tone = key;
    }
  }

  if (maxScore < 4) {
    tone = "neutral";
  }

  return { tone, ctx: dimensionContext[dimensionKey] || "esta dimensión" };
}

function generateResponse(dimensionKey, ctx, tone) {
  const premise = pick(doctrinePremises);
  const mechanism = startLower(pick(toneMechanisms[tone]));
  const directive = startLower(pick(toneDirectives[tone]).replace("{ctx}", ctx));
  const question = startLower(pick(toneQuestions[tone]));
  const anchorList = dimensionAnchors[dimensionKey] || dimensionAnchors["LA INTEGRACION FINAL"];
  const anchor = startLower(pick(anchorList));

  const template = pick(responseTemplates[tone]);
  let response = template
    .replace(/\{premise\}/g, premise)
    .replace(/\{mechanism\}/g, mechanism)
    .replace(/\{directive\}/g, directive)
    .replace(/\{question\}/g, question)
    .replace(/\{ctx\}/g, ctx)
    .replace(/\{anchor\}/g, anchor);

  // Collapse multiple spaces and fix Spanish sentence casing.
  response = response.replace(/\s+/g, " ").trim();
  response = normalizeCasing(response);

  // Avoid the exact same full response twice in a row.
  if (response === previousResponse && response.length > 0) {
    return generateResponse(dimensionKey, ctx, tone);
  }
  previousResponse = response;
  return response;
}

export function analyzeUserResponse(dimension, questionText, inputText) {
  const dimensionKey = normalizeKey(dimension);
  const text = removeAccents(inputText.toLowerCase().trim());

  if (!text) {
    return {
      type: "SILENCIO",
      response: "El espejo solo puede devolver lo que se entrega.",
    };
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const { tone, ctx } = resolveTone(dimensionKey, text, wordCount);

  const response = generateResponse(dimensionKey, ctx, tone);
  const typeLabel =
    tone === "neutral"
      ? dimensionKey
      : `${dimensionKey} — ${buildToneLabel(tone)}`;

  return { type: typeLabel, response };
}
