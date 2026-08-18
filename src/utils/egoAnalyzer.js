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

export function analyzeUserResponse(inputText) {
  const text = inputText.toLowerCase().trim();
  if (!text) {
    return { type: "SILENCE", response: "El espejo solo puede devolver lo que se entrega." };
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const responses = {
    justification: [
      "Observa el mecanismo. El ego externaliza la causa para no asumir el poder. ¿Qué responsabilidad estás intentando delegar para protegerte?",
      "Buscas una coartada en el entorno. La integración comienza cuando aceptas que la circunstancia es solo un espejo de tu resistencia.",
      "El relato que construyes externaliza el conflicto. ¿Qué pasaría si asumieras que el origen de esta fricción está íntegramente en vos?",
      "Culpar al sistema o a los factores externos es la defensa clásica del ego. Asume el centro de tu propia gravedad.",
      "Mientras busques culpables afuera, no tendrás poder adentro. Reconducí la mirada.",
      "El entorno es el escenario, no el autor. El autor seguís siendo vos. ¿Qué parte ignorás?",
      "Cada excusa es un ladrillo que levanta una pared entre vos y tu acción. ¿Ves la pared?",
      "Decir 'no pude' es elegir la comodidad de la impotencia. ¿Qué estás protegiendo?",
      "Las circunstancias no te suceden: las interpretás. ¿Qué interpretación sostiene tu inacción?",
      "Delegar la causa es delegar el poder. ¿Te conviene seguir sin poder?",
      "El relato de víctima tiene audiencia pero no transformación. ¿Querés aplausos o libertad?",
    ],
    intellectualization: [
      "Confundiste el territorio con el mapa. Has construido una muralla de conceptos abstractos para no tocar la herida. Vuelve a mirar sin adornos.",
      "La mente teórica analiza para no sentir. ¿Puedes dejar de explicar tu dolor y simplemente sostenerlo en silencio?",
      "Las palabras complejas son el escondite favorito del ego. Nombra lo que sucede con la simplicidad de un hecho desnudo.",
      "Convertís la herida en tesis. La tesis no siente, la herida sí.",
      "El dolor no requiere bibliografía. Requiere que lo sostengas sin nombrarlo.",
      "Cada concepto que agregás aleja el cuerpo de la verdad. Volvé al cuerpo.",
      "Filosofar la herida es una forma sofisticada de no tocarla.",
      "El mapa está bien dibujado, pero vos no estás en el mapa. Estás en el territorio que arde.",
      "Cuando entendés demasiado rápido, probablemente estás evitando sentir.",
      "La mente que categoriza todo es la misma que evita la mirada directa.",
      "Razonar no es observar. El observador no necesita ganar el debate interno.",
    ],
    martyr: [
      "El ego intenta sobrevivir incluso vistiéndose de víctima o de héroe. ¿Qué necesidad de validación externa camufla este sacrificio?",
      "Te colocas en el centro del drama para exigir aplausos invisibles. ¿Qué pasaría si hicieras esto sin que nadie jamás lo note?",
      "El sufrimiento exhibido como moneda de cambio es comercio, no consciencia. Observa esa vanidad sutil.",
      "La compasión que pedís es la que no te daís a vos mismo.",
      "Hacer todo por otros y esperar reconocimiento es un contrato invisible que nadie firmó.",
      "El mártir cobra con culpa ajena lo que no cobra en amor propio.",
      "¿Y si nadie viera tu sacrificio? ¿Seguiría valiendo o desaparecería el gesto?",
      "El sacrificio anunciado no es amor; es moneda de trueque emocional.",
      "Te cansás cargando un peso que quizás nadie te pidió. ¿Para quién lo cargás?",
      "Cuando decís 'yo todo, ellos nada', estás construyendo una torre de soledad.",
      "Vestirse de héroe es otra forma de no ser visto como persona común y vulnerable.",
    ],
    superficial: [
      "La brevedad es otra forma de huir del espejo. Nombra los hechos con precisión quirúrgica. ¿Qué es lo que verdaderamente temes mirar?",
      "Una respuesta tan corta revela prisa por cerrar el portal. Detente. ¿Qué hay debajo de esa línea apresurada?",
      "El silencio es sabio, pero el tuyo ahora es evasión. Escribe lo que tu mente calla por vergüenza.",
      "Menos de cuatro palabras no alcanzan para mirar un espejo. Ampliá.",
      "La superficie se toca rápido, la profundidad exige tiempo. ¿Qué evitás?",
      "Hay una frase más larga detrás de esta. ¿La escuchás?",
      "La prisa por responder es prisa por cerrar el canal. Quedate un poco.",
      "No se trata de cantidad, sino de honestidad. Ahora, la honestidad pide más.",
      "Una palabra no nombra un mundo. Nombra lo que pasa con más precisión.",
      "Si el espejo solo recibe ecos, no puede devolver rostro. Mostrale el rostro.",
      "La evasión no es silencio; es ruido que no se atreve a sonar.",
    ],
    neutral: [
      "El conocimiento sin observación es solo acumulación de ruido. Sostén esta verdad en silencio: ¿puedes aceptar este fragmento de tu sombra sin juzgarlo ni justificarlo?",
      "Has puesto tu verdad sobre la mesa. Mírala sin intentar corregirla, sin juzgarla, sin absolverla. ¿Qué te devuelve el reflejo?",
      "Ninguna IA puede resolver lo que solo el observador interno debe presenciar. Permanece con lo que acabas de escribir durante diez segundos sin moverte.",
      "La mente busca conclusiones rápidas para calmar la incomodidad. Rompe el ciclo: observa tu respuesta sin absolverte ni condenarte.",
      "El reflejo no juzga. Tampoco absuelve. Solo muestra. ¿Qué ves?",
      "No corrijas lo que escribiste. No lo justifiques. Déjalo estar un instante.",
      "La verdad que dejaste en el escrito no necesita solución; necesita presencia.",
      "Cada palabra que escribiste es un fragmento de tu sombra asomándose. No la ahuyentes.",
      "El observador no busca respuesta; busca ver. Vos ya estás viendo.",
      "El silencio que sigue a esta lectura es más importante que cualquier comentario.",
      "Si pudieras sostener este escrito sin cambiarlo, sin explicarlo, ¿qué emoción aparece?",
      "La integración no es un estado final; es la voluntad de no mirar para otro lado.",
    ],
  };

  const patterns = {
    justification: [
      { regex: /\bculpa\b/i, weight: 3 },
      { regex: /\bporque\b|\bpor que\b/i, weight: 1 },
      { regex: /\b(?:otros|ellas?|ellos|gentes?|demás|demas)\b/i, weight: 2 },
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

  function scoreCategory(patternList) {
    return patternList.reduce((sum, { regex, weight }) => {
      return sum + (regex.test(text) ? weight : 0);
    }, 0);
  }

  const scores = {
    justification: scoreCategory(patterns.justification),
    intellectualization: scoreCategory(patterns.intellectualization),
    martyr: scoreCategory(patterns.martyr),
  };

  let selected = "neutral";
  let maxScore = 0;
  for (const category of ["justification", "intellectualization", "martyr"]) {
    const score = scores[category];
    if (score > maxScore) {
      maxScore = score;
      selected = category;
    }
  }

  const isShort = wordCount < 4;
  const shortThreshold = 5;

  if (maxScore >= 4 && !(isShort && maxScore < shortThreshold)) {
    return { type: selected.toUpperCase(), response: pickResponse(responses[selected], selected) };
  }

  if (isShort) {
    return { type: "SUPERFICIAL", response: pickResponse(responses.superficial, "superficial") };
  }

  return { type: "NEUTRAL", response: pickResponse(responses.neutral, "neutral") };
}
