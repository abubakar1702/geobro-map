import React, { useState } from "react";
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

const CountryMapv2 = () => {
  const [randomCountry, setRandomCountry] = useState(() => {
    const randomIndex = Math.floor(Math.random() * countries.features.length);
    return countries.features[randomIndex].properties.ADMIN;
  });

  const [clickedCountry, setClickedCountry] = useState("");
  const [wrongAns, setWrongAns] = useState(0);
  const [rightAns, setRightAns] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(false);

  const pickRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countries.features.length);
    const randomCountryName = countries.features[randomIndex].properties.ADMIN;
    setRandomCountry(randomCountryName);
  };

  const onCountryClick = (event) => {
    const countryName = event.target.feature.properties.ADMIN;
    setClickedCountry(countryName);

    if (countryName === randomCountry) {
      setRightAns((prevRightAns) => prevRightAns + 10);
      
    } else {
      setWrongAns((prevWrongAns) => prevWrongAns - 10);
    }
    event.target.setStyle({
        color: "white",
        fillColor: "yellow",
      });
      setForceUpdate(!forceUpdate);

    pickRandomCountry();
  };

  const onEachCountry = (country, layer) => {
    const countryName = country.properties.ADMIN;
    layer.bindPopup(countryName);

    layer.on({
      click: onCountryClick,
    });
  };

  return (
    <div>
      <h1 className="text-blue-600 text-center">Find: {randomCountry}</h1>
      <p className="text-center">Right Answers: {rightAns}</p>
      <p className="text-center">Wrong Answers: {wrongAns}</p>
      <MapContainer
        style={{ width: "180vh", height: "70vh" }}
        zoom={2}
        center={[40, 50]}
      >
        <GeoJSON
          key={forceUpdate}
          style={countryStyle}
          data={countries.features}
          onEachFeature={onEachCountry}
        />
      </MapContainer>
    </div>
  );
};

export default CountryMapv2;
