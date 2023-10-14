import UserModel, { IPatient, IUserDocument, IDoctor } from '../models/user.model';
import { HttpError } from '../utils';
import StatusCodes from 'http-status-codes';
import mongoose, { Document } from 'mongoose';
import AppointmentModel from '../models/appointment.model';
const selectDoctor = async (doctorID: string) => {
  // Use Mongoose to find the doctor by ID
  const doctor = await UserModel.findById(doctorID);

  // Check if the doctor was found
  if (!doctor) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: 'No doctor with this ID',
      result: null
    };
  }

  return {
    status: StatusCodes.OK,
    message: 'Doctor selected successfully',
    result: doctor
  };
};

interface PatientQuery {
  name:
    | string
    | {
        first: string;
        middle: string;
        last: string;
      };
}
//this method takes the doctor id and the req.query
const getPatients = async (doctorID: string, query: PatientQuery) => {
  //get patients that have appointments with this doctor
  if (query.name && typeof query.name === 'string') {
    // Convert the string name query into an object with first, middle, and last properties
    const nameParts = query.name.split(' ');
    query.name = {
      first: nameParts[0] || '',
      middle: nameParts[1] || '',
      last: nameParts[2] || ''
    };
    // console.log(query);
    const patients = await AppointmentModel.find({ doctorID }).select('patientID');
    const IDs: mongoose.Schema.Types.ObjectId[] = [];
    patients.forEach((patient) => {
      IDs.push(patient.patientID);
    });
    // console.log(IDs);
    const filteredPatients = await UserModel.find({ _id: { $in: IDs }, name: query.name });
    // console.log(filteredPatients);
    return {
      status: StatusCodes.OK,
      message: 'Patients retrieved successfully',
      result: filteredPatients
    };
  }

  const patients = await AppointmentModel.find({ doctorID }).find(query).select('patientID').populate('patientID');

  if (!patients) {
    return new HttpError(StatusCodes.NOT_FOUND, 'No patients with this doctor');
  }
  return {
    status: StatusCodes.OK,
    message: 'Patients retrieved successfully',
    result: patients
  };
};

//select a patient from the list of patients
const selectPatient = async (doctorID: string, patientID: string) => {
  //get patient that have appointments with this doctor and matches the patient id
  const patient = await AppointmentModel.find({ doctorID, patientID }).select('patientID').populate('patientID');
  //check if there is no patient with this id throw an error
  if (!patient) {
    return new HttpError(StatusCodes.NOT_FOUND, 'No patient with this ID');
  }
  return {
    status: StatusCodes.OK,
    message: 'Patient selected successfully',
    result: patient
  };
};

// const getDoctorDetails = async (doctorID: string) => {
//   try {
//     // Fetch the specific doctor by ID
//     const doctor = await UserModel.findOne({ _id: doctorID });

//     if (!doctor) {
//       return {
//         status: StatusCodes.NOT_FOUND,
//         message: 'Doctor not found',
//         result: null,
//       };
//     }

//     // Return the doctor's details
//     return {
//       status: StatusCodes.OK,
//       message: 'Doctor details',
//       result: {
//         name: doctor.name,
//         hourRate: doctor.hourRate,
//         hospital: doctor.hospital,
//         educationBackground: doctor.educationBackground,
//         specialty: doctor.specialty,
//       },
//     };
//   } catch (error) {
//     return {
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: 'Error while fetching doctor details',
//       result: null,
//     };
//   }
// };

////////////////////////////////////////////////
const getAllDoctor = async (doctorName?: string, specialty?: string, date?: Date) => {
  try {
    let nameFilter = doctorName ? getNameFilter(doctorName) : null;
    let specialtyFilter = specialty ? { specialty: specialty.trim().toLowerCase() } : null;
    let dateFilter = date ? getDateFilter(date) : null;
    let filter = { role: 'Doctor' };
    if (nameFilter) {
      filter = { ...filter, ...nameFilter };
    }
    if (specialty) {
      filter = { ...filter, ...specialtyFilter };
    }
    if (date) {
      filter = { ...filter, ...dateFilter };
    }
    // TODO spread operation (...) uses shallow clone a deep clone may be considered
    const doctors = await UserModel.find(filter, {
      name: 1,
      specialty: 1,
      weeklySlots: 1,
      hourRate: 1,
      hospital: 1,
      vacations: 1,
      gender: 1,
      phone: 1,
      addresses: 1,
      profileImage: 1,
      _id: 1
    }).populate({ path: 'contract', select: 'markUpProfit' });
    interface temp {
      markUpProfit: number;
    }
    return { result: doctors as (IDoctor & Document & temp)[] };
  } catch (error) {
    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error happened while retrieving Doctors ');
  }
};
const getNameFilter = (doctorName: string): object | null => {
  const names = doctorName.trim().toLowerCase()?.split(' ');
  var nameFilter = null;
  if (names.length >= 3) {
    nameFilter = {
      'name.first': { $regex: names[0], $options: 'i' },
      'name.middle': { $regex: names[1], $options: 'i' },
      'name.last': { $regex: names[2], $options: 'i' }
    };
  } else if (names.length == 2) {
    nameFilter = {
      $or: [
        {
          $or: [
            { 'name.first': { $regex: names[0], $options: 'i' } },
            { 'name.middle': { $regex: names[1], $options: 'i' } }
          ]
        },
        {
          $or: [
            { 'name.first': { $regex: names[0], $options: 'i' } },
            { 'name.last': { $regex: names[1], $options: 'i' } }
          ]
        },
        {
          $or: [
            { 'name.middle': { $regex: names[0], $options: 'i' } },
            { 'name.last': { $regex: names[1], $options: 'i' } }
          ]
        }
      ]
    };
  } else if (names.length == 1) {
    nameFilter = [
      {
        $or: [
          { 'name.first': { $regex: names[0], $options: 'i' } },
          { 'name.middle': { $regex: names[0], $options: 'i' } },
          { 'name.last': { $regex: names[0], $options: 'i' } }
        ]
      }
    ];
  }

  return nameFilter;
};

const getDateFilter = (date: Date) => {
  let filter = null;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = daysOfWeek[date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes;
  filter = {
    $and: [
      { [`weeklySlots.${day}`]: { $exists: true } },
      {
        $or: [
          { [`weeklySlots.${day}.from.hours`]: { $lt: hours } },
          {
            $and: [
              { [`weeklySlots.${day}.from.hours`]: { $eq: hours } },
              { [`weeklySlots.${day}.from.minutes`]: { $lte: minutes } }
            ]
          }
        ]
      },
      {
        $or: [
          { [`weeklySlots.${day}.to.hours`]: { $gt: hours } },
          {
            $and: [
              { [`weeklySlots.${day}.to.hours`]: { $eq: hours } },
              { [`weeklySlots.${day}.to.minutes`]: { $gte: minutes } }
            ]
          }
        ]
      }
    ]
  };

  return filter;
};
export { getAllDoctor, getPatients, selectPatient };