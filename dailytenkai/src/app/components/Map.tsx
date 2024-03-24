'use client'
import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from '@vis.gl/react-google-maps'

import {
  fromAddress,
} from "react-geocode";

import calculateNewCoordinates from './CoordinateCalc';

const halfDistance: number = 2.5;

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

let globalStartPos: null | string;
let globalEndPos: google.maps.LatLngLiteral | string;

const MapComponent: React.FC = () => {
  const [isError, setIsError] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [startPos, setStartPos] = useState<google.maps.LatLngLiteral | null | string>(null);

  const position = { lat: 51.5098, lng: 0.1180 };
  const debouncedGenerateRoute = debounce(GenerateRoute, 500);   

  function debounce(func: any, wait: any) {
    let timeout: any;
    return function executedFunction(...args: any) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      setStartPos(e.target.value);
      debouncedGenerateRoute();
    }

  function GenerateRoute() {
    if (!startPos) {

      return;
    }

    fromAddress(startPos as string, process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '')
      .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        if (!lat || !lng) {
        } else {
          setCoordinates({ lat, lng });
          globalStartPos = startPos as string;
        }

      })
      .catch((error) => {
        console.error(error)
      });

  };

  useEffect(() => {
    if (!coordinates) {
      return;
    }
    //8km in 10k steps - 4km in 5k
    //distance between 2 points = acos(sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(lon2-lon1))*6371
    let halfwayPoint: google.maps.LatLngLiteral = calculateNewCoordinates(coordinates.lat, coordinates.lng,
      halfDistance, getRandomInt(0, 360));

    globalEndPos = halfwayPoint;

  }, [coordinates]);

  const Directions = () => {
    const [isError, setIsError] = useState<boolean>(false);
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex]
    const leg = selected?.legs[0];

    useEffect(() => {
      if (!map || !routesLibrary) {
        return;
      }

      setDirectionsService(new google.maps.DirectionsService());
      setDirectionsRenderer(new google.maps.DirectionsRenderer({ map }));
    }, [map, routesLibrary]);

    function generateDirections() {
      if (!directionsService || !directionsRenderer || !globalStartPos || !globalEndPos) {
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 5000);
        return;
      }

      directionsRenderer.setMap(null);
      directionsRenderer.setMap(map);

      directionsService.route({
        avoidFerries: true,
        avoidHighways: true,
        avoidTolls: true,

        origin: globalStartPos,
        destination: globalEndPos,

        travelMode: google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
          setRoutes(result.routes);
        }
      });

    };

    useEffect(() => {
      if (!directionsRenderer || !routes[routeIndex]) {
        return;
      }

      directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex]);

    function clearRoutes() {
      directionsRenderer?.setMap(null);
      setRoutes([]);
    }

    if (!leg) {
      return (
        <div>
          <div className='w-full p-4 overflow-scroll bg-kachi text-shironeri dark:bg-shironeri dark:text-kachi'>
            <h2 className='underline'>Directions</h2>
            <p>Enter a location and click Generate Route to get started.</p>
            <button type='button'
              onClick={generateDirections}
              className='text-kachi dark:text-shironeri dark:bg-kachi bg-shironeri hover:shadow-[0_5px_12px_rgb(0,0,0,0.2)] rounded-lg px-5 py-2.5 mt-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
              Generate Directions</button>
          </div>
          {isError && (
            <div className="flex flex-row p-4" role="alert">
              <span className="text-lg text-ichigo dark:text-usubeni">Error! Please enter a location.</span>
            </div>
          )}
        </div>

      )
    } else {
      return (
        <div className='w-full p-4 bg-kachi text-shironeri dark:bg-shironeri dark:text-kachi'>
          <h2 className='underline'>{selected.summary}</h2>
          <p>Distance: {leg.distance?.text}</p>
          <p>Duration: {leg.duration?.text}</p>
          <p>Start: {leg.start_address}</p>
          <p>End: {leg.end_address}</p>

          <h2 className='underline my-2'>Other Routes</h2>
          <ul>
            {routes.map((route, index) => <li key={index}>
              <button type="button"
                className="my-2 text-kachi dark:text-shironeri dark:bg-kachi bg-shironeri hover:shadow-[0_5px_12px_rgb(0,0,0,0.2)] rounded-lg px-5 py-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
                onClick={() => setRouteIndex(index)}>
                {route.summary}
              </button>

            </li>)}
            <button type="button"
              className="my-2 text-kachi dark:text-shironeri dark:bg-kachi bg-shironeri hover:shadow-[0_5px_12px_rgb(0,0,0,0.2)] rounded-lg px-5 py-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
              onClick={() => clearRoutes()}>
              Clear Routes
            </button>
          </ul>

        </div>
      );
    };


  }

  return (
    <div>
      <input
        className='w-full h-10 px-3 focus:outline-none dark:text-kachi text-shironeri dark:bg-shironeri bg-kachi'
        onSubmit={(e) => { e.preventDefault(); }}
        onChange={(e) => handleInputChange(e)}
        placeholder='Enter a location...'
      />
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      >

        <div className='grid grid-cols-4'>
          <div className='col-span-3'>
            <Map
              defaultCenter={position}
              defaultZoom={8}
              mapId={process.env.NEXT_PUBLIC_MAP_ID}
              fullscreenControl={false}
              streetViewControl={false}
              mapTypeControl={false}
              style={{ width: '100%', height: '50vh' }}
            ></Map>
          </div>
          <div className='col-span-1 w-full'>
            <Directions />
          </div>
        </div>

      </APIProvider>

      {isError && (
        <div className="flex flex-row px-4" role="alert">
          <span className="text-lg text-ichigo dark:text-usubeni">Error! The location is unreachable - please add a city to the location.</span>
        </div>
      )}


    </div>
  );


};


export default MapComponent;