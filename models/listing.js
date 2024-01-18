const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const  Review = require("./reviews.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type:String,
    },
    image :{
        type: String,
        default: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJlYWNofGVufDB8fDB8fHww",
        set : (v)=>v===""? "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJlYWNofGVufDB8fDB8fHww": v,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
});

//post mongoose middleware for deleting reviews if a listing is deleted

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
         await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

