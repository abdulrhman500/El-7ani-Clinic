import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { useUserContext } from 'src/contexts/userContext';
import { axiosInstance } from '../../utils/axiosInstance';

import PrescriptionSummary from './prescription-summary';

export default function PrescriptionView({ patientID }) {
  const user = localStorage.getItem('userRole');
  console.log(user);

  const [patientName, setPatientName] = useState('');
  useEffect(() => {
    const fetchPatientName = async () => {
      try {
        const res = await axiosInstance.get(`/patients/${patientID}`);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPatientName();
  }, []);

  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        let res;
        if (user === 'Doctor') {
          res = await axiosInstance.get(`/patients/${patientID}/prescription`);
          setPrescriptions(res.data.prescriptions);
        } else {
          res = await axiosInstance.get(`/me/prescriptions`);
          setPrescriptions(res.data.result);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPrescriptions();
  }, []);

  console.log(prescriptions);

  const [newMedicines, setNewMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddPrescription = async () => {
    try {
      const body = {
        medicines: newMedicines,
        description: newDescription
      };
      await axiosInstance.post(`/patients/${patientID}/prescription`, body);
      console.log('Prescription added successfully');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMedicine = () => {
    const medicine = { medicine: newMedicine, dosage: newDosage };
    setNewMedicines([...newMedicines, medicine]);
    setNewMedicine('');
    setNewDosage('');
  };

  console.log(prescriptions);

  const [medicinesList, setMedicines] = useState([]);
  useEffect(() => {
    const getMedicines = async () => {
      try {
        const res = await axiosInstance.get(`/medicine`);
        setMedicines(res.data.result);
        console.log(medicinesList);
      } catch (err) {
        console.log(err);
      }
    };
    getMedicines();
  }, []);
  const medicinesListNames = medicinesList.map((medicine) => medicine.name);
  console.log(medicinesListNames);

  if (user !== 'Patient' && user !== 'Doctor')
    return (
      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 480,
            mx: 'auto',
            display: 'contents',
            minHeight: '80vh',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h3" sx={{ mb: 3 }}>
            Sorry, You aren't Authenticated!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            You have to be a Patient to view this page. Go to the registration Page and register to get access.
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/illustration_404.svg"
            sx={{
              margin: '0 auto',
              display: 'block',
              height: 260,
              my: { xs: 5, sm: 10 }
            }}
          />
        </Box>
      </Container>
    );
  return (
    <div>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Prescriptions
        </Typography>

        <Grid container spacing={3}>
          {prescriptions.map((prescription) => (
            <Grid item xs={12} md={6} lg={4} key={prescription._id}>
              <PrescriptionSummary
                prescriptionID={prescription._id}
                date={prescription.dateIssued.slice(0, 10)}
                doctorName={prescription.doctorID.name}
                patientName={prescription.patientID.name}
                description={prescription.description}
                medicines={prescription.medicines}
                isFilled={prescription.isFilled}
                isSubmitted={prescription.isSubmitted}
                medicinesListNames={medicinesListNames}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <br />
      <br />
      {user === 'Doctor' && (
        <div>
          <Typography variant="h6">Add Prescription for Patient</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="medicineInput">Medicine:</label>
              <select id="medicineInput" onChange={(event) => setNewMedicine(event.target.value)}>
                <option value="">Select Medicine</option>
                {medicinesListNames.map((medicineName, index) => (
                  <option key={index} value={medicineName}>
                    {medicineName}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="dosageInput">Dosage:</label>
              <input
                id="dosageInput"
                value={newDosage}
                onChange={(event) => setNewDosage(event.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <button
              onClick={handleAddMedicine}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#007bff',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Add Medicine
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="descriptionInput">Description:</label>
              <textarea
                id="descriptionInput"
                value={newDescription}
                onChange={(event) => setNewDescription(event.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
              />
            </div>
            <button
              onClick={handleAddPrescription}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#28a745',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Add Prescription
            </button>
          </Box>
        </div>
      )}
    </div>
  );
}