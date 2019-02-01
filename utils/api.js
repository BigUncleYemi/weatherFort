export const fetchCurrentLocationId = async lattlong => {
  const response = await fetch(
    `https://www.metaweather.com/api/location/search/?lattlong=${lattlong.latt},${lattlong.long}`,
  );
  const locations = await response.json();
  return locations[0].woeid;
};

export const fetchWeather = async woeid => {
  const response = await fetch(
    `https://www.metaweather.com/api/location/${woeid}/`,
  );
  const { title, consolidated_weather } = await response.json();
  const { weather_state_name, the_temp } = consolidated_weather[0];
  return {
    location: title,
    weather: weather_state_name,
    temperature: the_temp,
  };
};

export const fetchSearchWeather = async location => {
  const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=062f10b910e58c8a408eed0f85e731fa&units=metric`,);
  const {name, weather, main} = await response.json();
  const {temp} = main;
  const {description, id} = weather[0];
  return {location: name, weather: description, temperature: temp, pic: id};
};
