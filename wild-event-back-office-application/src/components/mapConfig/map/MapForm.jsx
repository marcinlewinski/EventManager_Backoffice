import React, { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import './Map.css'
import { Box } from "@mui/material";

const MapForm = ({ mapLocations, location, coordinate, setCoordinate}) => {
  const [isUpdating, setIsUpdating] = useState(true)
  const mapContainerRef = useRef(null);
  
  mapboxgl.accessToken = `${process.env.REACT_APP_API_KEY}`;

  useEffect(() => {
    if (location) {
        setCoordinate({
            latitude: location.coordinateDTO.latitude,
            longitude: location.coordinateDTO.longitude
          })
    } else {
        setCoordinate({
            latitude: mapLocations.coordinate.latitude,
            longitude: mapLocations.coordinate.longitude
          })
    }
    setIsUpdating(false)
  }, [])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [coordinate.longitude, coordinate.latitude],
      zoom: mapLocations.zoom,
      bearing: mapLocations.bearing
    }, []);

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    const markerRef = React.createRef();

    markerRef.current = new mapboxgl.Marker()
      .setLngLat([coordinate.longitude, coordinate.latitude])
      .addTo(map);

    map.on('click', (e) => {
      const clickedCoordinate = {
        latitude: e.lngLat.wrap().lat,
        longitude: e.lngLat.wrap().lng
      };
      setCoordinate(clickedCoordinate);
      if (markerRef.current) {
        markerRef.current.remove();
      }
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([clickedCoordinate.longitude, clickedCoordinate.latitude])
        .addTo(map);
    });
    return () => {
      map.remove();
    };
  }, [isUpdating]);
  return (
    <Box>
      <Box className="map-form-container" ref={mapContainerRef} />
    </Box>
  );
};

export default MapForm;