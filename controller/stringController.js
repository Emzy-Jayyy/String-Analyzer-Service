const {
    findStringById,
    findStringByValue,
    addString,
    deleteStringById,
    filterStrings,
    getAllStringsFromStore
} = require('../config/dataStore');

const { analyzeString, generateSHA256 } = require('../services/stringAnalyzer');

module.exports.createString = async (req, res, next) => {
    try {
        const { value } = req.body;

        if (value === undefined || value === null) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Missing "value" field in request body'
            })
        }

        if (typeof value !== 'string') {
            return res.status(422).json({
                error: 'Unprocessable Entity',
                message: 'Invalid data type for "value" (must be string)'
            })
        }


        // Check if string already exists
        const existingString = findStringByValue(value);

        if (existingString) {
            return res.status(409).json({
                error: 'Conflict',
                message: 'String already exists in the system'
            });
        }

        // Analyze the string
        const properties = analyzeString(value);
        const sha256_hash = properties.sha256_hash;

        // Create string object
        const stringData = {
            id: sha256_hash,
            value: value,
            properties: properties,
            created_at: new Date().toISOString()
        };

        // Add to store
        await addString(stringData);

        // Return the created string
        res.status(201).json(stringData);

    } catch (error) {
        next(error);
    }
};

module.exports.getAllStrings = async (req, res, next) => {
    try {
        const {
            is_palindrome,
            min_length,
            max_length,
            word_count,
            contains_character
        } = req.query;

        // Build filters object
        const filters = {};
        const filters_applied = {};

        // Palindrome filter
        if (is_palindrome !== undefined) {
            const isPalindromeValue = is_palindrome === 'true';
            filters.is_palindrome = isPalindromeValue;
            filters_applied.is_palindrome = isPalindromeValue;
        }

        // Length filters
        if (min_length !== undefined) {
            const minLengthValue = parseInt(min_length);
            if (isNaN(minLengthValue)) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Invalid value for min_length parameter'
                });
            }
            filters.min_length = minLengthValue;
            filters_applied.min_length = minLengthValue;
        }

        if (max_length !== undefined) {
            const maxLengthValue = parseInt(max_length);
            if (isNaN(maxLengthValue)) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Invalid value for max_length parameter'
                });
            }
            filters.max_length = maxLengthValue;
            filters_applied.max_length = maxLengthValue;
        }

        // Word count filter
        if (word_count !== undefined) {
            const wordCountValue = parseInt(word_count);
            if (isNaN(wordCountValue)) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Invalid value for word_count parameter'
                });
            }
            filters.word_count = wordCountValue;
            filters_applied.word_count = wordCountValue;
        }

        // Contains character filter
        if (contains_character !== undefined) {
            if (typeof contains_character !== 'string' || contains_character.length !== 1) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'contains_character must be a single character'
                });
            }
            filters.contains_character = contains_character;
            filters_applied.contains_character = contains_character;
        }

        // Get filtered strings
        const strings = filterStrings(filters);

        // Sort by created_at (newest first)
        strings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.status(200).json({
            data: strings,
            count: strings.length,
            filters_applied: filters_applied
        });
    } catch (error) {
        next(error)
    }
};

module.exports.getString = async (req, res, next) => {
    try {
        const { string_value } = req.params;

        const stringData = findStringByValue(string_value);

        if (!stringData) {
            return res.status(400).json({
                error: 'Not Found',
                message: 'String does not exist'
            });
        }

        res.status(200).json(stringData)
    } catch (error) {
        next(error);
    }
}

module.exports.deleteString = async (req, res, next) => {
    try {
        const { string_value } = req.params;

        const stringData = findStringByValue(string_value);

        if (!stringData) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'String does not exist'
            });
        }

        const deletedString = await deleteStringById(stringData.id);

        res.status(204).send();
    } catch (error) {
        next(error)
    }
}

