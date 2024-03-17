'use client'
import React, { useState, useRef } from 'react';
// @ts-ignore: Annoying
import { GoogleMap, LoadScript, Autocomplete, Library, Marker } from '@react-google-maps/api';

const libraries: Library[] = ['places'];

const MapComponent: React.FC = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [zoom, setZoom] = useState<number>(8);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    console.log(place);
    if (place && place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCoordinates({ lat, lng });
      setMarkerPosition({ lat, lng });
      setZoom(18);
    } else {
      setZoom(8);
    }
  };

  return (
    <div>
      <LoadScript
        googleMapsApiKey={"AIzaSyBPAsRg0mR6lK7UG9dmU5lS9emTFkKN4NU" || ''}
        libraries={libraries}
      >
        <Autocomplete onLoad={autocomplete => (autocompleteRef.current = autocomplete)} onPlaceChanged={handlePlaceSelect}>
          <input type="text" placeholder="Enter your location" />
        </Autocomplete>
        <GoogleMap
          mapContainerStyle={{ width: '800px', height: '500px' }}
          center={coordinates || { lat: -34.397, lng: 150.644 }}
          zoom={zoom}
        >
        {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </LoadScript>
      <p>Selected Coordinates: {coordinates ? `${coordinates.lat}, ${coordinates.lng}` : "None"}</p>
    </div>
  );
};

export default MapComponent;
