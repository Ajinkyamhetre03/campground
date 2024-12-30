const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

// Database connection
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log('Connected to MongoDB successfully');
}

// Utility function to pick a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Seed function to populate the database
const seedDB = async () => {
  await Campground.deleteMany({}); // Clear existing data

  for (let i = 0; i < 50; i++) {
    let rand = Math.floor(Math.random() * cities.length); // Ensure index is within array bounds
    let price = Math.floor(Math.random() * 491) + 10; // 

    const campground = new Campground({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      geometry: {
        type: 'Point',
        coordinates: [cities[rand].longitude, cities[rand].latitude],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Sed voluptatem exercitationem deserunt tempore consequatur, obcaecati sit nobis.',
      price: price,
      auther: '676dceb466ed8229ab2e6341',
      image: [
        {
          url: 'https://res.cloudinary.com/dnz2wikje/image/upload/v1735411526/samples/upscale-face-1.png',
          filepath: 'yelpcamp/sne7tukob1fo4yomwen7',
        },
      ],
    });

    await campground.save();
  }
};

// Run the seed script and close the database connection
seedDB()
  .then(() => {
    console.log('Database seeding completed');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Seeding failed', err);
    mongoose.connection.close();
  });
