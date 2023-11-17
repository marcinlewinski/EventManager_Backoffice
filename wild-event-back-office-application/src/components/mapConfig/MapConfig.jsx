import React, { useState, useEffect } from "react"
import { Box, Grid } from "@mui/material"
import Map from './map/Map'
import LocationsEditList from "./locations/LocationsEditList";
import CircularProgress from '@mui/material/CircularProgress';
import { useMap } from "../../services/providers/MapProvider";
import Skeleton from '@mui/material/Skeleton';

export const MapConfig = () => {
    const { map, addLocationIntoMap, deleteLocationFromMap, updateLocationInMap } = useMap();
    const [mapKey, setMapKey] = useState(1);

    const update = () => {
        setMapKey(prevKey => prevKey + 1);
    };

    return (
        <Box sx={{ mt: '240px', ml: '0px' }}>
            <Box>
                {!map ? (
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box>
                                <LocationsEditList
                                    updateLocationInMap={updateLocationInMap}
                                    deleteLocationFromMap={deleteLocationFromMap}
                                    addLocationIntoMap={addLocationIntoMap}
                                    mapLocations={map}
                                    setLocations={() => update()}>
                                </LocationsEditList>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ width: '390px', height: '844px', marginTop: '0px' }}>
                                {map && Object.keys(map).length > 0 ? (
                                    <Map key={mapKey} mapLocations={map} />
                                ) : (
                                    <Skeleton variant="rectangular" width="80%" height="75%" />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Box>
    )
}