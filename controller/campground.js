const Campground = require('../models/campground');
const { cloudinary } = require('../couldinary/index');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.ShowAllCampGround = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds });
};

module.exports.newCampground = async (req, res) => {
    res.render('campground/new');
};

module.exports.newCampgroundCreate = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });
    const campground = new Campground(req.body);
    campground.geometry = geoData.features[0].geometry;
    campground.image = req.files.map(f => ({ url: f.path, filepath: f.filename }));
    campground.auther = req.user._id;
     await campground.save();
    

    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campground/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'review',
        populate: { path: 'auther' }
    }).populate('auther');

    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campground');
    }
    res.render('campground/show', { campground });
};

module.exports.editCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campground');
    }
    res.render('campground/edit', { campground });
};

module.exports.editedCampground = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const campground = await Campground.findById(id);
    if (!campground.auther.equals(req.user._id)) {
        req.flash('error', "You can't do this");
        return res.redirect(`/campground/${campground._id}`);
    }
    const campgrounded = await Campground.findByIdAndUpdate(id, req.body, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filepath: f.filename }));
    campgrounded.image.push(...imgs);
    await campgrounded.save();
    if (req.body.DeleteBox) {
        for (const file of req.body.DeleteBox) {
            await cloudinary.uploader.destroy(file);
        }
        await campgrounded.updateOne({ $pull: { image: { filepath: { $in: req.body.DeleteBox } } } });
    }

    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campground/${campgrounded._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findOneAndDelete({ _id: id });
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campground');
};
