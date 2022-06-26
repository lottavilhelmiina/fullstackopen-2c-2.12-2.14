import React, { useState, useEffect } from "react";
import axios from "axios";

const FilterBar = ({ filter, handleFilterChange }) => {
  return (
    <form>
      <div>
        Filter names containing:{" "}
        <input value={filter} onChange={handleFilterChange} />
      </div>
    </form>
  );
};

const FilterList = ({
  filter,
  countries,
  handleButtonClick,
}) => {
  const [weather, setWeather] = useState(null);

  const result = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (result.length === 1 && result[0].capital[0]) {
      const capital = result[0].capital[0];
      let apiKey = "33719288fca7cea679dab0f039a0306f";
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;
      axios.get(apiUrl).then(displayWeather);
    }
  }, [result]);

  function displayWeather(response) {
    setWeather({
      temperature: response.data.main.temp,
      wind: response.data.wind.speed,
      icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      description: response.data.weather[0].description
    });
  }

  if (result.length > 10) {
    return <p>Too many countries, specify another character.</p>;
  }

  // Alle kymmenen tulosta.
  if (result.length < 11 && result.length > 1) {
    console.log(result);
    return result.map((country) => (
      <React.Fragment key={country.name.common}>
        <span>{country.name.common}</span>
        <button onClick={() => handleButtonClick(country.name.common)}>
          View
        </button>
        <br />
      </React.Fragment>
    ));
  }

  return result.map((country) => (
    <React.Fragment key={country.name.common}>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km2</p>
      <h4>Languages</h4>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <h4>National flag</h4>
      <img
        src={country.flags.svg}
        alt={"Flag of " + country.name.common}
        height="100vh"
        width="100vw"
      />
      {weather && <>
        <h3>Weather in {country.capital}</h3>
        <p>Temperature: {weather.temperature} °C</p>
        <img
          src={weather.icon}
          alt={"Flag of " + country.name.common}
          height="100vh"
          width="100vw"
        />
        <p>Wind: {weather.wind} Km/H</p>
      </>}
    </React.Fragment>
  ));
};

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      console.log("promise fulfilled");
      setCountries(response.data);
    });
  }, []);


  // const handleCapitalStateChange = (country) => {
  //   setCapital(country.capital[0]);
  // };

  console.log("render", countries.length, "countries");
  //tää alempi toimii ekaks mut jos päivittää sivun niin
  //tulee "undefined is not an object"
  //console.log(countries[0].capital[0]);

  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  const handleButtonClick = (commonName) => {
    setFilter(commonName);
  };

  return (
    <div className="App">
      <FilterBar filter={filter} handleFilterChange={handleFilterChange} />
      <FilterList
        filter={filter}
        countries={countries}
        handleButtonClick={handleButtonClick}
      />
    </div>
  );
}

export default App;
