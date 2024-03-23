'use client'
import React, { useState } from 'react';
import { APIProvider, Map, Marker, } from '@vis.gl/react-google-maps'
import calculateNewCoordinates from './CoordinateCalc';

const halfDistance: number = 3.5;

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

const MapComponent: React.FC = () => {
  const [isError, setIsError] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const calculateRouteCoordinates = () => {
    if (coordinates == null) {

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
      let lat = halfwayPoint.dLat2;
      let lng = halfwayPoint.dLon2;
    }
  };

  return (
    <div>
      <APIProvider
        apiKey={process.env.
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        libraries={['places']}
      >
        <Map
          defaultCenter={coordinates || { lat: -34.397, lng: 150.644 }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          zoom={8}
          style={{ width: '100%', height: '600px' }}
        >
        </Map>
      </APIProvider>
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