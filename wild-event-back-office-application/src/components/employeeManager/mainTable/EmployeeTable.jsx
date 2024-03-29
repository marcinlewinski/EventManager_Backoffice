import React, { useState } from 'react';
import AddEmployeeDialog from '../dialogs/AddEmployeeDialog';
import EditEmployeeDialog from '../dialogs/EditEmployeeDialog';
import UserActionsMenu from '../menu/UserActionsMenu';
import RoleFilter from '../filters/RoleFilter';
import LocationFilter from '../filters/LocationFilter';
import SearchBar from '../searchbar/SearchBar';
import ConfirmationDialog from '../dialogs/ConfirmationDialog';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Button } from '@mui/material';
import { useRoles } from '../../../services/providers/RolesProvider';
import { useLocations } from '../../../services/providers/LocationsProvider';
import { useEmployees } from '../../../services/providers/EmployeeProvider';
import Skeleton from '@mui/material/Skeleton';
import { usePubNub } from 'pubnub-react';
import { deactivateUserFromPubNub } from '../../chat/service/pubNubService';
import { useUser } from "../../../services/providers/LoggedUserProvider"
import { deactivateUser } from '../../../services/api/EmployeeManagement';

const EmployeeTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [dialogState, setDialogState] = useState({ add: false, edit: false, confirm: false });
    const [pickedUser, setPickedUser] = useState(null);
    const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '', severity: 'success' });
    const { roles } = useRoles();
    const { locations } = useLocations();
    const { employees, deactivateEmployee } = useEmployees();
    const pubnub = usePubNub();
    const isLoading = !roles || !locations || !employees;
    const { user, token } = useUser();
    const [isLoadingBTN, setIsLoadingBTN] = useState(false);

    const handleDeactivateUser = async () => {
        try {
            setIsLoadingBTN(true);
            await deactivateEmployee(pickedUser.id)
            await deactivateUser(pickedUser.id, token);
            deactivateUserFromPubNub(pubnub, pickedUser.id);
        } catch (error) {
            console.error(error);
        } finally {
            toggleDialog('confirm', false);
            setIsLoadingBTN(false);
            setSnackbarInfo({ open: true, message: 'Employee has been deactivated!', severity: 'success' });
        }
    };

    const handleEditUser = (userId) => {
        const employee = employees.find(u => u.id === userId);
        setPickedUser(employee);
        toggleDialog('edit', true);
    }

    const handleCloseAdd = (wasCancelled, newUser) => {
        if (wasCancelled) {
            toggleDialog('add', false);
            return;
        }
        if (newUser) {
            setSnackbarInfo({ open: true, message: 'Employee has been added! Ask him to check his email to end registration process.', severity: 'success' });
        }
        toggleDialog('add', false);
    };

    const handleCloseEdit = (wasCancelled, updatedUser) => {
        if (wasCancelled) {
            toggleDialog('edit', false);
            return;
        }

        if (updatedUser) {
            setSnackbarInfo({ open: true, message: 'Employee has been edited!', severity: 'info' });
        }

        toggleDialog('edit', false);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarInfo(prev => ({
            ...prev,
            open: false
        }));
    };

    const toggleDialog = (type, isOpen) => {
        setDialogState({
            ...dialogState,
            [type]: isOpen
        });
    };

    return (
        <div>
            <SearchBar setSearchTerm={setSearchTerm} />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Employee</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Email</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Phone</TableCell>
                            <TableCell align="center">
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ marginRight: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>Location</span>
                                    <LocationFilter style={{ fontWeight: 'bold', fontSize: '1.1rem' }} allLocations={locations} onLocationSelect={setSelectedLocation} />
                                </div>
                            </TableCell>
                            <TableCell align="center">
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ marginRight: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>Role</span>
                                    <RoleFilter style={{ fontWeight: 'bold', fontSize: '1.1rem' }} allRoles={roles} onRoleSelect={setSelectedRole} />
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(isLoading || employees.length === 0) ? (
                            Array.from(new Array(rowsPerPage)).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Skeleton variant="text" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            (rowsPerPage > 0
                                ? employees.filter(user => {
                                    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                        (selectedRole === "" || user.roles.includes(selectedRole)) &&
                                        (selectedLocation === "" || user.locations.includes(selectedLocation));
                                }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : employees.filter(user => {
                                    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                        (selectedRole === "" || user.roles.includes(selectedRole)) &&
                                        (selectedLocation === "" || user.locations.includes(selectedLocation));
                                })
                            ).map((userElement) => (
                                <TableRow key={userElement.id}>
                                    <TableCell component="th" scope="row">
                                        {userElement.name}
                                    </TableCell>
                                    <TableCell align="center">{userElement.email}</TableCell>
                                    <TableCell align="center">{userElement.phone}</TableCell>
                                    <TableCell align="center">
                                        {Array.isArray(userElement.locations) ? userElement.locations.join(', ') : userElement.locations}
                                    </TableCell>
                                    <TableCell align="center">
                                        {Array.isArray(userElement.roles) ? userElement.roles.join(', ') : userElement.roles}
                                    </TableCell>
                                    <TableCell align="center">
                                        <UserActionsMenu
                                            onEdit={() => {
                                                handleEditUser(userElement.id);
                                            }}
                                            onDisabled={userElement.id === user.id}
                                            onDeactivate={() => {
                                                setPickedUser(userElement);
                                                toggleDialog('confirm', true);
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={7}
                                count={employees.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <Button variant="contained" color="primary" onClick={() => toggleDialog('add', true)}>
                Add New Employee
            </Button>
            <AddEmployeeDialog open={dialogState.add} handleClose={handleCloseAdd} allRoles={roles} allLocations={locations} />
            <ConfirmationDialog isLoading={isLoadingBTN} open={dialogState.confirm} handleClose={() => toggleDialog('confirm', false)} handleConfirm={handleDeactivateUser} />
            <EditEmployeeDialog open={dialogState.edit} handleClose={handleCloseEdit} allRoles={roles} allLocations={locations} userToEdit={pickedUser} />
            <Snackbar open={snackbarInfo.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} elevation={6} variant="filled">
                    {snackbarInfo.message}
                </MuiAlert>
            </Snackbar>
        </div>
    );

}

export default EmployeeTable;
