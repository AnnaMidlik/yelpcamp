mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/dark-v10', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
  projection: 'globe' // display the map as a 3D globe
});
map.addControl(new mapboxgl.NavigationControl());
map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
});
const popup = new mapboxgl.Popup({ linearOffset: 25 })
  .setHTML(`<h3>${campground.title}</h3>`)
new mapboxgl.Marker({ color: 'pink' })
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup)

  .addTo(map);


  // .setHTML('<h1>Hello World!</h1>')
