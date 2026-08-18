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

const tonePrefixTemplates = {
  justification: [
    "En {ctx}, el ego externaliza la causa para no cargar con el peso.",
    "En {ctx}, buscás una coartada antes de asumir la responsabilidad.",
    "En {ctx}, el relato culpa al entorno mientras el poder se escapa.",
    "En {ctx}, la excusa es la defensa favorita del que aún no acepta su centro.",
    "En {ctx}, cada 'porque' es un cable que delega tu poder a factores ajenos.",
    "En {ctx}, decir que no depende de vos es elegir la impotencia como refugio.",
    "En {ctx}, el entorno no se mueve hasta que vos dejás de esperar su permiso.",
    "En {ctx}, la culpa compartida con el sistema es responsabilidad negada.",
    "En {ctx}, justificar es construir una celda con las palabras 'no pude'.",
    "En {ctx}, la circunstancia solo revela dónde aún no te has hecho cargo.",
  ],
  intellectualization: [
    "En {ctx}, la mente confunde el mapa con el territorio.",
    "En {ctx}, los conceptos abstractos armaron una muralla alrededor de la herida.",
    "En {ctx}, explicar se volvió estrategia para no sentir.",
    "En {ctx}, la teoría se erige como túnel por donde huir del territorio del cuerpo.",
    "En {ctx}, nombrar el trauma con palabras ricas no lo disuelve; lo distrae.",
    "En {ctx}, el intelecto ordena para no dejarse desordenar por lo real.",
    "En {ctx}, cada concepto que agregás es otra capa que separa la mirada del hecho.",
    "En {ctx}, filosofar sobre el dolor es una forma elegante de no tocarlo.",
    "En {ctx}, el análisis infinito es el ruido que la herida pone para no ser sentida.",
    "En {ctx}, dejá el mapa. El territorio te espera sin títulos ni citas.",
  ],
  martyr: [
    "En {ctx}, el ego se cobra con sufrimiento exhibido.",
    "En {ctx}, el sacrificio exige un aplauso invisible.",
    "En {ctx}, la víctima se viste de héroe para sobrevivir.",
    "En {ctx}, el dolor presentado como moneda es negocio, no consciencia.",
    "En {ctx}, cargar con todo es una forma secreta de exigir reconocimiento.",
    "En {ctx}, el mártir paga con sufrimiento para cobrar atención.",
    "En {ctx}, decir 'nadie nota' es confirmar que el sufrimiento busca testigo.",
    "En {ctx}, el sacrificio gratuito no existe; siempre hay un precio emocional.",
    "En {ctx}, el peso que elegís llevar solo para que vean es un yugo invisible.",
    "En {ctx}, la víctima se coloca en el centro esperando que el mundo le devuelva su dolor.",
  ],
};

function buildTonePrefix(tone, ctx) {
  const pool = tonePrefixTemplates[tone];
  if (!pool || pool.length === 0) return "";
  const template = pickResponse(pool, `prefix_${tone}`);
  return template.replace("{ctx}", ctx);
}

const dimensionalFeedback = {
  "EL RUIDO": [
    "La atención es el único recurso que no podés recuperar. ¿A qué ruido entregaste hoy tu soberanía?",
    "El silencio no es ausencia de sonido: es la presencia de tu propia voz. ¿La escuchás entre tanto estímulo?",
    "Cada notificación que atendés sin intención es un fragmento de tu consciencia entregado a otros. ¿Qué dejarás de alimentar?",
    "El ruido moderno no grita; susurra con urgencias ajenas hasta que olvidás tu propia dirección. ¿Quién programa tu mañana?",
    "No hay escasez de tiempo: hay fuga de atención. Nombrá los tres ruidos que robaron tu presencia esta semana.",
    "Detrás de cada pantalla que abrís sin propósito hay una incomodidad que no querés sentir. Mirala sin mover el dedo.",
    "El hombre integrado no huye del mundo digital; gobierna su atención en él. ¿Quién posee el mando ahora?",
    "Un minuto mirando sin hacer nada vale más que una hora reaccionando. Probá respirar antes de tocar la siguiente alerta.",
    "La civilización entrena máquinas para captar tu mirada. Tu tarea es entrenar la mirada para volver a vos.",
    "El ruido nunca cesa; cesa tu respuesta automática. ¿Podés elegir el silencio antes de cada clic?",
  ],
  "AUTOCONSCIENCIA": [
    "El espejo no muestra lo que sos; muestra lo que estás dispuesto a ver. ¿Qué parte del reflejo ignorás?",
    "La autoconsciencia no es autocrítica: es observar sin juzgar al observador. ¿Podés mirar sin absolverte ni condenarte?",
    "Detrás de cada máscara hay un miedo. ¿Qué miedo sostiene la que usaste hoy?",
    "Conocerse no es acumular etiquetas; es dejar de creerlas. ¿Qué autodefinición defendiste recién?",
    "La pregunta más peligrosa no es '¿quién soy?' sino '¿quién gobierna cuando no miro?'. Mirá hacia adentro.",
    "La mente fabrica continuamente un personaje para sobrevivir. ¿Qué gesto, palabra o silencio de hoy fue pura actuación?",
    "No hay verdad final de vos: hay una atención que puede presenciar el cambio. ¿Dónde te aferrás a ser alguien?",
    "El primer paso de la integración es admitir que no te conocés. ¿Qué parte de tu historia preferís no revisar?",
    "La autoconsciencia duele porque desarma lo que construiste para ser aceptado. Permanece con esa incomodidad.",
    "No busques una respuesta brillante. Buscá una observación honesta de lo que está ocurriendo ahora.",
  ],
  "EL CUERPO Y EL ARRAIGO": [
    "El cuerpo no miente; acumula lo que la mente se niega a confesar. Volvé al hueso, al músculo, a la respiración.",
    "Habitas la mente y abandonás la materia. El hombre integrado arraiga su consciencia en sus actos físicos cotidianos.",
    "La tensión que ignorás hoy se convertirá en la enfermedad de mañana. Escuchá el mensaje biológico de tu resistencia.",
    "El arraigo no es un lugar; es la capacidad de sentir el peso del propio cuerpo sin huir. ¿Sentís los pies ahora?",
    "Cuando la mente se acelera, la respiración se vuelve corta. La mente sigue al cuerpo. Cambiá el ritmo.",
    "Cada movimiento consciente es una rebelión contra la distracción. ¿Cuál fue tu último acto físico pleno?",
    "El cuerpo sabe antes que la mente. ¿Qué sensación física apareció mientras leías la pregunta?",
    "No necesitás más técnicas: necesitás volver a tu respiración profunda y sostenerla diez segundos.",
    "El hombre integrado no vive en la cabeza; camina, come, respira y descansa con presencia. Elegí un acto cotidiano para habitarlo.",
    "La materia es sabia. Tu cuerpo grita lo que tu ideología calla. Prestale atención sin traducirlo a palabras.",
  ],
  "LA SOMBRA": [
    "La sombra no se combate: se ilumina con honestidad. ¿Qué parte oscura estás dispuesto a nombrar?",
    "Lo que negás en vos, lo proyectás sobre el otro. ¿Qué cualidad criticaste hoy que habita en tu interior?",
    "El demonio interno no es enemigo: es guardián de lo reprimido. ¿Qué mensaje trae?",
    "Tu repulsa por ciertos comportamientos es un espejo. ¿A quién juzgaste con demasiada intensidad?",
    "La sombra crece en secreto y cobra intereses. Cada secreto no confesado pesa el doble. Nombrá uno.",
    "No tenés que amar lo oscuro; solo dejar de negarlo. ¿Qué emoción prohibiste sentir recientemente?",
    "El ego más peligroso es aquel que se niega a ver su propia violencia. ¿Cómo se expresa la tuya?",
    "Todo lo que reprimís busca una salida. A veces se viste de enfermedad, a veces de rabia. ¿Dónde sale lo tuyo?",
    "Integrar la sombra es devolverle su nombre sin dejar que gobierne. ¿Qué nombre le pondrías hoy?",
    "Aquello que más rechazás en los otros suele ser lo que más miedo te da reconocer en vos. Mirá con valentía.",
  ],
  "LAS RELACIONES": [
    "El otro es siempre un espejo de aquello que no has integrado en vos. ¿Qué parte de tu propia sombra estás culpando en el vínculo?",
    "La vulnerabilidad exige la muerte del orgullo. ¿Qué preferís tener: la razón o la paz de la integración?",
    "Proyectás tus carencias esperando que el otro las resuelva. Nadie puede sostener el peso de tu vacío.",
    "El amor real no nace del contrato invisible. ¿Qué expectativa no nombrada estás cobrando al otro?",
    "No necesitás ser comprendido para ser fiel a vos mismo. ¿A quién intentás convencer hoy?",
    "Cada vínculo roto comienza por una proyección no observada. ¿Qué pusiste en el otro que solo vos podés llenar?",
    "La soledad que temés no es falta de gente, es falta de presencia con vos. No la cures con relaciones.",
    "El orgullo es el impuesto que pagamos para no pedir perdón. ¿Qué puerta cerraste por no querer doblarte?",
    "El otro no te abandona: a veces simplemente deja de sostener tu sombra. ¿Qué parte de vos se derrumba sin él?",
    "Relacionarse desde la integridad implica dejar de negociar afecto por validación. ¿Qué precio pagás por ser querido?",
  ],
  "EL PODER PERSONAL": [
    "El poder no se pide ni se negocia; se ejerce asumiendo las consecuencias. ¿Qué excusa te mantiene esperando permiso?",
    "La indecisión es una decisión disfrazada de espera. ¿A qué fracaso le temés más que al propio estancamiento?",
    "El poder personal colapsa cuando buscás que el entorno valide tu siguiente paso. Actuá sin red.",
    "Delegar la responsabilidad es delegar el poder. ¿Qué decisión seguís postergando por miedo?",
    "El verdadero poder no domina a otros; domina tu propia reacción. ¿Quién controla tu temperamento hoy?",
    "No podés construir soberanía esperando aprobación. El primer paso es aceptar el costo de ser dueño de tu elección.",
    "El miedo a fallar es, en realidad, miedo a responsabilizarse. ¿Qué asumirías si nadie observara?",
    "El poder se mide en la calma con la que ejecutás decisiones impopulares. ¿Dónde elegís comodidad antes que verdad?",
    "Esperar condiciones perfectas es una forma sofisticada de no actuar. Nombrá un paso que podrías dar hoy.",
    "El hombre integrado no busca permiso; construye su propio mandato y paga sus propias consecuencias.",
  ],
  "EL DINERO Y EL VALOR": [
    "El dinero mide circulación, no valía. ¿Estás confundiendo precio con valor propio?",
    "La escasez que temés es, a menudo, la escasez de reconocimiento hacia tu propio trabajo. ¿Qué valor no te atrevés a cobrar?",
    "El verdadero capital es la integridad de tu palabra y la claridad de tu dirección. ¿En qué has invertido hoy?",
    "Perseguir dinero para tapar un vacío solo amplía el vacío. ¿Qué herida pretendés sanar con cifras?",
    "El dinero es energía. Si tu relación con él está basada en miedo, el miedo es lo que multiplicás. Mirá tu historia.",
    "Cobrar lo que valés no es avaricia; es honestidad con tu tiempo y tu atención. ¿Dónde subestimás tu precio?",
    "La abundancia no llega a quien más desea; llega a quien más confía en dar sin perderse. ¿Dás desde la carencia o desde la plenitud?",
    "Gastar para impresionar es endeudar el alma. ¿Qué compra reciente fue una transacción de validación?",
    "El hombre integrado no rehúye el dinero: lo usa como herramienta de dirección, no como medida de identidad.",
    "El valor real no se negocia en mercados. Se construye con coherencia entre lo que decís, hacés y cobrás.",
  ],
  "EL SILENCIO": [
    "El silencio asusta porque desenmascara el ruido con el que te anestesiás. Sostení el vacío sin intentar llenarlo.",
    "Hacer no es sinónimo de ser. ¿Podés permanecer diez minutos contemplando tu mente sin intervenir en ella?",
    "El verdadero refugio no está en los lugares silenciosos, sino en tu capacidad de mantener la calma en medio del caos.",
    "El silencio no es huida: es el campo donde la verdad se asienta. ¿Te atrevés a quedarte quieto?",
    "La mente te ofrecerá mil urgencias para evitar el vacío. No respondas. Observá.",
    "En el silencio, las máscaras se caen solas. No hay que arrancarlas. Sostén la quietud.",
    "El ruido interior es más violento que el exterior. El silencio lo disuelve, no lo combate.",
    "Hacer diez minutos de nada no es tiempo perdido; es recuperación de soberanía. Empezá ahora.",
    "El hombre integrado no necesita que el mundo se calle; puede permanecer atento sin reaccionar.",
    "Cada vez que huyás del silencio, huyés de lo único que no puede mentir: tu propia presencia.",
  ],
  "LA DISCIPLINA": [
    "La disciplina basada en el castigo o en el odio a uno mismo siempre fenece. ¿Podés elegir tu dirección desde el amor y el respeto al proceso?",
    "No necesitás más fuerza de voluntad; necesitás dejar de negociar con tus propias excusas cotidianas.",
    "La constancia sin presencia es solo automatismo mecánico. ¿Estás presente en el hábito que sostenés?",
    "La rigidez es solo otra forma de miedo. La disciplina real fluye, no se quiebra.",
    "El hábito que sacrifica el descanso termina sacrificando también la calidad. ¿Dónde confundís esfuerzo con destrucción?",
    "La disciplina no grita. Se levanta todos los días, hace lo que corresponde y deja el resultado en paz.",
    "Castigarte no te hace más fuerte; te hace más rígido y más frágil. ¿Podés entrenar sin odio?",
    "El verdadero orden nace de una dirección clara, no de una lista interminable. ¿Cuál es tu norte hoy?",
    "Cada excusa que aceptás sin cuestionarla te vuelve un poco más ciego. Nombrá la excusa del día.",
    "La disciplina del hombre integrado es presencia repetida, no violencia contra sí mismo.",
  ],
  "EL LIDERAZGO": [
    "Un verdadero líder no busca aplausos ni seguidores, sino coherencia en la sombra. ¿Qué harías si nadie jamás supiera de tu acierto?",
    "El liderazgo externo es un eco del desorden interno. Ordená tu caos antes de intentar guiar a otros.",
    "La popularidad es la tumba de la integridad. ¿Estás dispuesto a ser incomprendido por mantenerte fiel a tu centro?",
    "Liderar es servir a una dirección, no controlar personas. ¿A qué servís con tu autoridad?",
    "El líder que necesita ser amado genera dependencia. El que ama la verdad genera libertad. ¿Cuál sos?",
    "La mejor enseñanza no es lo que decís: es la coherencia entre lo que decís y lo que hacés en privado.",
    "Quien lidera desde el ego multiplica sufragios; quien lidera desde la integridad multiplica responsabilidad.",
    "El silencio de un líder vale más que sus discursos. ¿Cuándo escuchás antes de actuar?",
    "El verdadero liderazgo cuesta: implica decir no a quienes quieren que digas sí. ¿Qué no estás dispuesto a traicionar?",
    "El hombre integrado no lidera para ser grande; lidera para que otros descubran su propia grandeza.",
  ],
  "LAS EXPECTATIVAS": [
    "Cada expectativa no expresada es un contrato invisible que el otro nunca firmó. ¿Qué trato pretendés sin haberlo nombrado?",
    "Morir a las expectativas no es rendirse: es liberar la vida de tus condiciones. ¿A qué resultado aferrás que te roba el presente?",
    "El sufrimiento empieza donde las expectativas chocan con la realidad. ¿Qué realidad estás negando?",
    "Esperar sin acuerdo es planear resentimiento. ¿Cuántos resentimientos estás sembrando hoy?",
    "No es el otro quien te decepciona: es tu propia fantasía la que se rompe. ¿Qué guion le escribiste?",
    "Liberarte de las expectativas no significa no exigirte; significa no hipotecar tu paz a resultados.",
    "La expectativa es una forma sutil de controlar el futuro. ¿Podés dejar que la vida responda sin guion?",
    "Cada 'debería ser así' es una pequeña prisión. ¿Cuántas celdas construiste hoy?",
    "El hombre integrado no deja de aspirar; deja de condicionar su paz a que los demás cumplan su parte.",
    "La verdadera libertad comienza cuando aceptás que el mundo no firmó tu contrato emocional.",
  ],
  "LA INTEGRACION FINAL": [
    "El ego busca una línea de llegada definitiva para descansar. La integración es un estado de atención perpetua, no un título.",
    "Aceptar que sos un trabajo en progreso implica dejar de buscar la perfección ilusoria. Asumí tu humanidad descarnada.",
    "La obra no termina con una respuesta brillante. El verdadero trabajo comienza al cerrar esta pantalla y volver al mundo.",
    "No hay capítulo final: hay una vida vivida con mayor coherencia. ¿Estás dispuesto a caminar sin certezas?",
    "La integración no es equilibrio perfecto; es caerse, levantarse y seguir mirando. ¿Cuántas veces más lo intentarás?",
    "No hay diploma de hombre integrado. Solo hay la pregunta honesta en cada cruce del día.",
    "El ego querrá usar este proceso para sentirse superior. Repetí: no hay nada que lograr, solo algo que observar.",
    "La verdadera prueba ocurre en la conversación incómoda, en la respiración difícil, en el silencio del tránsito. Vivíla.",
    "Cada vez que creas que llegaste, el espejo se empaña. Mantenelo limpio con la humildad de seguir aprendiendo.",
    "El hombre integrado no es un destino: es una dirección elegida una y otra vez, sin aplausos ni rendición.",
  ],
};

const defaultPool = [
  "El conocimiento sin observación es solo acumulación de ruido. Sostén esta verdad en silencio: ¿podés aceptar este fragmento de tu sombra sin juzgarlo ni justificarlo?",
  "Has puesto tu verdad sobre la mesa. Mirala sin intentar corregirla, sin juzgarla, sin absolverla. ¿Qué te devuelve el reflejo?",
  "La mente busca conclusiones rápidas para calmar la incomodidad. Rompé el ciclo: observá tu respuesta sin absolverte ni condenarte.",
  "Ninguna IA puede resolver lo que solo el observador interno debe presenciar. Permanece con lo que acabas de escribir durante diez segundos sin moverte.",
  "El espejo no tiene opinión; solo devuelve lo que le entregás. ¿Qué hacés ahora con lo que viste?",
  "La pregunta que evitás contiene la respuesta que el espejo guarda. Mirala sin traducirla.",
  "Ninguna explicación externa reemplaza el acto de sostener lo que sentís.",
  "El espejo no juzga; solo refleja. ¿Qué hacés con lo que ahora ves?",
  "Lo que escribiste es un punto de partida, no una sentencia. Observalo sin huir.",
  "La verdad que entregaste no necesita ser arreglada; necesita ser presenciada.",
];

const superficialPool = [
  "La brevedad es otra forma de huir del espejo. Nombrá los hechos con precisión quirúrgica. ¿Qué es lo que verdaderamente temés mirar?",
  "Una respuesta tan corta revela prisa por cerrar el portal. Detente. ¿Qué hay debajo de esa línea apresurada?",
  "El silencio es sabio, pero el tuyo ahora es evasión. Escribí lo que tu mente calla por vergüenza.",
  "Esa frase apretada es una puerta que querés dejar cerrada. Empujala: ¿qué hay al otro lado?",
  "Huir del lenguaje no te libera. Nombrá el hecho con la crudeza que merece.",
  "La respuesta corta es una máscara. ¿Qué hay detrás de ella?",
  "El espejo no acepta monedas de cobre por oro. Entregá lo que pesa.",
  "Dos palabras no nombran un mundo. Extendé la mano hacia lo incómodo.",
  "Cada palabra que omitís es una sombra que se queda sin luz. Escribila.",
  "No hay prisa. El espejo puede esperar, pero tu evasión no se esconde.",
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
  if (toneKey !== "neutral") {
    const prefix = buildTonePrefix(toneKey, ctx);
    if (prefix) response = `${prefix} ${core}`;
  }

  const typeLabel = toneKey === "neutral" ? dimensionKey : `${dimensionKey} — ${toneKey.toUpperCase()}`;

  return { type: typeLabel, response };
}
