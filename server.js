const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const stringRoutes = require('./routes/stringRoutes');
const { loadData } = require('./config/dataStore');
const { analyzeString } = require('./services/stringAnalyzer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const initDB = async () => {
    await loadData();
}

initDB();


app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res, next) => {
    res.status(200).json({
        status: "Success",
        message: "Welcome to the String Analyzer Service"
    });
});

app.use('/strings', stringRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // console.log(analyzeString('String to analyze'))
})