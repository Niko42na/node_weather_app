const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

const encodedAddress = encodeURIComponent(argv.address);
const geocodeUrl =  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
const weatherApiKey = '8994ddd47339eb106820dedbaa68fb9b';

axios.get(geocodeUrl).then((response) => {
  if (response.data.status === 'ZERO_RESULTS') {
    throw new Error('Unable to find that address.');
  }
  const lat = response.data.results[0].geometry.location.lat;
  const lng = response.data.results[0].geometry.location.lng;
  const weatherUrl = `https://api.forecast.io/forecast/${weatherApiKey}/${lat},${lng}`;
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherUrl);
}).then((response) => {
  const temperature = (response.data.currently.temperature - 32) * 5/9;
  const apparentTemperature = (response.data.currently.apparentTemperature - 32) * 5/9;
  console.log(`It's currently ${temperature.toFixed(1)}. It feels like ${apparentTemperature.toFixed(1)}.`);
}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('Unable to connect to API servers.');
  } else {
    console.log('There is some error. Try again.');
  }
});