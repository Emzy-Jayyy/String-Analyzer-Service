/**
 * Natural Language Query Parser
 * Parses natural language queries into structured filters
 */

/**
 * Parse a natural language query into filters
 * @param {string} query - Natural language query
 * @returns {Object} - Parsed filters object
 */
const parseNaturalLanguageQuery = (query) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Query must be a non-empty string');
  }

  const lowerQuery = query.toLowerCase().trim();
  const filters = {};

  // Check for palindrome keywords
  if (
    lowerQuery.includes('palindrome') ||
    lowerQuery.includes('palindromic') ||
    lowerQuery.includes('reads the same') ||
    lowerQuery.includes('same forwards and backwards')
  ) {
    filters.is_palindrome = true;
  }

  // Check for non-palindrome keywords
  if (
    lowerQuery.includes('not palindrome') ||
    lowerQuery.includes('non-palindrome') ||
    lowerQuery.includes('non palindrome')
  ) {
    filters.is_palindrome = false;
  }

  // Parse word count
  const wordCountPatterns = [
    /single word/i,
    /one word/i,
    /(\d+)\s*word/i,
    /word count (?:of |is )?(\d+)/i,
    /exactly (\d+) word/i
  ];

  for (const pattern of wordCountPatterns) {
    const match = query.match(pattern);
    if (match) {
      if (pattern.source.includes('single') || pattern.source.includes('one')) {
        filters.word_count = 1;
      } else if (match[1]) {
        filters.word_count = parseInt(match[1]);
      }
      break;
    }
  }

  // Parse length requirements
  const lengthPatterns = [
    { pattern: /longer than (\d+)/i, type: 'min', offset: 1 },
    { pattern: /more than (\d+) character/i, type: 'min', offset: 1 },
    { pattern: /at least (\d+) character/i, type: 'min', offset: 0 },
    { pattern: /minimum (?:of )?(\d+) character/i, type: 'min', offset: 0 },
    { pattern: /min(?:imum)? length (?:of )?(\d+)/i, type: 'min', offset: 0 },
    { pattern: /shorter than (\d+)/i, type: 'max', offset: -1 },
    { pattern: /less than (\d+) character/i, type: 'max', offset: -1 },
    { pattern: /at most (\d+) character/i, type: 'max', offset: 0 },
    { pattern: /maximum (?:of )?(\d+) character/i, type: 'max', offset: 0 },
    { pattern: /max(?:imum)? length (?:of )?(\d+)/i, type: 'max', offset: 0 },
    { pattern: /length (?:of )?(\d+)/i, type: 'exact', offset: 0 }
  ];

  for (const { pattern, type, offset } of lengthPatterns) {
    const match = query.match(pattern);
    if (match) {
      const length = parseInt(match[1]) + offset;
      if (type === 'min') {
        filters.min_length = length;
      } else if (type === 'max') {
        filters.max_length = length;
      } else if (type === 'exact') {
        filters.min_length = length;
        filters.max_length = length;
      }
      break;
    }
  }

  // Parse character containment
  const characterPatterns = [
    /contain(?:ing|s)?\s+(?:the\s+)?(?:letter|character)\s+([a-z])/i,
    /with\s+(?:the\s+)?(?:letter|character)\s+([a-z])/i,
    /has\s+(?:the\s+)?(?:letter|character)\s+([a-z])/i,
    /include(?:s)?\s+(?:the\s+)?(?:letter|character)\s+([a-z])/i
  ];

  for (const pattern of characterPatterns) {
    const match = query.match(pattern);
    if (match) {
      filters.contains_character = match[1].toLowerCase();
      break;
    }
  }

  // Special handling for vowels
  if (
    lowerQuery.includes('first vowel') ||
    lowerQuery.includes('vowel a') ||
    lowerQuery.match(/contain(?:s)?\s+a\b/)
  ) {
    filters.contains_character = 'a';
  } else if (lowerQuery.includes('vowel')) {
    // Default to 'a' for generic vowel mentions
    const vowelMatch = lowerQuery.match(/vowel\s+([aeiou])/i);
    if (vowelMatch) {
      filters.contains_character = vowelMatch[1].toLowerCase();
    }
  }

  // Parse specific letter mentions (e.g., "letter z")
  const specificLetterMatch = query.match(/letter\s+([a-z])\b/i);
  if (specificLetterMatch && !filters.contains_character) {
    filters.contains_character = specificLetterMatch[1].toLowerCase();
  }

  return filters;
};

/**
 * Validate that parsed filters don't conflict
 * @param {Object} filters - Parsed filters
 * @throws {Error} - If filters are conflicting
 */
const validateFilters = (filters) => {
  // Check for conflicting length requirements
  if (
    filters.min_length !== undefined &&
    filters.max_length !== undefined &&
    filters.min_length > filters.max_length
  ) {
    throw new Error('Conflicting filters: min_length cannot be greater than max_length');
  }

  // Check for negative values
  if (filters.min_length !== undefined && filters.min_length < 0) {
    throw new Error('Invalid filter: min_length cannot be negative');
  }

  if (filters.max_length !== undefined && filters.max_length < 0) {
    throw new Error('Invalid filter: max_length cannot be negative');
  }

  if (filters.word_count !== undefined && filters.word_count < 0) {
    throw new Error('Invalid filter: word_count cannot be negative');
  }

  // Check for invalid character
  if (filters.contains_character !== undefined) {
    if (
      typeof filters.contains_character !== 'string' ||
      filters.contains_character.length !== 1 ||
      !/[a-z]/i.test(filters.contains_character)
    ) {
      throw new Error('Invalid filter: contains_character must be a single letter');
    }
  }

  return true;
};

/**
 * Main function to parse and validate natural language query
 * @param {string} query - Natural language query
 * @returns {Object} - Object with parsed_filters
 */
const interpretNaturalLanguage = (query) => {
  try {
    const parsed_filters = parseNaturalLanguageQuery(query);
    
    // Validate filters
    validateFilters(parsed_filters);

    // Check if any filters were parsed
    if (Object.keys(parsed_filters).length === 0) {
      throw new Error('Unable to parse natural language query - no recognizable filters found');
    }

    return {
      original: query,
      parsed_filters: parsed_filters
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  interpretNaturalLanguage,
  parseNaturalLanguageQuery,
  validateFilters
};