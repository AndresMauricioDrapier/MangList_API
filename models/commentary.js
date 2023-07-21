const mongoose = require("mongoose");
const User = require("./user");

// Definicion del esquema y modelo
let commentarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.Object,
        ref: User,
        required: true,
    },
    comicId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    stars: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: false,
    },
});

let commentary = mongoose.model("commentary", commentarySchema);
module.exports = commentary;
