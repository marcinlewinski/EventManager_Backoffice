import React from "react";
import { Table,Button, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import LocationActionsMenu from './LocationActionsMenu';

export const LocationTableFields = ({ mapLocations, setUpdateDialogOpen, setUpdating, handleOpenDeleteDialog }) => {

    return (
        <>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>No</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Title</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            <Button variant="outlined" color="primary" size="large"
                                style={{ borderRadius: '50%', height: '60px', fontSize: '32px', lineHeight: '64px' }}
                                onClick={() => setUpdateDialogOpen(true)}>+</Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mapLocations.locations.map((location, index) => (
                        <TableRow key={location.id}>
                            <TableCell component="th" scope="row" >{index + 1}</TableCell>
                            <TableCell align="center">{location.title}</TableCell>
                            <TableCell align="center">
                                <LocationActionsMenu
                                    onEdit={() => setUpdating(location)}
                                    onDeactivate={() => handleOpenDeleteDialog(location.id)}
                                />
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}