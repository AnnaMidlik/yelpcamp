const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const ExpressError = require('../utils/ExpressError');


module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  campgrounds.reverse();
  res.render('campgrounds/index', { campgrounds })
};
module.exports.newCampForm = (req, res) => {
  res.render('campgrounds/new');
};
module.exports.createCamp = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  const campground = new Campground(req.body.campground);
  console.log(req.body.files)
  campground.geometry = geoData.body.features[0].geometry
  campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`)
};
module.exports.showCamp = async (req, res,) => {
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  campground.reviews.reverse();
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};
module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};
module.exports.updateCamp = async (req, res) => {
  const { id } = req.params;
  console.log(req.body.deleteImages)
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
  campground.image.push(...images);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      console.log(filename)
      await cloudinary.uploader.destroy(filename)
      // await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
  };
  await campground.save();
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`)
};
module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground')
  res.redirect('/campgrounds');
};