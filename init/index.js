const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

//calling main function
main()
    .then(() => {
        console.log("connection succeeded");
    })
    .catch((err) => {
        // let error = err;
        // console.log(error);
        console.log("error obtained");
    });

//creation of main function
async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
} 

initDB();