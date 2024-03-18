'use client'
import React, { useState, useRef } from 'react';
// @ts-ignore: Annoying
import { GoogleMap, LoadScript, Autocomplete, Library, Marker } from '@react-google-maps/api';
import calculateNewCoordinates from './CoordinateCalc';

const libraries: Library[] = ['places'];
const halfDistance: number = 4;

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

const MapComponent: React.FC = () => {
  const mapRef = useRef<GoogleMap | null>(null); 
  const [isError, setIsError] = useState<boolean>(false);
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
      setZoom(15);
    } else {
      setZoom(8);
    }
  };

  const calculateRouteCoordinates = () => {
    if(coordinates == null){

      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 5000);

      return;
    } else {
      //8km in 10k steps - 4km in 5k
      //distance between 2 points = acos(sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(lon2-lon1))*6371
      let halfwayPoint = calculateNewCoordinates(coordinates.lat, coordinates.lng,
                                                 halfDistance, getRandomInt(0, 360));

      console.log(halfwayPoint.dLat2, ", ", halfwayPoint.dLon2);
    }
  };

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY|| ''}
        libraries={libraries}
      >
        <Autocomplete onLoad={autocomplete => (autocompleteRef.current = autocomplete)} onPlaceChanged={handlePlaceSelect}>
          <input className="text-binrojizome dark:text-binrojizome" type="text" placeholder="Enter your location" />
        </Autocomplete>
        <GoogleMap
          ref={mapRef}
          mapContainerStyle={{ width: '100%', height: '600px' }}
          center={coordinates || { lat: -34.397, lng: 150.644 }}
          zoom={zoom}
        >
        {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </LoadScript>
      <div className='flex md:flex-row flex-col items-center justify-between md:py-4 gap-4 py-4 px-4'>
        <p>Selected Coordinates: {coordinates ? `${coordinates.lat}, ${coordinates.lng}` : "None"}</p>
        <button type="button" className="dark:text-kachi text-shironeri bg-kachi dark:bg-shironeri hover:shadow-[0_5px_12px_rgb(0,0,0,0.2)] rounded-lg px-5 py-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]" onClick={calculateRouteCoordinates}>Generate Route</button>      
      </div>

      {isError && (
        <div className="flex flex-col items-center" role="alert">
          <span className="text-lg text-ichigo dark:text-usubeni">Error! Please select a location.</span>
        </div>
      )}
      
    </div>
  );
};

export default MapComponent;
