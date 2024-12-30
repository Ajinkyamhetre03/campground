const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview=async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const data = await new Review(req.body.Review)
    data.auther = req.user._id
    campground.review.push(data)
    await campground.save()
    await data.save()
    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/campground/${campground.id}`);
}
module.exports.deleteReview =async(req,res)=>{
    const {id , reviewID}= req.params
    await Campground.findByIdAndUpdate(id,{$pull:{review: reviewID}})
  await Review.findByIdAndDelete(reviewID)
   req.flash('success', 'Successfully deleted review!');
  res.redirect(`/campground/${id}`);
}