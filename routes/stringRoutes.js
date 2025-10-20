const express = require('express');
const {createString, deleteString,getAllStrings,getString} = require('../controller/stringController')

const router = express.Router();

router.post('/', createString)
router.get('/', getAllStrings)
router.get('/:string_value', getString)
router.delete('/:string_value', deleteString)

module.exports = router;