
const mongoose = require('mongoose');   


let unixTimestamp = 1727033927131;
const dateObj = new Date(unixTimestamp * 1000); // current date/time
export const MatchHistorySchema = new mongoose.Schema({
    
    matchID: { type: String, required: true }, 
    participants: [{type: String, required: true}], // all players (puuids) in the match
    game_dateTime: {type: dateObj, required: true}, // game start time
    
    
    createdAt: { type: Date, default: Date.now }
});

export const MatchHistoryModel = mongoose.model('MatchHistory', MatchHistorySchema);