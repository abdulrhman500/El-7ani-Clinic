import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Select,
  Flex,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const DoctorPage = () => {
  const [doctorInfo, setDoctorInfo] = useState({
    email: "doctor@example.com",
    hourRate: 200,
    hospital: "ABC Hospital",
  });
  const [loading, setLoading] = useState(true);
  const [openPatientData, setOpenPatientData] = useState(false);

  const getPatients = async () => {
    return await fetch("http://localhost:3000/users/me/patient/");
  };

  const handleOpenModal = () => {
    setOpenPatientData(true);
  };

  const handleCloseModal = () => {
    setOpenPatientData(false);
  };

  useEffect(() => {
    fetch("http://localhost:3000/users/me/doctor/patient")
      .then((response) => response.json())
      .then((data) => setAppointments(data.result));
    getPatients()
      .then((response) => response.json())
      .then((data) => {
        setPatients(data.result);
        setFilteredPatients(data.result);
        console.log("patients = ", data);
      })
      .then(() => setLoading(false));
  }, []);

  const [patients, setPatients] = useState([]);

  const [appointments, setAppointments] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log("patients======", patients);
    const filtered = patients.filter(
      (patient) =>
        patient.patientID.name.first
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        patient.patientID.name.middle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        patient.patientID.name.last
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleSelectPatient = (patient) => {
    handleOpenModal();
    setSelectedPatient(patient);
    console.log("Selected patient:", patient);
  };

  const handleUpdateDoctorInfo = async (e) => {
    e.preventDefault();

    // const body = doctorInfo

    const response = await fetch("http://localhost:3000/users/me/info/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...doctorInfo, id: "652b076806c33a8bacfe8086" }),
    });

    if (response.ok) {
      // Logic to update doctor's information
      console.log("Updated doctor info:", doctorInfo);
    }
  };

  const handleRequestChange = (e) => {
    e.preventDefault();
    // Logic to submit request for change
    console.log("Requesting change:", doctorInfo);
  };
  // }
  const isUpcomingAppointment = (patientId) => {
    const date = new Date();
    console.log("date =========", date);
    console.log("patientID = ", patientId);
    console.log("Appointments ========", appointments);
    for (let i = 0; i < appointments.length; i++) {
      const appointment = appointments[i];
      if (
        new Date(appointment.startTime) > date &&
        appointment.patientID._id === patientId
      )
        return true;
    }
    return false;
  };

  const handleFilterAppointments = () => {
    const selectedFilter = document.getElementById("appointmentFilter").value;
    if (selectedFilter === "") {
      console.log("selected filter is none");
      setFilteredPatients(patients);
    } else {
      console.log("there is a filter");
      const filtered = patients.filter((patient) =>
        isUpcomingAppointment(patient.patientID.id)
      );
      setFilteredPatients(filtered);
    }
  };

  if (loading) return <>Loading...</>;
  else {
    //console.log("Filtered = ", filteredPatients[0].patientID);
    return (
      <>
        <Flex align="center" justify="space-between" bg="teal.500" p={4}>
          <Image alt="Logo" h={8} />
          <Text color="white" fontWeight="bold">
            Welcome, {/* {user.username} ({user.email}) */}
          </Text>
        </Flex>
        <Tabs my={4}>
          <TabList>
            <Tab>Profile</Tab>
            <Tab>Patients</Tab>
            <Tab>Request Change</Tab>
            <Tab>Appointments</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <form onSubmit={handleUpdateDoctorInfo}>
                <FormControl mb={4}>
                  <FormLabel>Email:</FormLabel>
                  <Input
                    type="email"
                    value={doctorInfo.email}
                    onChange={(e) =>
                      setDoctorInfo({ ...doctorInfo, email: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Hourly Rate:</FormLabel>
                  <Input
                    type="number"
                    value={doctorInfo.hourRate}
                    onChange={(e) =>
                      setDoctorInfo({ ...doctorInfo, hourRate: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Hospital Affiliation:</FormLabel>
                  <Input
                    value={doctorInfo.hospital}
                    onChange={(e) =>
                      setDoctorInfo({
                        ...doctorInfo,
                        hospitalAffiliation: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue">
                  Update
                </Button>
              </form>
            </TabPanel>

            <TabPanel>
              <Box mb={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="search" mb="0" mr={2}>
                    Search:
                  </FormLabel>
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={handleInputChange}
                  />

                  <Button ml={2} onClick={handleSearch}>
                    Search
                  </Button>
                </FormControl>
              </Box>

              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <Tr key={patient.id}>
                        <Td>{patient.patientID.name.first}</Td>
                        <Td>{patient.patientID.email}</Td>
                        <Td>{patient.patientID.phone}</Td>
                        <Td>
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleSelectPatient(patient)}
                          >
                            View Records
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={4}>
                        <Text>No patients found.</Text>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TabPanel>

            <TabPanel>
              <form onSubmit={handleRequestChange}>
                <FormControl mb={4}>
                  <FormLabel>Email:</FormLabel>
                  <Input
                    type="email"
                    value={doctorInfo.email}
                    onChange={(e) =>
                      setDoctorInfo({ ...doctorInfo, email: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Hourly Rate:</FormLabel>
                  <Input
                    type="number"
                    value={doctorInfo.hourRate}
                    onChange={(e) =>
                      setDoctorInfo({ ...doctorInfo, hourRate: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Hospital Affiliation:</FormLabel>
                  <Input
                    value={doctorInfo.hospitalAffiliation}
                    onChange={(e) =>
                      setDoctorInfo({
                        ...doctorInfo,
                        hospitalAffiliation: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue">
                  Request Change
                </Button>
              </form>
            </TabPanel>

            <TabPanel>
              <Box mb={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="appointmentFilter" mb="0" mr={2}>
                    Filter by Appointment Date:
                  </FormLabel>
                  <Input
                    type="date"
                    id="appointmentFilter"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />

                  <Button ml={2} onClick={handleFilterAppointments}>
                    Apply
                  </Button>
                </FormControl>
              </Box>

              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>email</Th>
                    <Th>Phone</Th>
                    <Th>Appointment Date</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {console.log(filteredPatients)}
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <Tr key={patient.patientID.id}>
                        <Td>{patient.patientID.name.first}</Td>
                        <Td>{patient.patientID.email}</Td>
                        <Td>{patient.patientID.phone}</Td>
                        <Td>{patient.patientID.startTime}</Td>
                        <Td>
                          {appointments
                            .filter(
                              (appointment) =>
                                appointment.patientId === patient.id
                            )
                            .map((appointment) => (
                              <div key={appointment.id}>{appointment.date}</div>
                            ))}
                        </Td>
                        <Td>
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleSelectPatient(patient)}
                          >
                            View Records
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5}>
                        <Text>No patients found.</Text>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {selectedPatient && (
          <Modal isOpen={openPatientData} onClose={handleCloseModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Box>{selectedPatient.patientID.name.first}</Box>
                <Box>{selectedPatient.patientID.name.middle}</Box>
                <Box>{selectedPatient.patientID.name.last}</Box>
                <Box>{selectedPatient.patientID.phone}</Box>
                <Box>{selectedPatient.patientID.email}</Box>
                <Box>{selectedPatient.patientID.gender}</Box>
                <Box>{selectedPatient.patientID.birthDate}</Box>
                <Box>{selectedPatient.patientID.emergencyContact[0].name}</Box>
              </ModalHeader>{" "}
              <ModalCloseButton />
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </>
    );
  }
};

export default DoctorPage;
