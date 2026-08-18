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
  "La civilización hipertecnológica entrenó máquinas para el trabajo y la velocidad, pero atrofió la presencia del ser humano.",
  "Antes de aumentar el poder de un ser, hay que observar cómo usa ese amplificador y su memoria.",
  "No son las respuestas extraordinarias las que nos transforman; son las preguntas capaces de reorganizar lo que creíamos saber.",
  "Aquello a lo que entregás tu atención termina construyéndote.",
  "La herramienta no debe convertirse en el objeto de la conciencia; debe convertirse en el espejo que devuelve la conciencia a quien la utiliza.",
  "El ruido nunca fue el enemigo; el enemigo fue olvidar que existe el silencio.",
  "La distancia entre tus valores y tus hábitos es el lugar exacto donde comienza tu entrenamiento.",
  "Tus valores no son lo que decís que importa; son aquello a lo que entregás repetidamente tu vida.",
  "La autoconsciencia no es una doctrina; es una capacidad entrenable.",
  "El integrado no es el que nunca reacciona; es el que puede ver la reacción antes de entregarle el cuerpo.",
  "El poder no domina a otros; domina la propia reacción.",
  "La integridad es reducir progresivamente la distancia entre lo que uno sabe, dice y hace.",
  "El mundo puede cambiar para siempre sin cambiar de aspecto.",
  "La práctica es una transformación; la fe puede ser solo una idea.",
  "No todo lo que aparece dentro de nosotros necesita convertirse en acción; un impulso es una propuesta.",
  "La conciencia se pierde mucho más fácilmente de lo que se adquiere.",
];

const toneMechanisms = {
  justification: [
    "el ego externaliza la causa para no asumir el poder",
    "buscás una coartada en el entorno antes de asumir tu centro",
    "el relato construye una culpa compartida con el sistema",
    "cada 'porque' es un cable que delega tu responsabilidad a factores ajenos",
    "decir que no depende de vos es elegir la impotencia como refugio",
    "el entorno se convierte en excusa para no mover el centro",
    "justificar es construir una celda con las palabras 'no pude'",
    "la circunstancia solo revela dónde aún no te has hecho cargo",
    "la culpa compartida con el sistema es responsabilidad negada",
    "antes de aumentar tu poder, usás el amplificador para excusarte",
    "el ruido digital se transforma en coartada cuando no querés escuchar el silencio",
    "el relato externaliza el conflicto para protegerte",
  ],
  intellectualization: [
    "confundiste el territorio con el mapa",
    "los conceptos abstractos armaron una muralla alrededor de la herida",
    "explicar se volvió estrategia para no sentir",
    "la mente teórica analiza para no sentir",
    "filosofar sobre el dolor es una forma elegante de no tocarlo",
    "el intelecto ordena para no dejarse desordenar por lo real",
    "nombrar el trauma con palabras ricas no lo disuelve; lo distrae",
    "el análisis infinito es el ruido que la herida pone para no ser sentida",
    "construís un lenguaje privado para habitar la herida sin curarla",
    "te perdiste en el mapa mientras el territorio sangra",
    "la teoría no reemplaza la observación; la observa desde arriba",
    "bajá del mapa al territorio: el cuerpo no lee conceptos",
  ],
  martyr: [
    "el ego se cobra con sufrimiento exhibido",
    "el sacrificio exige un aplauso invisible",
    "la víctima se viste de héroe para sobrevivir",
    "cargar con todo es una forma secreta de exigir reconocimiento",
    "el mártir paga con sufrimiento para cobrar atención",
    "el peso que elegís llevar solo para que vean es un yugo invisible",
    "el dolor presentado como moneda es comercio, no consciencia",
    "decir 'nadie nota' es confirmar que el sufrimiento busca testigo",
    "el sacrificio gratuito siempre tiene un precio emocional",
    "aguantar para que admiren tu resistencia es seguir dependiendo del otro",
    "te colocás en el centro del drama para exigir aplausos invisibles",
    "el sufrimiento exhibido como moneda de cambio es vanidad sutil",
  ],
  superficial: [
    "la brevedad es otra forma de huir del espejo",
    "una respuesta tan corta revela prisa por cerrar el portal",
    "el silencio es sabio, pero el tuyo ahora es evasión",
    "esa frase apretada es una puerta que querés dejar cerrada",
    "huir del lenguaje no te libera; solo pospone el encuentro",
    "la respuesta corta es una máscara que oculta el hecho",
    "el espejo no acepta monedas de cobre por oro",
    "dos palabras no nombran un mundo",
    "cada palabra que omitís es una sombra que se queda sin luz",
    "la prisa por cerrar es miedo a lo que aparece si te quedás",
    "el lenguaje mínimo es defensa cuando la verdad pesa demasiado",
    "no hay prisa: el espejo puede esperar, pero tu evasión no se esconde",
  ],
  neutral: [
    "el espejo devuelve lo que le entregás, sin corregir ni absolver",
    "la observación honesta vale más que la respuesta brillante",
    "la mente busca conclusiones rápidas para calmar la incomodidad",
    "ninguna IA puede resolver lo que solo el observador interno debe presenciar",
    "has puesto tu verdad sobre la mesa; ahora solo hace falta mirarla",
    "la integración es un estado de atención, no un título que conquistar",
    "el conocimiento sin observación es solo acumulación de ruido",
    "permanece con lo que escribiste diez segundos sin moverte",
    "la verdad que entregaste no necesita ser arreglada; necesita ser presenciada",
    "el espejo no juzga; solo refleja",
    "lo que escribiste es un punto de partida, no una sentencia",
    "la pregunta que evitás contiene la respuesta que el espejo guarda",
  ],
};

const toneDirectives = {
  justification: [
    "asumí el centro de tu propia gravedad en {ctx}",
    "dejá de delegar el poder a factores ajenos",
    "reclamá la responsabilidad que le regalaste al entorno",
    "nombrá lo que evitás asumir",
    "cortá el cable que conecta tu excusa con el mundo",
    "volvé a tu cuerpo y sentí el peso de tu propia elección",
    "pará de buscar permiso o culpables para actuar",
    "hacete cargo del amplificador antes de exigir más potencia",
    "convertí la queja en una pregunta de responsabilidad",
    "mirá cómo usás tu memoria: ¿sirve a tu dirección o a tu defensa?",
    "en {ctx}, el entorno no se mueve hasta que vos dejés de esperar su permiso",
    "reclamá la parte del mando que depende de vos",
  ],
  intellectualization: [
    "bajá del mapa al territorio de {ctx}",
    "dejá los conceptos y tocá el hecho físico y descarnado",
    "descendé de la teoría a la sensación",
    "permití que la herida exista sin explicación",
    "traducí el pensamiento a una acción concreta en {ctx}",
    "sentí la pregunta en el cuerpo antes de responderla",
    "interrumpí el análisis con un acto de presencia",
    "hablá con la simplicidad de un hecho desnudo",
    "dejá las citas y volvé al territorio de tu propia experiencia",
    "la teoría no reemplaza la observación; la observa desde arriba",
    "en {ctx}, dejá de explicar y comenzá a sentir",
    "la mente teórica analiza para no sentir: interrumpila",
  ],
  martyr: [
    "hacé esto sin que nadie jamás lo note",
    "dejá de cobrar con sufrimiento",
    "soltá la cruz que elegiste como moneda de cambio",
    "mirá qué necesidad de validación camufla tu sacrificio",
    "actuá desde la plenitud, no desde la deuda",
    "pagá el precio emocional sin esperar recibo",
    "hacé lo que corresponde sin anunciarlo",
    "reclamá tu soberanía en lugar de tu dolor",
    "decidí si el sacrificio es amor o contrato invisible",
    "el hombre integrado da sin exigir que el mundo lo vea",
    "soltá la carga y mirá qué pesa más: el hecho o el aplauso ausente",
    "en {ctx}, nadie firmó tu contrato emocional",
  ],
  superficial: [
    "nombrá los hechos con precisión quirúrgica",
    "extendé la mano hacia lo incómodo",
    "escribí lo que tu mente calla por vergüenza",
    "detenete y sostené la mirada un minuto más",
    "abrí la puerta que querés dejar cerrada",
    "soltá la prisa y dejá que la verdad pese",
    "volvé a la pregunta y respondela con el cuerpo, no con una etiqueta",
    "escribí una línea que no estés dispuesto a mostrar",
    "descendé del resumen al hecho concreto",
    "no cierres el portal hasta que haya algo real en la mesa",
    "sostené la pregunta sin responderla diez segundos",
    "dejá que {ctx} aparezca con más palabras de las que te permitís",
  ],
  neutral: [
    "sostén esta verdad en silencio",
    "observá tu respuesta sin absolverte ni condenarte",
    "permanece con lo que escribiste durante diez segundos sin moverte",
    "mirá lo que surge sin intentar corregirlo",
    "volvé a la pregunta y dejala resonar en el cuerpo",
    "aceptá este fragmento de tu sombra sin juzgarlo ni justificarlo",
    "dejá que el reflejo hable antes de responder por él",
    "rompé el ciclo de conclusiones rápidas",
    "presenciá lo que escribiste como si fuera de otro",
    "la atención es el único recurso que no podés recuperar: usala aquí",
    "la pregunta que evitás contiene la respuesta que el espejo guarda",
    "en {ctx}, solo el observador interno puede presenciar esto",
  ],
};

const toneQuestions = {
  justification: [
    "¿qué decisión estás delegando?",
    "¿qué parte de esta situación depende exclusivamente de vos?",
    "¿a qué le temés más que a asumir el centro?",
    "¿qué excusa te mantiene esperando permiso?",
    "¿qué responsabilidad estás intentando delegar?",
    "¿qué pasaría si asumieras que el origen está íntegramente en vos?",
    "¿quién o qué pierde poder si dejás de culpar?",
    "¿qué elegís hacer hoy con la parte que sí depende de vos?",
    "¿dónde dejás el mando de tu atención?",
    "¿qué mentira contás para no actuar?",
    "¿qué es lo que realmente no querés ver?",
    "¿en {ctx}, qué parte del entorno tomás como dueño?",
  ],
  intellectualization: [
    "¿qué sensación física aparece si dejás de explicar?",
    "¿podés dejar de analizar y simplemente sentirlo?",
    "¿qué nombre desnudo le pondrías al hecho?",
    "¿dónde está tu cuerpo mientras teorizás?",
    "¿qué ocurre si bajás del mapa al territorio?",
    "¿qué pasaría si no tuvieras palabras para describir esto?",
    "¿qué parte de tu teoría es pura defensa?",
    "¿sentís la pregunta o solo la pensás?",
    "¿qué acción concreta surge si abandonás el concepto?",
    "¿qué harías si nadie valorara tu análisis?",
    "¿cuánto de lo que llamás realidad es interpretación?",
    "¿podés describir esto con la simplicidad de un hecho desnudo?",
  ],
  martyr: [
    "¿qué necesidad de validación camufla este sacrificio?",
    "¿qué harías si nadie jamás supiera de tu entrega?",
    "¿cuándo empezó este peso a cobrarse con atención?",
    "¿qué precio emocional estás exigiendo?",
    "¿podés dar sin esperar que lo noten?",
    "¿qué parte de tu dolor es moneda de cambio?",
    "¿quién debería pagar lo que vos estás pagando?",
    "¿qué pasaría si soltás la cruz?",
    "¿tu sacrificio es amor o contrato invisible?",
    "¿de quién depende tu valía hoy?",
    "¿qué harías en {ctx} si nadie aplaudiera?",
    "¿podés dar sin exigir recibo?",
  ],
  superficial: [
    "¿qué es lo que verdaderamente temés mirar?",
    "¿qué hay debajo de esa línea apresurada?",
    "¿qué escribiría una versión tuya sin miedo?",
    "¿qué hecho evitás nombrar?",
    "¿por qué cerrás el portal con tan pocas palabras?",
    "¿qué ocurre si escribís cinco líneas más?",
    "¿qué vergüenza oculta tu brevedad?",
    "¿qué tendría que ser real para que te quedaras?",
    "¿qué hay al otro lado de la puerta?",
    "¿qué parte del espejo te asusta?",
    "¿qué pasaría si sostuvieras la pregunta un minuto más?",
    "¿qué ocurre en {ctx} cuando no te escapás?",
  ],
  neutral: [
    "¿qué te devuelve el reflejo?",
    "¿podés aceptar este fragmento sin juzgarlo?",
    "¿qué ocurre si permanecés diez segundos con esto?",
    "¿qué dirección emerge de esta observación?",
    "¿qué hacés ahora con lo que viste?",
    "¿qué parte de vos apareció que no esperabas?",
    "¿qué pregunta subyace debajo de tu respuesta?",
    "¿cómo se siente esta verdad en el cuerpo?",
    "¿qué decisión coherente nace de aquí?",
    "¿dónde aplicarás lo que observaste hoy?",
    "¿qué harías si supieras que nadie va a ver esta respuesta?",
    "¿qué parte de {ctx} pide ser presenciada?",
  ],
};

const dimensionAnchors = {
  "EL RUIDO": [
    "el ruido digital no es un ambiente, es una decisión repetida",
    "cada alerta que atendés sin intención roba un fragmento de tu soberanía",
    "la tecnología es un amplificador; mirá qué amplifica en vos",
    "el cuerpo pide silencio mientras la pantalla exige respuesta",
    "la atención es el único recurso que no recuperás",
    "las mejores preguntas no exigen respuestas inmediatas; exigen transformación",
    "no son las respuestas extraordinarias las que nos transforman",
    "lo rígido resiste, lo vivo se adapta",
    "la herramienta no debe convertirse en el objeto de la conciencia",
    "aquello a lo que entregás tu atención termina construyéndote",
    "la civilización entrenó máquinas y olvidó entrenar la atención",
    "el ruido nunca fue el enemigo; el enemigo fue olvidar que existe el silencio",
  ],
  "AUTOCONSCIENCIA": [
    "la autoconsciencia no es autocrítica, es observar al observador",
    "la máscara que defendiste hoy es una puerta",
    "detrás de cada personaje hay un miedo",
    "conocerse es dejar de creer las etiquetas",
    "el espejo no miente, solo refleja",
    "no elegís cada pensamiento, elegís cuál merece convertirse en acción",
    "no todo lo que pensás merece convertirse en creencia",
    "aquello que no observás prácticamente no existe para tu experiencia",
    "la distancia entre tus valores y tus hábitos es donde comienza tu entrenamiento",
    "tus valores son aquello a lo que entregás repetidamente tu vida",
    "el integrado no es el que nunca reacciona; es el que ve la reacción antes de entregarle el cuerpo",
    "¿quién observa tus pensamientos?",
  ],
  "EL CUERPO Y EL ARRAIGO": [
    "el cuerpo grita lo que la mente niega",
    "el arraigo no es un lugar, es sentir el peso del propio cuerpo",
    "la respiración es el primer territorio de la presencia",
    "cada movimiento consciente es una rebelión contra la distracción",
    "la materia es sabia y no se deja engañar por palabras",
    "el cuerpo y la mente son un solo territorio; dividirlos es el primer ruido",
    "caminar descalzo es volver a percibir el mundo",
    "el agua nunca discute con la piedra; simplemente sigue fluyendo",
    "la tensión que ignorás hoy se convierte en la enfermedad de mañana",
    "escuchá el mensaje biológico de tu resistencia",
    "el arraigo físico es el primer santuario de la consciencia",
    "volvé al hueso, al músculo, a la respiración",
  ],
  "LA SOMBRA": [
    "la sombra no se combate, se ilumina",
    "lo que negás en vos lo proyectás sobre el otro",
    "cada secreto no confesado pesa el doble",
    "el demonio interno es guardián de lo reprimido",
    "integrar la sombra es devolverle su nombre sin dejar que gobierne",
    "lo que podés ver ya no necesita gobernarte desde la oscuridad",
    "la luz no rechaza la sombra; le devuelve su lugar",
    "la sombra es la parte de vos que espera ser reconocida",
    "no convertir tu dolor en una identidad",
    "lo que reprimís no desaparece; pide voz en la oscuridad",
    "tu vergüenza es una puerta, no una pared",
    "cuando la luz llega, la sombra deja de ser monstruo",
  ],
  "LAS RELACIONES": [
    "el otro es espejo de lo que no integraste",
    "el vínculo roto comienza en una proyección no observada",
    "la soledad que temés es falta de presencia con vos",
    "el orgullo es el impuesto que pagamos para no pedir perdón",
    "relacionarse con integridad implica dejar de negociar afecto",
    "no intentés sentir por el otro; aprendé a estar con el otro",
    "la empatía no te hace más débil, te hace más grande",
    "el otro posee una interioridad que no te pertenece",
    "la vulnerabilidad exige la muerte del orgullo",
    "no proyectes tus carencias esperando que el otro las resuelva",
    "¿quién sos cuando no podés obtener lo que querés del otro?",
    "la relación es un espejo de aquello que no has integrado",
  ],
  "EL PODER PERSONAL": [
    "el poder no se pide, se ejerce asumiendo consecuencias",
    "la indecisión es una decisión disfrazada de espera",
    "delegar responsabilidad es delegar poder",
    "el miedo a fallar es miedo a responsabilizarse",
    "el poder se mide en la calma de decisiones impopulares",
    "en el espacio entre estímulo y respuesta está tu libertad",
    "el miedo disminuye con entrenamiento, no con explicaciones",
    "pará de pedir permiso para existir",
    "hacete cargo del amplificador antes de exigir más potencia",
    "tu poder se mide en la dirección que elegís una y otra vez",
    "el poder personal colapsa cuando buscás que el entorno valide tu próximo paso",
    "actuá sin red",
  ],
  "EL DINERO Y EL VALOR": [
    "el dinero mide circulación, no valía",
    "gastar para impresionar es endeudar el alma",
    "el valor real no se negocia en mercados",
    "cobrar lo que valés no es avaricia, es honestidad",
    "el dinero es energía; si tu relación con él tiene miedo, el miedo se multiplica",
    "tus valores aparecen en tu agenda, tu dinero, tu atención y tus hábitos",
    "¿qué perderías realmente si perdieras todo tu dinero?",
    "el dinero es energía hecha estructura",
    "subvalorás lo que no te animás a cobrar",
    "el precio que cobrás refleja el valor que te das",
    "la escasez heredada repite historias hasta que alguien las observa",
    "¿tu dinero es un medio o se convirtió en tu única medida?",
  ],
  "EL SILENCIO": [
    "el silencio asusta porque desenmascara el ruido",
    "hacer no es sinónimo de ser",
    "el verdadero refugio es la calma dentro del caos",
    "la mente ofrece urgencias para evitar el vacío",
    "el silencio disuelve el ruido, no lo combate",
    "podés permanecer diez minutos contemplando tu mente sin intervenir en ella",
    "el silencio no es ausencia de sonido; es otra clase de música",
    "en el silencio no hay nada que conquistar",
    "el vacío no está afuera; está en vos",
    "el silencio es sabio, pero el tuyo puede ser evasión",
    "detenete y sostené la mirada un minuto más",
    "la calma que podés sostener dentro del caos es tu verdadero refugio",
  ],
  "LA DISCIPLINA": [
    "la disciplina real fluye, no se quiebra",
    "castigarte no te hace más fuerte, te hace más frágil",
    "la constancia sin presencia es automatismo",
    "la rigidez es otra forma de miedo",
    "la disciplina es presencia repetida, no violencia contra uno mismo",
    "no necesitás más información; necesitás repetición",
    "la práctica es una transformación, la fe puede ser solo una idea",
    "un hábito no se construye con una revelación; se construye con repeticiones",
    "elegí una sola cosa y hacela con atención plena",
    "la disciplina basada en el castigo siempre fenece",
    "la constancia sin presencia es solo automatismo mecánico",
    "el entrenamiento verdadero disminuye el miedo, no la dificultad",
  ],
  "EL LIDERAZGO": [
    "liderar es servir a una dirección, no controlar personas",
    "el líder que necesita ser amado genera dependencia",
    "la mejor enseñanza es la coherencia entre lo privado y lo público",
    "el silencio de un líder vale más que sus discursos",
    "el hombre integrado no lidera para ser grande",
    "la verdadera prueba del liderazgo es construir algo que sobreviva a tu ausencia",
    "el fundador debe ser el primero en aceptar que puede estar equivocado",
    "si una estructura depende de que sus líderes sean perfectos, está condenada",
    "un líder no busca aplausos ni seguidores, sino coherencia en la sombra",
    "la popularidad es la tumba de la integridad",
    "el liderazgo externo es un eco del desorden interno",
    "¿qué harías si nadie jamás supiera de tu acierto?",
  ],
  "LAS EXPECTATIVAS": [
    "cada expectativa no expresada es un contrato invisible",
    "morir a las expectativas no es rendirse, es liberar la vida",
    "el sufrimiento empieza donde la expectativa choca con la realidad",
    "la expectativa es una forma sutil de controlar el futuro",
    "el mundo no firmó tu contrato emocional",
    "la expectativa es una deuda que nadie te debe",
    "¿a quién le perdonarías hoy de deber?",
    "el futuro imaginario te roba la atención del hoy",
    "desear no es lo mismo que esperar",
    "la decepción es el precio de tus expectativas no expresadas",
    "la versión tuya que estás agotado de sostener es una expectativa ajena",
    "soltá el guion que nadie firmó",
  ],
  "LA INTEGRACION FINAL": [
    "la integración no es una meta, es una dirección",
    "no hay diploma de hombre integrado",
    "cada vez que creas que llegaste, el espejo se empaña",
    "el trabajo verdadero empieza al cerrar esta pantalla",
    "la integración es caerse, levantarse y seguir mirando",
    "no necesitás odiar al hombre que fuiste para convertirte en quien podés ser",
    "el hombre integrado no es el que ya no sufre; es el que ya no huye de su propio espejo",
    "ser un trabajo en progreso no es excusa; es verdad",
    "la integración es coordinación, no pureza",
    "cada paso es una elección consciente",
    "el trabajo no termina con una respuesta brillante",
    "la atención perpetua es el único título que importa",
  ],
};

const responseTemplates = {
  justification: [
    "{premise} {mechanism}. {directive}. {question}",
    "{mechanism}. {premise} {directive}. {question}",
    "{directive}. {mechanism}. En {ctx}, {question}",
    "{premise} {directive}. {mechanism}. {question}",
    "{mechanism}. {question} {directive}. {premise}",
    "En {ctx}, {mechanism}. {directive}. {question}",
  ],
  intellectualization: [
    "{premise} {mechanism}. {directive}. {question}",
    "{mechanism}. {premise} {directive}. {question}",
    "{directive}. {mechanism}. {question}. {premise}",
    "{premise} {directive}. {mechanism}. {question}",
    "En {ctx}, {mechanism}. {directive}. {question}",
    "{mechanism}. {directive}. Dejá el mapa: {question}",
  ],
  martyr: [
    "{premise} {mechanism}. {directive}. {question}",
    "{mechanism}. {premise} {directive}. {question}",
    "{directive}. {mechanism}. {question}. {premise}",
    "{premise} {directive}. {mechanism}. {question}",
    "En {ctx}, {mechanism}. {directive}. {question}",
    "{mechanism}. {question}. Hacé el siguiente paso en silencio.",
  ],
  superficial: [
    "{mechanism}. {directive}. {question}",
    "{directive}. {mechanism}. {question}",
    "{mechanism}. En {ctx}, {directive}. {question}",
    "{premise} {mechanism}. {directive}. {question}",
    "{directive}. {question}. {mechanism}",
    "{question}. {mechanism}. {directive}",
  ],
  neutral: [
    "{premise} En {ctx}, {anchor}. {directive}. {question}",
    "En {ctx}, {anchor}. {directive}. {question}",
    "{anchor}. {premise} {directive}. {question}",
    "{directive}. En {ctx}, {anchor}. {question}",
    "{question}. {anchor}. {directive}. {premise}",
    "{premise} {directive}. En {ctx}, {anchor}. {question}",
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

function cleanPunctuation(str) {
  // Collapse a question/exclamation followed by a stray period: "?." / "? ." -> "? "
  return str.replace(/([?!])\s*\.+\s*/g, "$1 ");
}

function normalizeCasing(str) {
  return str.replace(/(^|[.?!:]\s+)(¿|¡)?([a-záéíóúñ])/g, (_, boundary, punct, letter) =>
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
  const question = startLower(pick(toneQuestions[tone]).replace("{ctx}", ctx));
  const anchorList = dimensionAnchors[dimensionKey] || dimensionAnchors["LA INTEGRACION FINAL"];
  const anchor = startLower(pick(anchorList).replace("{ctx}", ctx));

  const template = pick(responseTemplates[tone]);
  let response = template
    .replace(/\{premise\}/g, premise)
    .replace(/\{mechanism\}/g, mechanism)
    .replace(/\{directive\}/g, directive)
    .replace(/\{question\}/g, question)
    .replace(/\{ctx\}/g, ctx)
    .replace(/\{anchor\}/g, anchor);

  response = response.replace(/\s+/g, " ").trim();
  response = cleanPunctuation(response);
  response = normalizeCasing(response);

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
