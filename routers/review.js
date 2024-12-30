const router = require('express').Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync');
const {  validationReview  } = require('../validationCampground');
const {loginChecker ,isReviewAuther}=require('../middleware')
const ReviewControl  = require('../controller/reviews')

//reviews 
router.post('/',validationReview,loginChecker, catchAsync(ReviewControl.createReview))

 // delete review
 router.delete('/:reviewID',loginChecker,isReviewAuther ,catchAsync(ReviewControl.deleteReview))

module.exports  = router