import StatusCodes from 'http-status-codes';

import { Patient, Prescription } from '../models';
import { HttpError } from '../utils';

const getPrescriptions = async (query: Object) => {
  const presecription = await Prescription.find(query);
  if (!presecription) throw new HttpError(StatusCodes.NOT_FOUND, 'no presecription found');

  return {
    status: StatusCodes.OK,
    result: presecription
  };
};

const addPrescription = async (doctorID: string, patientID: string, body: any) => {
  const newPrescription = await Prescription.create({
    doctorID,
    patientID,
    medicines: body.medicines,
    description: body.description
  });
  if (!newPrescription) throw new HttpError(StatusCodes.BAD_REQUEST, 'failed to add prescription');
  return {
    newPrescription,
    status: StatusCodes.CREATED,
    result: 'prescription added'
  };
};

const getPatientPrescriptions = async (doctorID: string, patientID: string) => {
  const prescriptions = await Prescription.find({ doctorID, patientID });
  if (!prescriptions) throw new HttpError(StatusCodes.NOT_FOUND, 'no prescription found');
  return {
    prescriptions,
    status: StatusCodes.OK
  };
};

const updatePrescriptions = async (id: string, body: any) => {
  const prescription = await Prescription.findById(id);
  if (prescription?.isSubmitted) throw new HttpError(StatusCodes.BAD_REQUEST, 'prescription is already submitted');
  const updatedPrescription = await Prescription.findByIdAndUpdate(id, body, { new: true });
  if (!updatedPrescription) throw new HttpError(StatusCodes.BAD_REQUEST, 'failed to update prescription');
  return {
    updatedPrescription,
    status: StatusCodes.OK,
    result: 'prescription updated'
  };
};

const addMedicineToPrescription = async (id: string, body: any) => {
  const prescription = await Prescription.findById(id);
  if (prescription?.isSubmitted) throw new HttpError(StatusCodes.BAD_REQUEST, 'prescription is already submitted');
  let prescriptionMedicines = prescription?.medicines;
  prescriptionMedicines?.push(body.medicine);
  const updatedPrescription = await prescription?.updateOne({ medicines: prescriptionMedicines });
  if (!updatedPrescription) throw new HttpError(StatusCodes.BAD_REQUEST, 'failed to update prescription');
  return {
    updatedPrescription,
    status: StatusCodes.OK,
    result: 'prescription updated'
  };
};

const deleteMedicineFromPrescription = async (id: string, body: any) => {
  const prescription = await Prescription.findById(id);
  if (prescription?.isSubmitted) throw new HttpError(StatusCodes.BAD_REQUEST, 'prescription is already submitted');
  let prescriptionMedicines = prescription?.medicines;
  console.log(prescriptionMedicines);
  let updatedMedicines = prescriptionMedicines?.filter((medicine) => medicine?.medicine !== body.medicine);
  console.log(updatedMedicines);
  const updatedPrescription = await prescription?.updateOne({ medicines: updatedMedicines });
  if (!updatedPrescription) throw new HttpError(StatusCodes.BAD_REQUEST, 'failed to update prescription');
  return {
    updatedPrescription,
    status: StatusCodes.OK,
    result: 'prescription updated'
  };
};

const editDosage = async (id: string, body: any) => {
  const prescription = await Prescription.findById(id);
  //body has the dosage and medicine name
  let prescriptionMedicines = prescription?.medicines;
  prescriptionMedicines?.forEach((medicine) => {
    if (medicine?.medicine === body.medicine) {
      medicine.dosage = body.dosage;
    }
  });
  const updatedPrescription = await prescription?.updateOne({ medicines: prescriptionMedicines });
  if (!updatedPrescription) throw new HttpError(StatusCodes.BAD_REQUEST, 'failed to update prescription');
  return {
    updatedPrescription,
    status: StatusCodes.OK,
    result: 'prescription updated'
  };
};

export {
  getPrescriptions,
  addPrescription,
  getPatientPrescriptions,
  updatePrescriptions,
  addMedicineToPrescription,
  deleteMedicineFromPrescription,
  editDosage
};
