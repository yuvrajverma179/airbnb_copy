const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");

app.listen(8080, () => {
    console.log("server is listening at port 8080");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
    await mongoose.connect
    ('mongodb://localhost:27017/wanderlust');
}

app.get("/", (req,res) => {
    console.log("request received");
    res.send("");
});

//Index Route
app.get("/listings", async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("./listings/index.ejs", {alllistings});
})

//New Route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
});

//Create Route
app.post("/listings", async (req, res) => {
    console.log(req.body);
    // const newListing = new Listing(req.body);
    // await newListing.save();
    // res.redirect("/listings");
})
// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My Villa",
//         description : "By the Beach",
//         price : 1000000,
//         location : "Navi Mumbai, Mumbai",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("testing was successfull.")
// });
