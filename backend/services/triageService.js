function normalizeSymptoms(symptoms = "") {
    return symptoms.toLowerCase().trim();
}

function calculateUrgency(symptoms = "", vitals = {}) {
    const text = normalizeSymptoms(symptoms);
    let score = 0;
    const reasons = [];

    if (
        text.includes("chest pain") ||
        text.includes("heart attack") ||
        text.includes("severe breathing")
    ) {
        score += 90;
        reasons.push("Possible cardiac or breathing emergency");
    }

    if (
        text.includes("unconscious") ||
        text.includes("seizure") ||
        text.includes("stroke") ||
        text.includes("heavy bleeding")
    ) {
        score += 100;
        reasons.push("Critical emergency symptom detected");
    }

    if (
        text.includes("high fever") ||
        text.includes("severe pain") ||
        text.includes("accident")
    ) {
        score += 60;
        reasons.push("High urgency symptom detected");
    }

    if (text.includes("rash") || text.includes("skin infection")) {
        score += 25;
        reasons.push("Dermatology related symptom");
    }

    if (text.includes("fracture") || text.includes("bone") || text.includes("joint pain")) {
        score += 35;
        reasons.push("Orthopedic symptom detected");
    }

    if (vitals.temperature && Number(vitals.temperature) >= 103) {
        score += 40;
        reasons.push("Very high temperature");
    }

    if (vitals.pulse && Number(vitals.pulse) > 120) {
        score += 30;
        reasons.push("High pulse rate");
    }

    if (vitals.spo2 && Number(vitals.spo2) < 92) {
        score += 70;
        reasons.push("Low oxygen level");
    }

    if (score >= 90) {
        return {
            urgencyLevel: "Emergency",
            urgencyScore: Math.min(score, 100),
            reasons
        };
    }

    if (score >= 60) {
        return {
            urgencyLevel: "High",
            urgencyScore: score,
            reasons
        };
    }

    if (score >= 30) {
        return {
            urgencyLevel: "Medium",
            urgencyScore: score,
            reasons
        };
    }

    return {
        urgencyLevel: "Low",
        urgencyScore: score,
        reasons: reasons.length ? reasons : ["No critical symptoms detected"]
    };
}

function suggestDepartment(symptoms = "") {
    const text = normalizeSymptoms(symptoms);

    if (
        text.includes("chest pain") ||
        text.includes("heart") ||
        text.includes("blood pressure")
    ) {
        return "Cardiology";
    }

    if (
        text.includes("skin") ||
        text.includes("rash") ||
        text.includes("infection")
    ) {
        return "Dermatology";
    }

    if (
        text.includes("bone") ||
        text.includes("fracture") ||
        text.includes("joint")
    ) {
        return "Orthopedics";
    }

    if (
        text.includes("child") ||
        text.includes("baby") ||
        text.includes("pediatric")
    ) {
        return "Pediatrics";
    }

    if (
        text.includes("unconscious") ||
        text.includes("accident") ||
        text.includes("heavy bleeding") ||
        text.includes("seizure")
    ) {
        return "Emergency";
    }

    return "General Medicine";
}

function runTriage({ symptoms, vitals }) {
    const urgency = calculateUrgency(symptoms, vitals);
    const department = urgency.urgencyLevel === "Emergency"
        ? "Emergency"
        : suggestDepartment(symptoms);

    return {
        suggestedDepartment: department,
        urgencyLevel: urgency.urgencyLevel,
        urgencyScore: urgency.urgencyScore,
        reasons: urgency.reasons,
        recommendedAction: urgency.urgencyLevel === "Emergency"
            ? "Send patient directly to emergency department"
            : "Assign patient to OPD queue"
    };
}

module.exports = {
    runTriage,
    suggestDepartment,
    calculateUrgency
};
