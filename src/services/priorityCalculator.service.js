const { SOURCES, PRIORITIES } = require('../constants/enums');

/**
 * Calcula puntaje y nivel de prioridad de postulación según reglas de negocio.
 */
function calculateScoreAndPriority({ candidateExp, vacancyMinExp, source, coverLetter, activeApplicationsCount }) {
  let score = 0;

  // 1. Experiencia laboral suficiente
  if (candidateExp >= vacancyMinExp) {
    score += 4;
  }

  // 2. Fuente de postulación
  if (source === SOURCES.REFERRAL) {
    score += 3;
  } else if (source === SOURCES.INTERNAL) {
    score += 2;
  }

  // 3. Palabras clave en carta de presentación (case-insensitive, suma una sola vez)
  const regexKeywords = /\b(node|sql|api)\b/i;
  if (coverLetter && regexKeywords.test(coverLetter)) {
    score += 2;
  }

  // 4. Longitud de carta de presentación
  if (coverLetter && coverLetter.length > 500) {
    score += 1;
  }

  // 5. Penalización por postulaciones activas en otras vacantes
  if (activeApplicationsCount >= 3) {
    score -= 2;
  }

  // Asegurar que el puntaje no sea negativo
  score = Math.max(0, score);

  // Mapeo de puntaje a Prioridad
  let priority = PRIORITIES.LOW;
  if (score >= 7) {
    priority = PRIORITIES.TOP;
  } else if (score >= 5) {
    priority = PRIORITIES.HIGH;
  } else if (score >= 3) {
    priority = PRIORITIES.MEDIUM;
  }

  return { score, priority };
}

module.exports = { calculateScoreAndPriority };