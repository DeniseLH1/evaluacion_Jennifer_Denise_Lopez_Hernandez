const CustomError = require('../utils/CustomError');
const { SOURCES, APPLICATION_STATUS } = require('../constants/enums');

/**
 * Middleware para validar el cuerpo al crear una postulación (POST /applications)
 */
function validateCreateApplication(req, res, next) {
  const { candidateId, vacancyId, source, coverLetter } = req.body;

  if (candidateId === undefined || vacancyId === undefined || !source || !coverLetter) {
    return next(new CustomError('Campos obligatorios requeridos: candidateId, vacancyId, source, coverLetter', 400));
  }

  if (typeof candidateId !== 'number' || candidateId <= 0) {
    return next(new CustomError('candidateId debe ser un número entero positivo', 400));
  }

  if (typeof vacancyId !== 'number' || vacancyId <= 0) {
    return next(new CustomError('vacancyId debe ser un número entero positivo', 400));
  }

  if (!Object.values(SOURCES).includes(source)) {
    return next(new CustomError(`Fuente no permitida. Valores aceptados: ${Object.values(SOURCES).join(', ')}`, 400));
  }

  if (typeof coverLetter !== 'string' || coverLetter.trim().length === 0) {
    return next(new CustomError('La carta de presentación (coverLetter) no puede estar vacía', 400));
  }

  next();
}

/**
 * Middleware para validar la actualización de estado (PUT /applications/:id/status)
 */
function validateUpdateStatus(req, res, next) {
  const { status } = req.body;

  if (!status) {
    return next(new CustomError('El campo status es obligatorio', 400));
  }

  if (!Object.values(APPLICATION_STATUS).includes(status)) {
    return next(new CustomError(`Estado no permitido. Valores aceptados: ${Object.values(APPLICATION_STATUS).join(', ')}`, 400));
  }

  next();
}

module.exports = {
  validateCreateApplication,
  validateUpdateStatus
};