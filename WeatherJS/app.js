// Init Storage
const storage = new Storage();

// Get stored location data
const weatherLocation = storage.getLocationData();

// Init weather object
const weather = new Weather(weatherLocation.city, weatherLocation.countryCode);

// Init UI
const ui = new UI();

// Get weather on DOM load
document.addEventListener('DOMContentLoaded', getWeather);

// Change location event
document.getElementById('w-change-btn').addEventListener('click', (e) => {
	e.preventDefault;
	const city = document.getElementById('city').value;
	const countryCode = document.getElementById('countryCode').value;
	weather.changeLocation(city, countryCode);
	storage.setLocationData(city, countryCode);
	getWeather();

	// JQuery!
	$('#locModal').modal('hide');
});

function getWeather(){
	weather.getWeather()
		.then(results => {
			ui.paint(results);
		})
		.catch(err => console.log(err));
}

function convertKelvinToCelsius(kelvin) {
	if (kelvin < (0)) {
		return 'below absolute zero (0 K)';
	} else {
		let myCelcius = 0;
		let myCelciusRounded = 0;

		myCelcius = kelvin-273.15;
		myCelciusRounded = Math.round(myCelcius);
		return myCelciusRounded;
	}
}

function MetresPerSecondToKilometersPerHour(mps) {
	let kmPerSecond = 0;
	let kmPerHour = 0;
	let kmPerHourRounded = 0;

	kmPerSecond = mps / 1000;
	kmPerHour = kmPerSecond * 3600;
	kmPerHourRounded = Math.round(kmPerHour);
	return kmPerHourRounded;
}

function windDirectionFromDegrees(deg) {
        if (deg <= 44) {
        return 'N';
    } else if (deg <= 89) {
        return 'NE';
    } else if (deg <= 134) {
        return 'E';
    } else if (deg <= 179) {
        return 'SE';
    } else if (deg <= 224) {
        return 'S';
    } else if (deg <= 269) {
        return 'SW';
    } else if (deg <= 314) {
        return 'W';
    } else  {
        return 'NW';
    }
}