const { calculateScoreAndPriority } = require('../src/services/priorityCalculator.service');
const { SOURCES, PRIORITIES } = require('../src/constants/enums');

describe('Pruebas Automatizadas: Cálculo de Puntaje y Prioridad', () => {

  test('Caso 1: Candidato con máxima puntuación obtiene prioridad TOP (>= 7 pts)', () => {
    const result = calculateScoreAndPriority({
      candidateExp: 5,
      vacancyMinExp: 2,          // +4 (Experiencia suficiente)
      source: SOURCES.REFERRAL,   // +3 (Referido)
      coverLetter: 'I have experience in Node.js and SQL', // +2 (Palabras clave "node" / "sql")
      activeApplicationsCount: 0  // 0 penalizaciones
    });

    // Total: 4 + 3 + 2 = 9 puntos -> TOP
    expect(result.score).toBe(9);
    expect(result.priority).toBe(PRIORITIES.TOP);
  });

  test('Caso 2: Búsqueda case-insensitive de palabras clave y suma única', () => {
    const result = calculateScoreAndPriority({
      candidateExp: 1,
      vacancyMinExp: 3,           // +0 (Experiencia insuficiente)
      source: SOURCES.INTERNAL,   // +2 (Interno)
      coverLetter: 'Experto en NODE, SQL y API en proyectos pasados', // +2 (Varias palabras clave, suma solo una vez)
      activeApplicationsCount: 0
    });

    // Total: 2 + 2 = 4 puntos -> MEDIUM
    expect(result.score).toBe(4);
    expect(result.priority).toBe(PRIORITIES.MEDIUM);
  });

  test('Caso 3: Penalización por postulaciones activas y limite inferior a cero', () => {
    const result = calculateScoreAndPriority({
      candidateExp: 1,
      vacancyMinExp: 3,           // +0
      source: SOURCES.OTHER,      // +0
      coverLetter: 'Hola',        // +0
      activeApplicationsCount: 4  // -2 (Penalización por >=3 activas)
    });

    // Puntuación teórica = -2. Debe ajustarse a 0 -> LOW
    expect(result.score).toBe(0);
    expect(result.priority).toBe(PRIORITIES.LOW);
  });

});