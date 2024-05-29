const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js")
const path = require("path");
const methodOverride = require("method-override");
const { ppid } = require("process");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

app.listen(8080, () => {
    console.log("server is listening at port 8080");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    };
};

const validateReview = (req, res, next) => {
    // console.log(req.body.rating);
    // let result = reviewSchema.validate(req.body);
    // console.log(result);
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        // console.log("error called");
        // console.log(error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        console.log("next called");
        next();
    };
};

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
app.get("/listings", wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("./listings/index.ejs", {alllistings});
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", {listing});
}));

//Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
        let {title, description, image, price, location, country} = req.body;
        // console.log({title, description, image, price, location, country});
        const newListing = new Listing({title, description, image, price, location, country});
        await newListing.save();
        res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    // if(!req.body.params) {
    //     throw new ExpressError(400, "Send valid Data for Listing !")
    // };
    let {title, description, image, price, location, country} = req.body;
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Reviews
//Post Route
app.post("/listings/:id/reviews", validateReview ,wrapAsync (async (req, res) => {
    // console.log(req.body);
    let listing = await Listing.findById(req.params.id);
    // console.log(listing);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New Review Saved");
    res.redirect(`/listings/${listing._id}`);
}));









app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Error : Page Not Found !"));
});

app.use((err, req, res, next) => {
    // res.send("Something Went Wrong !")
    let {statusCode = 500, Message = "Something Went Wrong !"} = err;
    res.status(statusCode).render("error.ejs", { Message });
    // res.status(statusCode).send(Message);
});


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
