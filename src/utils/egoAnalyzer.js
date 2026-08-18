export function analyzeUserResponse(inputText) {
  const text = inputText.toLowerCase().trim();
  const words = text.split(/\s+/);
  const wordCount = words.length;

  const responses = {
    justification: [
      "Observa el mecanismo. El ego externaliza la causa para no asumir el poder. ¿Qué responsabilidad estás intentando delegar para protegerte?",
      "Buscas una coartada en el entorno. La integración comienza cuando aceptas que la circunstancia es solo un espejo de tu resistencia.",
      "El relato que construyes externaliza el conflicto. ¿Qué pasaría si asumieras que el origen de esta fricción está íntegramente en vos?",
    ],
    intellectualization: [
      "Confundiste el territorio con el mapa. Has construido una muralla de conceptos abstractos para no tocar la herida. Vuelve a mirar sin adornos.",
      "La mente teórica analiza para no sentir. ¿Puedes dejar de explicar tu dolor y simplemente sostenerlo en silencio?",
      "Las palabras complejas son el escondite favorito del ego. Nombra lo que sucede con la simplicidad de un hecho desnudo.",
    ],
    martyr: [
      "El ego intenta sobrevivir incluso vistiéndose de víctima o de héroe. ¿Qué necesidad de validación externa camufla este sacrificio?",
      "Te colocas en el centro del drama para exigir aplausos invisibles. ¿Qué pasaría si hicieras esto sin que nadie jamás lo note?",
      "El sufrimiento exhibido como moneda de cambio es comercio, no consciencia. Observa esa vanidad sutil.",
    ],
    superficial: [
      "La brevedad es otra forma de huir del espejo. Nombra los hechos con precisión quirúrgica. ¿Qué es lo que verdaderamente temes mirar?",
      "Una respuesta tan corta revela prisa por cerrar el portal. Detente. ¿Qué hay debajo de esa línea apresurada?",
      "El silencio es sabio, pero el tuyo ahora es evasión. Escribe lo que tu mente calla por vergüenza.",
    ],
    neutral: [
      "El conocimiento sin observación es solo acumulación de ruido. Sostén esta verdad en silencio: ¿puedes aceptar este fragmento de tu sombra sin juzgarlo ni justificarlo?",
      "Has puesto tu verdad sobre la mesa. Mírala sin intentar corregirla, sin juzgarla, sin absolverla. ¿Qué te devuelve el reflejo?",
      "Ninguna IA puede resolver lo que solo el observador interno debe presenciar. Permanece con lo que acabas de escribir durante diez segundos sin moverte.",
      "La mente busca conclusiones rápidas para calmar la incomodidad. Rompe el ciclo: observa tu respuesta sin absolverte ni condenarte.",
    ],
  };

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // PRIORIDAD 1: Detectar patrones estructurales de defensa del ego (antes de medir longitud)
  if (/(culpa|porque|otros|sistema|fueron|nadie me entiende|por su culpa)/i.test(text)) {
    return { type: "JUSTIFICATION", response: getRandom(responses.justification) };
  }
  if (/(teoría|analizando|sicológicamente|mental|concepto|filosóficamente)/i.test(text)) {
    return { type: "INTELLECTUALIZATION", response: getRandom(responses.intellectualization) };
  }
  if (/(siempre|nunca|mártir|sacrificio|nadie valora|fui el único)/i.test(text)) {
    return { type: "MARTYR", response: getRandom(responses.martyr) };
  }

  // PRIORIDAD 2: Solo si el texto es extremadamente corto (menos de 4 palabras), activar superficial
  if (wordCount < 4) {
    return { type: "SUPERFICIAL", response: getRandom(responses.superficial) };
  }

  // PRIORIDAD 3: Devolución profunda por defecto (rotando entre múltiples opciones neutrales)
  return { type: "NEUTRAL", response: getRandom(responses.neutral) };
}
