const fs = require('fs').promises;
const path = require('path');

// In-memory storage
let strings = [];


const DATA_FILE = path.join(__dirname, '../data/strings.json');

/**
 * Load data from JSON file into memory
 */
const loadData = async () => {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    // Try to read existing data
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    strings = JSON.parse(fileContent);
    console.log(`Loaded ${strings.length} strings from file`);
  } catch (error) {

    // If file doesn't exist or is invalid, start with empty array

    if (error.code === 'ENOENT') {
      console.log('No existing data file found. Starting fresh.');
      strings = [];
      await saveData(); // Create the file
    } else {
      console.error('Error loading data:', error.message);
      strings = [];
    }
  }
};

/**
 * Save data from memory to JSON file
 */
const saveData = async () => {
  try {
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(strings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving data:', error.message);
  }
};

/**
 * Get all strings from memory
 */
const getAllStringsFromStore = () => {
  return strings;
};

/**
 * Find a string by its hash (id)
 */
const findStringById = (id) => {
  return strings.find(s => s.id === id);
};

/**
 * Find a string by its value
 */
const findStringByValue = (value) => {
  return strings.find(s => s.value === value);
};

/**
 * Add a new string to the store
 */
const addString = async (stringData) => {
  strings.push(stringData);
  await saveData();
  return stringData;
};

/**
 * Delete a string by its id
 */
const deleteStringById = async (id) => {
  const index = strings.findIndex(s => s.id === id);
  if (index === -1) {
    return null;
  }
  const deleted = strings.splice(index, 1)[0];
  await saveData();
  return deleted;
};

/**
 * Filter strings based on criteria
 */
const filterStrings = (filters) => {
  return strings.filter(str => {
    // Check is_palindrome filter
    if (filters.is_palindrome !== undefined) {
      if (str.properties.is_palindrome !== filters.is_palindrome) {
        return false;
      }
    }

    // Check min_length filter
    if (filters.min_length !== undefined) {
      if (str.properties.length < filters.min_length) {
        return false;
      }
    }

    // Check max_length filter
    if (filters.max_length !== undefined) {
      if (str.properties.length > filters.max_length) {
        return false;
      }
    }

    // Check word_count filter
    if (filters.word_count !== undefined) {
      if (str.properties.word_count !== filters.word_count) {
        return false;
      }
    }

    // Check contains_character filter
    if (filters.contains_character !== undefined) {
      if (!str.value.toLowerCase().includes(filters.contains_character.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Get count of strings in store
 */
const getCount = () => {
  return strings.length;
};

module.exports = {
  loadData,
  saveData,
  getAllStringsFromStore,
  findStringById,
  findStringByValue,
  addString,
  deleteStringById,
  filterStrings,
  getCount
};