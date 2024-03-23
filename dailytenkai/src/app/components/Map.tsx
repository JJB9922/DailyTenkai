'use client'
import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from '@vis.gl/react-google-maps'
import calculateNewCoordinates from './CoordinateCalc';

const halfDistance: number = 3.5;

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

let startPos: google.maps.LatLngLiteral | null;
let endPos: google.maps.LatLngLiteral | null;

const MapComponent: React.FC = () => {
  const [isError, setIsError] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const position = { lat: 35.6895, lng: 139.6917 };

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
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      >
        <div className='grid grid-cols-2 w-screen'>
          <div className='w-full h-96 max-h-96'>
            <Map
              defaultCenter={position}
              defaultZoom={8}
              mapId={process.env.NEXT_PUBLIC_MAP_ID}
              fullscreenControl={false}
              streetViewControl={false}
              mapTypeControl={false}
            ></Map>
          </div>
          <div className='h-96 overflow-auto'>
            <Directions />
          </div>
        </div>

      </APIProvider>

      <div className='flex md:flex-row flex-col py-4'>
        <button type="button" className="dark:text-kachi text-shironeri bg-kachi dark:bg-shironeri hover:shadow-[0_5px_12px_rgb(0,0,0,0.2)] rounded-lg px-5 py-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]" onClick={calculateRouteCoordinates}>Generate Route</button>

        {isError && (
          <div className="flex flex-row px-4" role="alert">
            <span className="text-lg text-ichigo dark:text-usubeni">Error! Please select a location.</span>
          </div>
        )}
      </div>


    </div>
  );
};

function Directions() {
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

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !startPos || !endPos) {
      return;
    }

    directionsService.route({
      avoidFerries: true,
      avoidHighways: true,
      avoidTolls: true,

      origin: startPos,
      destination: endPos,

      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: true,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.setDirections(result);
        setRoutes(result.routes);
      } else {
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 5000);
      }
    });

  }, [directionsService, directionsRenderer]);

  useEffect(() => {
    if (!directionsRenderer || !routes[routeIndex]) {
      return;
    }

    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex]);

  if (!leg) return null;

  return (
    <div className='bg-kachi text-shironeri dark:bg-shironeri dark:text-kachi rounded w-2/3 lg:w-1/2 xl:w-1/3 p-4 shadow'>
      <h2 className='underline'>{selected.summary}</h2>
      <p>Distance: {leg.distance?.text}</p>
      <p>Expected Duration: {leg.duration?.text}</p>

      <h2 className='underline my-2'>Other Routes</h2>
      <ul>
        {routes.map((route, index) => <li key={index}>
          <button type="button"
            className="my-2 text-kachi dark:text-shironeri dark:bg-kachi bg-shironeri hover:shadow-[0_5px_12px_rgb(0,0,0,0.2)] rounded-lg px-5 py-2.5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            onClick={() => setRouteIndex(index)}>
            {route.summary}
          </button>
        </li>)}
      </ul>
    </div>

  );
}

export default MapComponent;