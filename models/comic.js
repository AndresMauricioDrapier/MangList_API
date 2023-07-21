const mongoose = require("mongoose");

// Definicion del esquema y modelo
let comicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    main_picture: {
        medium: {
            type: String,
            required: false
        },
        large: {
            type: String,
            required: false
        }
    },
    alternative_titles: {
        type: [String],
        required: false,
    },
    start_date: {
        type: String,
        required: false,
    },
    end_date: {
        type: String,
        required: false,
    },
    synopsis: {
        type: String,
        required: false,
    },
    mean: {
        type: Number,
        required: false,
    },
    rank: {
        type: Number,
        required: false,
    },
    popularity: {
        type: Number,
        required: false,
    },
    num_list_users: {
        type: Number,
        required: false,
    },
    num_scoring_users: {
        type: Number,
        required: false,
    },
    nsfw: {
        type: String,
        required: false,
    },
    genres: {
        type: [{id:Number,name:String}],
        required: true,
    },
    created_at: {
        type: String,
        required: false,
    },
    updated_at: {
        type: String,
        required: false,
    },
    media_type: {
        type: String,
        enum: ["Manga", "Novel", "One Shot", "Doujinshi", "Manhwa", "Manhua", "OEL", "Light Novel", "Webtoon", "Unknown"],
        required: false,
    },
    status: {
        type: String,
        enum: ["currently_publishing", "finished"],
        required: true,
    },
    my_list_status: {
        type: Object,
        required: false,
    },
    num_volumes: {
        type: Number,
        required: true,
    },
    num_chapters: {
        type: Number,
        required: false,
    },
    authors: {
        type: [String],
        required: false,
    },
    pictures: {
        type: [String],
        required: false,
    },
    background: {
        type: String,
        required: false,
    },
    related_anime: {
        type: [String],
        required: false,
    },
    related_manga: {
        type: [String],
        required: false,
    },
    recommendations: {
        type: [String],
        required: false,
    },
    serialization: {
        type: [String],
        required: false,
    }
});

let comic = mongoose.model("comic", comicSchema);

module.exports = comic;
