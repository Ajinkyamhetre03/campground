const Campground = require('./models/campground');
const Review = require('./models/review');
const { app } = require('./routers/campground');
const catchAsync = require('./utils/catchAsync');

module.exports.loginChecker = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.isAuther = async(req ,res, next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if ((!campground.auther.equals(req.user._id))) {
        req.flash('error', "You can't do this");
       return  res.redirect(`/campground/${campground._id}`);
    }
    next()
}

module.exports.isReviewAuther = async(req ,res, next)=>{
    const { id , reviewID} = req.params;
    const review = await Review.findById(reviewID);
    if ((!review.auther.equals(req.user._id))) {
        req.flash('error', "You can't do this");
       return  res.redirect(`/campground/${id}`);
    }
    next()
}
