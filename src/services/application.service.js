const ApplicationRepository = require('../repositories/application.repository');
const CandidateRepository = require('../repositories/candidate.repository');
const VacancyRepository = require('../repositories/vacancy.repository');
const { calculateScoreAndPriority } = require('./priorityCalculator.service');
const { SOURCES, APPLICATION_STATUS, VACANCY_STATUS } = require('../constants/enums');
const CustomError = require('../utils/CustomError');

class ApplicationService {
  static async createApplication({ candidateId, vacancyId, source, coverLetter }) {
    // 1. Validaciones de negocio y datos obligatorios
    if (!candidateId || !vacancyId || !source || !coverLetter) {
      throw new CustomError('Todos los campos son obligatorios', 400);
    }

    if (!Object.values(SOURCES).includes(source)) {
      throw new CustomError('Fuente de postulación no válida', 400);
    }

    // 2. Verificar existencia de Candidato
    const candidate = await CandidateRepository.findById(candidateId);
    if (!candidate) {
      throw new CustomError('El candidato especificado no existe', 404);
    }

    // 3. Verificar existencia y estado de la Vacante
    const vacancy = await VacancyRepository.findById(vacancyId);
    if (!vacancy) {
      throw new CustomError('La vacante especificada no existe', 404);
    }
    if (vacancy.status !== VACANCY_STATUS.OPEN) {
      throw new CustomError('No se pueden recibir postulaciones en vacantes cerradas', 400);
    }

    // 4. Regla de Duplicidad
    const lastApplication = await ApplicationRepository.findLastByCandidateAndVacancy(candidateId, vacancyId);
    if (lastApplication) {
      if (['RECEIVED', 'IN_REVIEW', 'HIRED'].includes(lastApplication.status)) {
        throw new CustomError('Ya existe una postulación activa o contratada para esta vacante', 409);
      }
      if (lastApplication.status === APPLICATION_STATUS.REJECTED) {
        const rejectedDate = new Date(lastApplication.status_updated_at);
        const currentDate = new Date();
        const diffDays = (currentDate - rejectedDate) / (1000 * 60 * 60 * 24);
        if (diffDays < 30) {
          throw new CustomError('Debe esperar al menos 30 días tras un rechazo para volver a postularse', 409);
        }
      }
    }

    // 5. Contar postulaciones activas en otras vacantes
    const activeAppsCount = await ApplicationRepository.countActiveByCandidateExceptVacancy(candidateId, vacancyId);

    // 6. Calcular puntaje y prioridad
    const { score, priority } = calculateScoreAndPriority({
      candidateExp: candidate.years_of_experience,
      vacancyMinExp: vacancy.min_years_experience,
      source,
      coverLetter,
      activeApplicationsCount: activeAppsCount
    });

    // 7. Guardar en Base de Datos
    const applicationId = await ApplicationRepository.create({
      candidateId,
      vacancyId,
      source,
      coverLetter,
      score,
      priority
    });

    const newApp = await ApplicationRepository.findById(applicationId);
    return newApp;
  }

  static async getApplications({ status, vacancyId }) {
    if (status && !Object.values(APPLICATION_STATUS).includes(status)) {
      throw new CustomError('Filtro de estado no válido', 400);
    }
    return await ApplicationRepository.findAllFiltered({ status, vacancyId });
  }

  static async updateApplicationStatus(id, newStatus) {
    if (!Object.values(APPLICATION_STATUS).includes(newStatus)) {
      throw new CustomError('Estado de postulación no válido', 400);
    }

    const application = await ApplicationRepository.findById(id);
    if (!application) {
      throw new CustomError('Postulación no encontrada', 404);
    }

    if ([APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.HIRED].includes(application.status)) {
      throw new CustomError('No se puede modificar el estado de una postulación finalizada (REJECTED o HIRED)', 400);
    }

    await ApplicationRepository.updateStatus(id, newStatus);
    return await ApplicationRepository.findById(id);
  }
}

module.exports = ApplicationService;