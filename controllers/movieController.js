const express = require("express");
const router = express.Router();

const db = require("../models");

//show route
router.get("/:id", (req, res) => {
    const movieId = req.params.id;
    const theatreList = [];
    const theatreObjects = [];
    let context = {
        theatres: []
    };
    db.Movie.findById(movieId, (err, foundMovie) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        db.Showing.find({Movie: movieId, playing: true}).populate("Theatre").exec(function(err, showing) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            //console.log(showing);
            showing.forEach(showtime => {
                theatreList.push(showtime.Theatre);
            });
            console.log(theatreList);
            context = {
                movie: foundMovie,
                title: foundMovie.name,
                css: "main",
                theatres: theatreList,
            };
            res.render("movie/show", context);
        });
    });
});

/* Create Movie Listing */
router.post("/", (req, res) => {
    db.Movie.create(req.body, (err, createdMovie) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        console.log(createdMovie);
        res.redirect("/admin/");
    });
})

/* Edit Movie Listing*/
//update route
router.put("/:id", (req, res) => {
    db.Movie.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedMovie) => {
        if (err) {
            return console.log(err);
        }

        res.redirect("/admin/");
    })
})

//delete route
router.delete("/:id", (req, res) => {
    db.Movie.findByIdAndDelete(req.params.id, (err, deletedMovie) => {
        if (err) return res.send(err);
        db.Showing.remove({ Movie: deletedMovie._id }, (err, removedShowing) => {
            if (err) return res.send(err);
            res.redirect("/admin/");
        })
    })
})


module.exports = router;