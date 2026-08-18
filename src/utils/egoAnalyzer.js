export function analyzeUserResponse(inputText) {
  const text = inputText.toLowerCase();

  // Patrón 1: El Evasivo / Justificador (Culpa a factores externos)
  const externalBlameKeywords = [
    "la culpa es",
    "el sistema",
    "los demás",
    "no tuve opción",
    "por culpa de",
    "circunstancias",
  ];
  if (externalBlameKeywords.some((keyword) => text.includes(keyword))) {
    return {
      type: "JUSTIFICATION",
      response:
        "Observa el mecanismo. El ego externaliza la causa para no asumir el poder. ¿Qué responsabilidad estás intentando delegar para protegerte?",
    };
  }

  // Patrón 2: El Intelectualizador / Académico (Usa teoría para no sentir)
  const intellectualKeywords = [
    "teóricamente",
    "analizando el contexto",
    "sicológicamente",
    "uno debe",
    "la sociedad exige",
  ];
  if (intellectualKeywords.some((keyword) => text.includes(keyword))) {
    return {
      type: "INTELLECTUALIZATION",
      response:
        "Confundiste el territorio con el mapa. Has construido una muralla de conceptos abstractos para no tocar la herida. Vuelve a mirar sin adornos.",
    };
  }

  // Patrón 3: El Buscador de Aprobación / Mártir (Busca validación o compasión)
  const martyrKeywords = [
    "siempre hago todo bien",
    "nadie me valora",
    "me sacrifico",
    "fui el único que",
    "nadie lo nota",
  ];
  if (martyrKeywords.some((keyword) => text.includes(keyword))) {
    return {
      type: "APPROVAL_SEEKING",
      response:
        "El ego intenta sobrevivir incluso vistiéndose de víctima o de héroe. ¿Qué necesidad de validación externa camufla este sacrificio?",
    };
  }

  // Patrón 4: Silencio / Respuesta demasiado corta o evasiva
  if (text.length < 15) {
    return {
      type: "SUPERFICIAL",
      response:
        "La brevedad es otra forma de huir del espejo. Nombra los hechos con precisión quirúrgica. ¿Qué es lo que verdaderamente temes mirar?",
    };
  }

  // Devolución por defecto (El Espejo Neutro e Implacable)
  return {
    type: "NEUTRAL_OBSERVATION",
    response:
      "El conocimiento sin observación es solo acumulación de ruido. Sostén esta verdad en silencio: ¿puedes aceptar este fragmento de tu sombra sin juzgarlo ni justificarlo?",
  };
}
