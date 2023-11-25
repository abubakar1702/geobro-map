import React, { useEffect, useState, useRef } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import countries from "../data/countries.json";
import "leaflet/dist/leaflet.css";
import "./CountryMap.css";

const countryStyle = {
  fillColor: "green",
  fillOpacity: 1,
  color: "black",
  weight: 2,
};

const CountryMap = () => {
  const [randomCountry, setRandomCountry] = useState("");
  const [clickedCountry, setClickedCountry] = useState("");
  const [wrongAns, setWrongAns] = useState(0);
  const [rightAns, setRightAns] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const randomCountryRef = useRef("");

  const pickRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countries.features.length);
    const randomCountryName = countries.features[randomIndex].properties.ADMIN;
    setRandomCountry(randomCountryName);
    randomCountryRef.current = randomCountryName;
  };

  useEffect(() => {
    if (gameStarted) {
      pickRandomCountry();
    }
  }, [gameStarted]);

  const onCountryClick = (event) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    const countryName = event.target.feature.properties.ADMIN;
    setClickedCountry(countryName);

    if (countryName === randomCountryRef.current) {
      setRightAns((prevRightAns) => prevRightAns + 1);
    } else {
      setWrongAns((prevWrongAns) => prevWrongAns + 1);
    }

    event.target.setStyle({
      color: "white",
      fillColor: "yellow",
    });

    pickRandomCountry();
  };

  const onEachCountry = (country, layer) => {
    const countryName = country.properties.ADMIN;
    layer.bindPopup(countryName);

    layer.on({
      click: onCountryClick,
    });
  };

  const startGame = () => {
    setGameStarted(true);
    pickRandomCountry();
  };

return (
  <div>
    {gameStarted && <h1 className="text-blue-600 text-center">Find: {randomCountryRef.current}</h1>}
    <p className="text-center">Right Answers: {rightAns}</p>
    <p className="text-center">Wrong Answers: {wrongAns}</p>
    {!gameStarted && (
      <button className="start-button" onClick={startGame}>
        Start
      </button>
    )}
    {gameStarted && (
      <MapContainer
        style={{ width: "180vh", height: "70vh" }}
        zoom={2}
        center={[40, 50]}
      >
        <GeoJSON
          style={countryStyle}
          data={countries.features}
          onEachFeature={onEachCountry}
        />
      </MapContainer>
    )}
  </div>
);

};

export default CountryMap;
