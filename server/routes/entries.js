const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getEntries,
  getEntriesByDate,
  createEntry,
  updateEntry,
  deleteEntry,
  exportEntries,
} = require('../controllers/entryController');

router.use(auth);

// specific routes before parameterized ones
router.get('/export', exportEntries);
router.get('/date/:date', getEntriesByDate);

router.get('/', getEntries);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;
