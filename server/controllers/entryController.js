const ExcelJS = require('exceljs');
const Entry = require('../models/Entry');

const getEntries = async (req, res, next) => {
  try {
    const { date, search, page = 1, limit = 50 } = req.query;
    const filter = { userId: req.userId };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.entryDate = { $gte: start, $lte: end };
    }

    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ text: re }, { where: re }, { what: re }];
    }

    const entries = await Entry.find(filter)
      .sort({ entryDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Entry.countDocuments(filter);
    res.json({ entries, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const getEntriesByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const entries = await Entry.find({
      userId: req.userId,
      entryDate: { $gte: start, $lte: end },
    }).sort({ entryDate: -1 });

    res.json(entries);
  } catch (err) {
    next(err);
  }
};

const createEntry = async (req, res, next) => {
  try {
    const { text, where, what, duration, entryDate, rawTranscript, customFields } = req.body;
    if (!entryDate) {
      return res.status(400).json({ message: 'entryDate is required' });
    }
    const entry = await Entry.create({
      userId: req.userId,
      text,
      where,
      what,
      duration,
      entryDate,
      rawTranscript,
      customFields,
    });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

const updateEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

const deleteEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    next(err);
  }
};

const exportEntries = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = { userId: req.userId };

    if (from || to) {
      filter.entryDate = {};
      if (from) filter.entryDate.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.entryDate.$lte = end;
      }
    }

    const entries = await Entry.find(filter).sort({ entryDate: -1 });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Entries');

    sheet.columns = [
      { header: 'Date', key: 'entryDate', width: 20 },
      { header: 'Where', key: 'where', width: 20 },
      { header: 'What', key: 'what', width: 30 },
      { header: 'Duration (min)', key: 'duration', width: 15 },
      { header: 'Text', key: 'text', width: 50 },
      { header: 'Reviewed', key: 'isReviewed', width: 12 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    sheet.getRow(1).font = { bold: true };

    entries.forEach((e) => {
      sheet.addRow({
        entryDate: e.entryDate.toISOString().split('T')[0],
        where: e.where,
        what: e.what,
        duration: e.duration,
        text: e.text,
        isReviewed: e.isReviewed ? 'Yes' : 'No',
        createdAt: e.createdAt.toISOString(),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=entries.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports = { getEntries, getEntriesByDate, createEntry, updateEntry, deleteEntry, exportEntries };
