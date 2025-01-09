const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TripDetailsSchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    destination_image_url:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    numberOfDays: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.models.TripDetails || mongoose.model('TripDetails', TripDetailsSchema);