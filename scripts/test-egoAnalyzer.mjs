import fs from "node:fs";
import { fileURLToPath } from "node:url";

const sourcePath = fileURLToPath(new URL("../src/utils/egoAnalyzer.js", import.meta.url));
const source = fs.readFileSync(sourcePath, "utf-8");
const dataUrl = "data:text/javascript;charset=utf-8," + encodeURIComponent(source);
const { analyzeUserResponse } = await import(dataUrl);

const dimensions = [
  "El Ruido",
  "Autoconsciencia",
  "El Cuerpo y el Arraigo",
  "La Sombra",
  "Las Relaciones",
  "El Poder Personal",
  "El Dinero y el Valor",
  "El Silencio",
  "La Disciplina",
  "El Liderazgo",
  "Las Expectativas",
  "La Integración Final",
];

function normalizeKey(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const profileTests = [
  {
    name: "Ejecutivo Acelerado (Evasivo)",
    dimension: "El Ruido",
    inputs: [
      "El sistema laboral moderno y las notificaciones constantes me impiden tener paz. Es culpa de los tiempos acelerados y de la tecnología.",
      "Mi jefe, la empresa y las circunstancias me obligan a vivir así. No depende de mí, es el mundo que anda demasiado rápido.",
      "Los demás no entienden la presión del sistema. Nadie puede sobrevivir a este ritmo sin perderse.",
    ],
    expectedTone: "JUSTIFICATION",
    expectedDimension: "EL RUIDO",
  },
  {
    name: "El Intelectual (Teórico)",
    dimension: "Autoconsciencia",
    inputs: [
      "Analizando psicológicamente mi problema, puedo entenderlo desde un paradigma teórico que explica mi conducta mediante conceptos filosóficos y modelos mentales.",
      "Desde una óptica conceptual, mi mente procesa el trauma a través de un razonamiento intelectual y un análisis sicológico que me permite teorizar sin sentir.",
      "Filosóficamente, estoy construyendo una teoría sobre mi dolor para no tocarlo con el cuerpo.",
    ],
    expectedTone: "INTELLECTUALIZATION",
    expectedDimension: "AUTOCONSCIENCIA",
  },
  {
    name: "Superficial / Apurado",
    dimension: "El Silencio",
    inputs: [
      "no sé",
      "estoy bien",
      "todo mal",
      "sí",
      "no importa",
    ],
    expectedTone: "SUPERFICIAL",
    expectedDimension: "EL SILENCIO",
  },
];

function summarize() {
  const bar = "=".repeat(70);
  console.log(bar);
  console.log("MOTOR EGO ANALYZER — PRUEBAS AUTÓNOMAS POR DIMENSIÓN Y TONO");
  console.log(bar);

  let passed = 0;
  let total = 0;

  for (const profile of profileTests) {
    console.log(`\n--- Perfil: ${profile.name} ---`);
    for (const input of profile.inputs) {
      const result = analyzeUserResponse(profile.dimension, "pregunta", input);
      const [dimPart, tonePart = "NEUTRAL"] = result.type.split(" — ");
      const dimOk = dimPart === profile.expectedDimension;
      const toneOk = tonePart === profile.expectedTone;
      const ok = dimOk && toneOk;
      total++;
      if (ok) passed++;
      console.log(`${ok ? "OK" : "FAIL"} [${result.type}] ${input.slice(0, 70)}...`);
      console.log(`   → ${result.response.slice(0, 120)}...`);
    }
  }

  // Cobertura de dimensiones: asegurar que cada dimensión tenga al menos 10 variantes y responda distintivamente.
  console.log("\n" + bar);
  console.log("COBERTURA DE VARIANTES POR DIMENSIÓN");
  console.log(bar);
  let variantFailures = 0;
  for (const dim of dimensions) {
    const responses = new Set();
    for (let i = 0; i < 15; i++) {
      const result = analyzeUserResponse(dim, "pregunta", "Mi respuesta con palabras suficientes para evitar el superficial y permitir que la dimensión hable por sí sola.");
      responses.add(result.response);
    }
    const dimKey = normalizeKey(dim);
    const hasTone = Array.from(responses).some((r) => /^(?:En |El |La |Un |No )/.test(r));
    console.log(`${dim}: ${responses.size} respuestas únicas en 15 intentos`);
    if (responses.size < 5) {
      variantFailures++;
      console.log(`   ADVERTENCIA: menos de 5 variantes en ${dim}`);
    }
  }

  // Prueba de rotación: verificar ausencia de repeticiones consecutivas.
  console.log("\n" + bar);
  console.log("PRUEBA DE ROTACIÓN");
  console.log(bar);
  let consecutiveRepeats = 0;
  let previous = null;
  const sequence = [];
  for (let i = 0; i < 30; i++) {
    const dim = dimensions[i % dimensions.length];
    const result = analyzeUserResponse(dim, "pregunta", "Me siento atrapado porque el sistema, los demás y las circunstancias me obligan sin darme opción. Nadie me entiende.");
    if (result.response === previous) consecutiveRepeats++;
    previous = result.response;
    sequence.push(result.response.slice(0, 70));
  }
  console.log("Repeticiones consecutivas en 30 iteraciones:", consecutiveRepeats);
  console.log("Primeras 10 respuestas:");
  sequence.slice(0, 10).forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

  console.log("\n" + bar);
  console.log(`RESUMEN: ${passed}/${total} perfiles clasificados correctamente`);
  console.log(`Dimensiones con variantes insuficientes: ${variantFailures}`);
  console.log(`Repeticiones consecutivas: ${consecutiveRepeats}`);
  if (passed === total && variantFailures === 0 && consecutiveRepeats === 0) {
    console.log("ESTADO: OK");
  } else {
    console.log("ESTADO: REVISAR");
    process.exitCode = 1;
  }
  console.log(bar);
}

summarize();
