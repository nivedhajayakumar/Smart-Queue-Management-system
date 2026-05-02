const mongoose = require("mongoose");
// receptionist token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjMwZmI4ZjdjNGYzMDc1MmU3OTk4NCIsInJvbGUiOiJSRUNFUFRJT05JU1QiLCJpYXQiOjE3Nzc1MzY5NzEsImV4cCI6MTc3NzYyMzM3MX0.rMNHu6j6w75OPbqU6XraGlX37B53_9Mo6zXoiU69OC8
//admin token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjMwOGM1MDAyNmEzYWI3NTZiMjkzOCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3NzcwNDI3MCwiZXhwIjoxNzc3NzkwNjcwfQ.hreIX5kHSAH1UdLrPys5C-OZ1ZvAEtB2kOUtWh1EphQ
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["ADMIN", "RECEPTIONIST", "DOCTOR"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
