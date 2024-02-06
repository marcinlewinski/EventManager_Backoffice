import React, { useEffect, useState, useRef } from "react";
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { saveMap } from "../../../services/api/MapService";
import { Box, Button } from "@mui/material";
import Marker from "./Marker"
import './Map.css'
import MapDialog from "../dialog/MapDialog";
import { useUser } from "../../../services/providers/LoggedUserProvider";

const Map = ({ mapLocations }) => {
  const { token } = useUser();
  const [mapData, setMap] = useState(mapLocations);
  const [mapSave, setMapSave] = useState(mapData);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const mapContainerRef = useRef(null);
  mapboxgl.accessToken = `${process.env.REACT_APP_API_KEY}`;

  useEffect(() => {
    if (mapLocations) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [mapData.coordinate.longitude, mapData.coordinate.latitude],
        zoom: mapData.zoom,
        bearing: mapData.bearing
      }, []);
      mapData.locations.forEach((location, index) => {
        const markerPopup = new mapboxgl.Popup({ offset: [0, -15] })
          .setHTML(`<h5>${location.title}</h5>`);

        const ref = React.createRef();
        ref.current = document.createElement('div');
        createRoot(ref.current).render(<Marker feature={location} index={index + 1} />);
        new mapboxgl.Marker(ref.current)
          .setLngLat([location.coordinateDTO.longitude, location.coordinateDTO.latitude])
          .setPopup(markerPopup)
          .addTo(map);

      });
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.on('move', () => {
        setMapSave({
          latitude: map.getCenter().lat,
          longitude: map.getCenter().lng,
          zoom: map.getZoom(),
          bearing: map.getBearing()
        })
      });
      return () => map.remove();

    }
  }, [mapLocations]);


  return <Box>
    <Button variant="contained" onClick={() => setConfirmDialogOpen(true)}>Save current map setting</Button>
    <Box className="map-container" ref={mapContainerRef} />
    <MapDialog
      open={confirmDialogOpen}
      handleClose={() => setConfirmDialogOpen(false)}
      handleConfirm={() => saveMap(token, mapSave)}
    />
  </Box>
    ;
};

export default Map;

