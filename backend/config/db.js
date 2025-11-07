import mongoose from "mongoose"

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console("db connected successfully");
    } catch(error){
        console.log("db error at db.js");
    }
}

export default connectDB;