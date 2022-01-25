require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
const db = process.env.MONGO_URI

const connectDB = async () => {
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true
        })

        console.log("MongoDB connected...")
    }catch(err){
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB