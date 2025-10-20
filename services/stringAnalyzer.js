const { generateSHA256 } = require('../utils/hashGenerator')

const isPalindrome = (str) => {
    const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const reversed = cleaned.split('').reverse().join('');
    return cleaned === reversed;
};

const countUniqueCharacters = (str) => {
    const uniqueChars = new Set(str);
    return uniqueChars.size;
};

const countWords = (str) => {
    const words = str.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
};

const characterFrequencyMap = (str) => {
    const frequencyMap = {}

    for (const char of str) {
        frequencyMap[char] = (frequencyMap[char] || 0) + 1
    }

    return frequencyMap;
};

const analyzeString = (value) => {
    const sha256Hash = generateSHA256(value);
    const palindrome = isPalindrome(value);
    const uniqueCharacterCount = countUniqueCharacters(value);
    const wordCount = countWords(value);
    const charFrequency = characterFrequencyMap(value);

    return {
        length: value.length,
        is_palindrome: palindrome,
        unique_characters: uniqueCharacterCount,
        word_count: wordCount,
        sha256_hash: sha256Hash,
        character_frequency_map: charFrequency,
    }
}

module.exports = {
    analyzeString,
    isPalindrome,
    countUniqueCharacters,
    countWords,
    characterFrequencyMap,
    generateSHA256
}