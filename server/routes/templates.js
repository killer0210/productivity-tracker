const router = require('express').Router();
const auth = require('../middleware/auth');
const { getTemplates, createTemplate, deleteTemplate } = require('../controllers/templateController');

router.use(auth);
router.get('/', getTemplates);
router.post('/', createTemplate);
router.delete('/:id', deleteTemplate);

module.exports = router;
