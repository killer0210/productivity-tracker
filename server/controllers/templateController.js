const Template = require('../models/Template');

const getTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    next(err);
  }
};

const createTemplate = async (req, res, next) => {
  try {
    const { name, fields } = req.body;
    if (!name) return res.status(400).json({ message: 'Template name is required' });
    const template = await Template.create({ userId: req.userId, name, fields: fields || [] });
    res.status(201).json(template);
  } catch (err) {
    next(err);
  }
};

const deleteTemplate = async (req, res, next) => {
  try {
    const template = await Template.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTemplates, createTemplate, deleteTemplate };
