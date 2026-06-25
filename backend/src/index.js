import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

const APP_ID = process.env.APP_ID;

app.use(express.json());
app.use(cors());

// Get all currencies
app.get("/getAllCurrencies", async (req, res) => {
    const nameURL = `https://openexchangerates.org/api/currencies.json?app_id=${APP_ID}`;

    try {
        const namesResponse = await axios.get(nameURL);
        const data = namesResponse.data;

        if (!data["LKR"]) {
            data["LKR"] = "Sri Lankan Rupee";
        }

        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch currencies" });
    }
});

// Convert currency
app.get("/convert", async (req, res) => {
    const {
        date,
        sourceCurrency,
        targetCurrency,
        amountInSourceCurrency
    } = req.query;

    if (
        !date ||
        !sourceCurrency ||
        !targetCurrency ||
        !amountInSourceCurrency
    ) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    try {
        const dataUrl = `https://openexchangerates.org/api/historical/${date}.json?app_id=${APP_ID}`;

        const dataResponse = await axios.get(dataUrl);

        const rates = dataResponse.data.rates;

        const sourceRate = rates[sourceCurrency];
        const targetRate = rates[targetCurrency];

        if (!sourceRate || !targetRate) {
            return res.status(400).json({
                error: "Invalid currency code(s)"
            });
        }

        const targetAmount =
            (targetRate / sourceRate) *
            Number(amountInSourceCurrency);

        return res.json(targetAmount);

    } catch (err) {
        return res.status(500).json({
            error: "Conversion failed"
        });
    }
});

export default app;