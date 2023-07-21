const mongoose = require("mongoose");

// Definicion del esquema y modelo
let paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    mailUser: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

let payment = mongoose.model("payment", paymentSchema);
module.exports = payment;
