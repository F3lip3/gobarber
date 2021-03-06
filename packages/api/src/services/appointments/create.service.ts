import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '@errors/app.error';
import Appointment from '@models/appointment.model';
import AppointmentsRepository from '@repositories/appointments.repository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);
    const appointmentBooked = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (appointmentBooked) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
