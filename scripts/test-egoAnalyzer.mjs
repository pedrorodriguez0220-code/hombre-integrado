import fs from "node:fs";
import { fileURLToPath } from "node:url";

const sourcePath = fileURLToPath(new URL("../src/utils/egoAnalyzer.js", import.meta.url));
const source = fs.readFileSync(sourcePath, "utf-8");
const dataUrl = "data:text/javascript;charset=utf-8," + encodeURIComponent(source);
const { analyzeUserResponse } = await import(dataUrl);

const cases = [
  {
    name: "Evasivo / Justificador (Poder Personal)",
    dimension: "El Poder Personal",
    question: "¿Qué excusa te mantiene esperando permiso?",
    input: "La culpa es de mi jefe porque me exige demasiado y el sistema laboral no me deja avanzar como merezco. Los demás no entienden mi situación y las circunstancias fueron imposibles de manejar.",
    tone: "JUSTIFICATION",
  },
  {
    name: "Evasivo / Justificador (Relaciones)",
    dimension: "Las Relaciones",
    question: "¿Qué relación mantenés por inercia?",
    input: "No pude terminar el proyecto por culpa de la empresa y de mis compañeros que no me apoyaron. Fue un contexto demasiado difícil y fuera de mi control.",
    tone: "JUSTIFICATION",
  },
  {
    name: "Intelectualizador (Dinero y Valor)",
    dimension: "El Dinero y el Valor",
    question: "¿Dónde confundís precio con valor?",
    input: "Analizando psicológicamente mi problema, puedo entenderlo desde un paradigma teórico que explica mi conducta mediante conceptos filosóficos y modelos mentales.",
    tone: "INTELLECTUALIZATION",
  },
  {
    name: "Mártir (Disciplina)",
    dimension: "La Disciplina",
    question: "¿Cuándo confundiste la rigidez con la fuerza de voluntad?",
    input: "Siempre yo hago todo y nadie valora mi sacrificio. Fui el único en cargar con todo el peso de la familia.",
    tone: "MARTYR",
  },
  {
    name: "Breve / Superficial (Silencio)",
    dimension: "El Silencio",
    question: "¿Qué pregunta evitás hacer en silencio?",
    input: "no sé",
    tone: "SUPERFICIAL",
  },
  {
    name: "Neutral profundo (Ruido)",
    dimension: "El Ruido",
    question: "¿Sos vos cuando nadie te está mirando?",
    input: "Cuando estoy solo siento que mi mente busca constantemente distracciones. Me doy cuenta de que uso el ruido para no sentir una soledad que aún no he aprendido a habitar.",
    tone: "NEUTRAL",
  },
  {
    name: "Evasivo (Cuerpo)",
    dimension: "El Cuerpo y el Arraigo",
    question: "¿Qué parte de tu cuerpo sostiene tensión?",
    input: "Mi familia me obligó a trabajar desde chico y por eso nunca pude cuidar mi cuerpo. El sistema me dejó sin opciones.",
    tone: "JUSTIFICATION",
  },
  {
    name: "Intelectualizador (Autoconsciencia)",
    dimension: "Autoconsciencia",
    question: "¿Qué máscara social usaste?",
    input: "Desde un punto de vista psicológico, mi conducta se explica por un modelo teórico de autoconcepto desarrollado en la infancia.",
    tone: "INTELLECTUALIZATION",
  },
];

function summarize() {
  const bar = "—".repeat(70);
  console.log(bar);
  console.log("MOTOR EGO ANALYZER — PRUEBAS AUTÓNOMAS POR DIMENSIÓN Y TONO");
  console.log(bar);

  let passed = 0;
  const dimensionCounts = {};
  const toneCounts = {};
  const responses = [];

  for (const test of cases) {
    const result = analyzeUserResponse(test.dimension, test.question, test.input);
    const typeParts = result.type.split(" — ");
    const dimensionPart = typeParts[0];
    const tonePart = typeParts[1] || "NEUTRAL";

    const expectedKey = test.dimension.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9\s]/g, "").replace(/\s+/g, " ").trim();
    const okDimension = dimensionPart === expectedKey;
    const okTone = tonePart === test.tone;
    const ok = okDimension && okTone;
    if (ok) passed++;

    dimensionCounts[result.type] = (dimensionCounts[result.type] || 0) + 1;
    toneCounts[tonePart] = (toneCounts[tonePart] || 0) + 1;
    responses.push(result.response);

    console.log(`\nCaso: ${test.name}`);
    console.log(`Dimensión: ${test.dimension}`);
    console.log(`Tipo esperado: ${test.tone}`);
    console.log(`Tipo obtenido: ${result.type}`);
    console.log(`Respuesta: ${result.response.slice(0, 120)}${result.response.length > 120 ? "..." : ""}`);
  }

  // Rotación: mismo input justificador en dos dimensiones 6 veces.
  console.log("\n" + bar);
  console.log("PRUEBA DE ROTACIÓN CONTEXTUAL");
  console.log(bar);
  const rotInput = "La culpa es del sistema y de los demás, porque nunca me entienden y las circunstancias fueron imposibles.";
  const rotDims = ["El Poder Personal", "Las Relaciones", "El Silencio"];
  let consecutiveRepeats = 0;
  let previous = null;
  for (let i = 0; i < 12; i++) {
    const dim = rotDims[i % rotDims.length];
    const res = analyzeUserResponse(dim, "pregunta", rotInput);
    if (res.response === previous) consecutiveRepeats++;
    previous = res.response;
    console.log(`  ${i + 1} [${dim}] ${res.type}: ${res.response.slice(0, 80)}...`);
  }

  console.log("\n" + bar);
  console.log(`RESUMEN: ${passed}/${cases.length} casos clasificaron dimensión y tono correctamente`);
  console.log("Tipos generados:", JSON.stringify(dimensionCounts, null, 2));
  console.log("Tonalidad:", JSON.stringify(toneCounts, null, 2));
  console.log("Repeticiones consecutivas en rotación:", consecutiveRepeats);
  console.log(bar);
}

summarize();
