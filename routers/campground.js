const router = require('express').Router();
const { loginChecker, isAuther } = require('../middleware')
const { validationCampground } = require('../validationCampground');
const catchAsync = require('../utils/catchAsync');
const campgroundControl = require('../controller/campground')
const multer = require('multer')
const { storage } = require('../couldinary/index')
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(campgroundControl.ShowAllCampGround))
    .post(loginChecker, upload.array('image'), validationCampground, catchAsync(campgroundControl.newCampgroundCreate))
// .post(upload.array('image'), function (req, res, next) {
//     console.log(req.files);
//     res.send(req.files)
//   })

router.get('/new', loginChecker, campgroundControl.newCampground);

router.route('/:id')
    .get(catchAsync(campgroundControl.showCampground))
    .put(loginChecker, isAuther, upload.array('image'), validationCampground, catchAsync(campgroundControl.editedCampground))
    .delete(loginChecker, isAuther, catchAsync(campgroundControl.deleteCampground))

router.get('/:id/edit', loginChecker, isAuther, campgroundControl.editCampground);


module.exports = router