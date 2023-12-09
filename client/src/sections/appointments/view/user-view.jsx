import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, getComparator } from '../utils';
import { axiosInstance } from '../../../utils/axiosInstance';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('doctorID');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const myName = localStorage.getItem('userName');

  const [filterValues, setFilterValues] = useState({
    startDate: null,
    endDate: null,
    status: ''
  });

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const params = {};

      if (filterValues.startDate) params.startDate = new Date(filterValues.startDate).toISOString();
      if (filterValues.endDate) params.endDate = new Date(filterValues.endDate).toISOString();
      if (filterValues.status) params.status = filterValues.status;

      const response = axiosInstance
        .get('/me/appointments', { params })
        .then((res) => {
          setAppointments(res.data.result || []);
        })
        .catch((err) => {
          setOpenSnackbar(true);
          setMessage(err.response?.data.message || 'Network error');
        });
    };

    fetchAppointments();
  }, [filterValues]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = appointments.map((n) => n.doctorID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleGetUpcomingAppointments = async () => {
    try {
      const response = await axiosInstance.get('/me/appointments?status=Upcoming');
      setAppointments(response.data.result);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };

  const handleGetPastAppointments = async () => {
    try {
      const response = await axiosInstance.get('/me/appointments?status=Completed');
      setAppointments(response.data.result);
    } catch (error) {
      console.error('Error fetching past appointments:', error);
    }
  };

  const handleGetAllAppointments = async () => {
    try {
      const response = await axiosInstance.get('/me/appointments');
      setAppointments(response.data.result);
    } catch (error) {
      console.error('Error fetching all appointments:', error);
    }
  };

  const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilters = () => {
    fetchAppointments();
    handleFilterClose();
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Appointments</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleGetAllAppointments}
        >
          Get All Appointments
        </Button>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleGetPastAppointments}
        >
          Get Past Appointments
        </Button>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleGetUpcomingAppointments}
        >
          Get Upcoming Appointments
        </Button>

        <Button variant="contained" color="primary" onClick={handleFilterButtonClick}>
          Filter
        </Button>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <Box p={2} style={{ width: '300px' }}>
            <TextField
              id="startDate"
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              onChange={(e) => setFilterValues({ ...filterValues, startDate: e.target.value })}
              value={filterValues.startDate || ''}
            />
            {filterValues.startDate && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => setFilterValues({ ...filterValues, startDate: null })}
                sx={{ mt: 1 }}
              >
                Clear Start Date
              </Button>
            )}
            <TextField
              id="endDate"
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              onChange={(e) => setFilterValues({ ...filterValues, endDate: e.target.value })}
              value={filterValues.endDate || ''}
            />
            {filterValues.endDate && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => setFilterValues({ ...filterValues, endDate: null })}
                sx={{ mt: 1 }}
              >
                Clear End Date
              </Button>
            )}
            <Autocomplete
              options={['Upcoming', 'Completed', 'Cancelled', 'Pending']}
              renderInput={(params) => <TextField {...params} label="Status" fullWidth margin="normal" />}
              onChange={(e, value) => setFilterValues({ ...filterValues, status: value })}
              value={filterValues.status || ''}
            />
          </Box>
        </Popover>
      </Stack>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={appointments.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'patientName', label: "Doctor's Name" },
                  { id: 'doctorName', label: "Patient's Name" },
                  { id: 'status', label: 'Status' },
                  { id: 'sessionPrice', label: 'Session Price' },
                  { id: 'day', label: 'Day' },
                  { id: 'startDate', label: 'Start time' },
                  { id: 'endDate', label: 'End time' },
                  { id: 'isFollowUp', label: 'Is Follow up' },
                  { id: '' }
                ]}
              />
              <TableBody>
                {appointments
                  .toReversed()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    let startDate = new Date(row.startDate);
                    startDate.setHours(startDate.getHours() - 2);
                    const from = startDate.toTimeString().slice(0, 5);

                    let endDate = new Date(row.endDate);
                    endDate.setHours(endDate.getHours() - 2);
                    const to = endDate.toTimeString().slice(0, 5);

                    const day = startDate.toDateString();

                    return (
                      <UserTableRow
                        key={row._id}
                        _id={row._id}
                        patientName={row.patientName == myName ? 'Me' : row.patientName}
                        doctorID={row.doctorID._id}
                        doctorName={row.doctorName == myName ? 'Me' : row.doctorName}
                        status={row.status}
                        sessionPrice={row.sessionPrice}
                        day={day}
                        startDate={from}
                        endDate={to}
                        isFollowUp={row.isFollowUp}
                        selected={selected.indexOf(row._id) !== -1}
                        setMessage={setMessage}
                        setOpenSnackbar={setOpenSnackbar}
                      />
                    );
                  })}

                {appointments.length == 0 && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={appointments.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackBar} message={message} />
    </Container>
  );
}
