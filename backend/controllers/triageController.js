const { runTriage } = require("../services/triageService");

async function evaluateSymptoms(req, res) {
    try {
        const { symptoms, vitals } = req.body;

        if (!symptoms) {
            return res.status(400).json({
                message: "Symptoms are required"
            });
        }

        const triageResult = runTriage({
            symptoms,
            vitals
        });

        res.json({
            message: "Triage completed successfully",
            triage: triageResult
        });
    } catch (error) {
        res.status(500).json({
            message: "Triage failed",
            error: error.message
        });
    }
}

module.exports = {
    evaluateSymptoms
};
