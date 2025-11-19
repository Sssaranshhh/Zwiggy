import mongoose from "mongoose"

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("db connected successfully");
    } catch(err){
        console.log(`db error: ${err} at db.js`);
    }
}

export default connectDB;