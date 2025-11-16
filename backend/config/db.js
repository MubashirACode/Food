

import mongoose from "mongoose"


const connectDB = async () => {

    try {
        mongoose.connection.on('Connect', () => {
            console.log("DB is connected")
        })

        await mongoose.connect(`${process.env.MONGODB_URL}/food`)
    } catch (error) {
        console.log(error)
    }


}


export default connectDB;