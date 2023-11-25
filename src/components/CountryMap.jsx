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
  const [clickedCountries, setClickedCountries] = useState([]);

  const randomCountryRef = useRef("");

  const pickRandomCountry = () => {
    // Filter out countries that have already been clicked
    const availableCountries = countries.features.filter(
      (feature) => !clickedCountries.includes(feature.properties.ADMIN)
    );

    // Check if all countries are clicked
    if (availableCountries.length === 0) {
      setGameStarted(false);
      alert("Game Over! You've clicked all countries.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableCountries.length);
    const randomCountryName =
      availableCountries[randomIndex].properties.ADMIN;
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

    const isCorrect = countryName === randomCountryRef.current;

    event.target.setStyle({
      color: "white",
      fillColor: isCorrect ? "yellow" : "red",
    });

    if (isCorrect) {
      setRightAns((prevRightAns) => prevRightAns + 1);
    } else {
      setWrongAns((prevWrongAns) => prevWrongAns + 1);
    }

    // Add the clicked country to the list
    setClickedCountries((prevClickedCountries) => [
      ...prevClickedCountries,
      countryName,
    ]);

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

  const totalCountries = countries.features.length;
  const totalClickedCountries = clickedCountries.length;
  const totalRemainingCountries = totalCountries - totalClickedCountries;

  return (
    <div>
      {gameStarted && (
        <h1 style={{ color: "#252525", fontSize: "50px" }}>
          Find: {randomCountryRef.current}
        </h1>
      )}
      {gameStarted && (
        <h1 style={{ textAlign: "center", fontSize: "20px" }}>
          Right: <span style={{ color: "#00cc00" }}>{rightAns}</span> | Wrong:{" "}
          <span style={{ color: "#ff0000" }}>{wrongAns}</span>
        </h1>
      )}

      {gameStarted && (
        <div>
          <p style={{ textAlign: "center", fontSize: "16px", color: "#252525" }}>
          </p>
          <p style={{ textAlign: "center", fontSize: "16px", color: "#252525" }}>
            Total Done: {totalClickedCountries} | Total Remain: {totalRemainingCountries}
          </p>
        </div>
      )}

      {!gameStarted && totalClickedCountries === totalCountries && (
        <p style={{ textAlign: "center", fontSize: "20px", color: "#252525" }}>
          Game Over! You've clicked all countries.
        </p>
      )}

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
