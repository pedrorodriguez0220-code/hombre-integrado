import fs from "node:fs";
import { fileURLToPath } from "node:url";

const sourcePath = fileURLToPath(new URL("../src/utils/egoAnalyzer.js", import.meta.url));
const source = fs.readFileSync(sourcePath, "utf-8");
const dataUrl = "data:text/javascript;charset=utf-8," + encodeURIComponent(source);
const { analyzeUserResponse } = await import(dataUrl);

const profiles = {
  evasivo: {
    inputs: [
      "La culpa es de mi jefe porque me exige demasiado y el sistema laboral no me deja avanzar como merezco. Los demás no entienden mi situación y las circunstancias fueron imposibles de manejar.",
      "No pude terminar el proyecto por culpa de la empresa y de mis compañeros que no me apoyaron. Fue un contexto demasiado difícil y fuera de mi control.",
      "El gobierno, la sociedad y mi familia me obligaron a tomar este camino. No tuve opción, no tenía opción.",
      "Siempre me pasa lo mismo porque nadie me entiende y el mundo está en contra mía. No dependía de mí.",
      "La suerte, el destino y las circunstancias hicieron que fracasara. No pude evitarlo, era inevitable.",
    ],
    expected: "JUSTIFICATION",
  },
  intelectualizador: {
    inputs: [
      "Analizando psicológicamente mi problema, puedo entenderlo desde un paradigma teórico que explica mi conducta mediante conceptos filosóficos y modelos mentales.",
      "Desde una óptica conceptual, mi mente procesa el trauma a través de un razonamiento intelectual y un análisis sicológico que me permite teorizar sin sentir.",
      "La literatura dice que el ego se manifiesta así; por eso intelectualmente comprendo que estoy defendiéndome con abstracciones y un framework psicológico.",
      "Filosóficamente, estoy construyendo una teoría sobre mi dolor para no tocarlo con el cuerpo.",
      "Mi intelecto analiza y categoriza todo en términos de conceptos mentales, evitando la experiencia directa.",
    ],
    expected: "INTELLECTUALIZATION",
  },
  breve: {
    inputs: [
      "no sé",
      "estoy bien",
      "todo mal",
      "sí",
      "no importa",
      "quizás",
      "mi culpa",
      "el sistema",
      "sistema me obligaron",
      "solo yo",
    ],
    expected: null,
  },
};

function summarize() {
  const bar = "—".repeat(60);
  console.log(bar);
  console.log("MOTOR EGO ANALYZER — PRUEBAS AUTÓNOMAS");
  console.log(bar);

  let totalPassed = 0;
  let totalTests = 0;

  for (const [profile, { inputs, expected }] of Object.entries(profiles)) {
    console.log(`\nPerfil: ${profile.toUpperCase()}`);
    console.log("Inputs probados:", inputs.length);

    const typeCounts = {};
    let passed = 0;

    inputs.forEach((input, i) => {
      const result = analyzeUserResponse(input);
      typeCounts[result.type] = (typeCounts[result.type] || 0) + 1;
      const ok = expected ? result.type === expected : true;
      if (ok) passed++;
      totalTests++;
      if (ok) totalPassed++;
      console.log(`  ${i + 1}. [${result.type}] ${input.slice(0, 70)}${input.length > 70 ? "..." : ""}`);
      console.log(`     → ${result.response.slice(0, 90)}...`);
    });

    console.log(`  Distribución de tipos: ${JSON.stringify(typeCounts)}`);
    if (expected) {
      console.log(`  Aciertos esperados (${expected}): ${passed}/${inputs.length}`);
    }
  }

  // Prueba de rotación: mismo texto evasivo 10 veces.
  console.log("\n" + bar);
  console.log("PRUEBA DE ROTACIÓN DE RESPUESTAS");
  console.log(bar);
  const sample = profiles.evasivo.inputs[0];
  const seenSequence = [];
  let consecutiveRepeats = 0;
  let previous = null;
  for (let i = 0; i < 12; i++) {
    const result = analyzeUserResponse(sample);
    if (result.response === previous) consecutiveRepeats++;
    previous = result.response;
    seenSequence.push(result.response.slice(0, 40));
  }
  console.log("Repeticiones consecutivas en 12 iteraciones:", consecutiveRepeats);
  console.log("Secuencia de inicios de respuesta:\n" + seenSequence.map((s, i) => `  ${i + 1}. ${s}`).join("\n"));

  console.log("\n" + bar);
  console.log(`RESUMEN GLOBAL: ${totalPassed}/${totalTests} coincidencias de tipo esperadas`);
  console.log(bar);
}

summarize();
