const request = require('request');
const weatherApiKey = '8994ddd47339eb106820dedbaa68fb9b';


const getWeather = (lat, long, callback) => {
  request({
    url: `https://api.darksky.net/forecast/${weatherApiKey}/${lat},${long}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('Unable to connect to Forecast.io server.');
    } else if (response.statusCode === 400) {
      callback('Unable to fetch weather.');
    } else if (response.statusCode === 200) {
      callback(null, {
        temperature: body.currently.temperature,
        apparentTemperature: body.currently.apparentTemperature
      });
    }
  });
};

module.exports.getWeather = getWeather;