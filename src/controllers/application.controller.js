const ApplicationService = require('../services/application.service');

class ApplicationController {
  static async create(req, res, next) {
    try {
      const application = await ApplicationService.createApplication(req.body);
      return res.status(201).json({
        message: 'Postulación registrada exitosamente',
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { status, vacancyId } = req.query;
      const applications = await ApplicationService.getApplications({ status, vacancyId });
      return res.status(200).json({ data: applications });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedApp = await ApplicationService.updateApplicationStatus(id, status);
      return res.status(200).json({
        message: 'Estado de postulación actualizado',
        data: updatedApp
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ApplicationController;