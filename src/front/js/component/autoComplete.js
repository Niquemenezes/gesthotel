import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import PlacesAutocomplete from "react-places-autocomplete";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 40.749933, lng: -73.98633 };

const AutocompleteWithMap = ({ value, onChange, onSelect, onLatLngChange }) => {
  const [position, setPosition] = useState(defaultCenter);

  const handleSelect = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK") {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setPosition({ lat, lng });
        onLatLngChange(lat, lng);
        onChange(address); // 👈 Corrección aquí
      } else {
        alert("No se pudo obtener la ubicación");
      }
    });
  };

  const key = process.env.MAP_KEY;

  return (
    <LoadScript googleMapsApiKey={key} libraries={["places"]}>
      <div>
        <PlacesAutocomplete value={value} onChange={onChange} onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <input
                {...getInputProps({ placeholder: "Buscar dirección..." })}
                className="form-control mb-3"
              />
              <div className="autocomplete-dropdown">
                {suggestions.map((suggestion, index) => (
                  <div key={index} {...getSuggestionItemProps(suggestion)} className="suggestion-item">
                    {suggestion.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        <GoogleMap mapContainerStyle={mapContainerStyle} center={position} zoom={15}>
          <Marker position={position} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default AutocompleteWithMap;
