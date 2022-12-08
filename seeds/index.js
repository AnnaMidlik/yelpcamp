const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch((err) => console.log(err, "Mongo Connection Error"));
async function main() {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("Mongo Connection");
};


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const sample = array => array[Math.floor(Math.random() * array.length)];
const users = ['6326dee7de22925f0d3036bc', '63276ddf8d2b4271e0209a90', '63276e118d2b4271e0209a97', '63287a62bb2f242a14e39b16']
const seedDB = async () => {
    // await Campground.deleteMany({});
    for (let i = 0; i < 14; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: users[Math.floor(Math.random() * 4)],
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/df4qfsufp/image/upload/v1663762526/YelpCamp/wyyreidys8flabuzfhau.jpg',
                    filename: 'YelpCamp/wyyreidys8flabuzfhau',
                },
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})