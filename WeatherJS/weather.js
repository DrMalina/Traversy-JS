class Weather {
	constructor(city, countryCode) {
		this.apiKey = '2cc5852c824f6b176e2b296c0e82b5b5';
		this.city = city;
		this.countryCode = countryCode;
	}

	// Fetch weather from API
	async getWeather() {
		const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.countryCode}&APPID=${this.apiKey}`);
		const responseData = await response.json();
		return responseData
	}

	// Change weather location
	changeLocation(city, countryCode) {
		this.city = city;
		this.countryCode = countryCode;
	}
}