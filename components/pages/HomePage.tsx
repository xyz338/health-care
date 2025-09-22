import React, { useState, useEffect, useCallback } from 'react';
import { Doctor, Role } from '../../types';
import { mockGetApprovedDoctors, mockBookAppointment } from '../../services/mockApiService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import Modal from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchDoctors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await mockGetApprovedDoctors();
      setDoctors(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch doctors.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleBookClick = (doctor: Doctor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== Role.Patient) {
      setBookingError("Only patients can book appointments.");
      setTimeout(() => setBookingError(''), 3000);
      return;
    }
    setBookingDoctor(doctor);
  };
  
  const handleConfirmBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookingDoctor || !user) return;

    const formData = new FormData(e.currentTarget);
    const apptTime = formData.get('apptTime') as string;
    const notes = formData.get('notes') as string;

    setIsBooking(true);
    setBookingError('');
    setBookingSuccess('');
    try {
      await mockBookAppointment(user.id, bookingDoctor.id, new Date(apptTime), notes);
      setBookingSuccess(`Appointment with ${bookingDoctor.name} confirmed!`);
      setTimeout(() => {
        setBookingDoctor(null);
        setBookingSuccess('');
      }, 2000);
    } catch (err: any) {
      setBookingError(err.message || "Failed to book appointment.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">Find Your Doctor</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Book an appointment with our top-rated specialists.</p>
      
      {error && <Alert type="error" message={error} />}

      {isLoading ? (
        <div className="flex justify-center mt-16"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map(doctor => (
            <Card key={doctor.id} className="flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
              <div>
                <h2 className="text-2xl font-bold text-teal-700">{doctor.name}</h2>
                <p className="text-teal-900 mb-2">{doctor.specialty}</p>
                <p className="text-gray-600">{doctor.experience} years of experience</p>
                <p className="text-gray-600">Fee: ${doctor.fee}</p>
              </div>
              <Button onClick={() => handleBookClick(doctor)} className="mt-4 w-full">
                Book Appointment
              </Button>
            </Card>
          ))}
        </div>
      )}
      
      {bookingError && <div className="fixed bottom-4 right-4 z-50"><Alert type="error" message={bookingError} onClose={() => setBookingError('')}/></div>}

      <Modal isOpen={!!bookingDoctor} onClose={() => setBookingDoctor(null)} title={`Book with ${bookingDoctor?.name}`}>
        <form onSubmit={handleConfirmBooking} className="space-y-4">
          <p className="text-gray-600">Specialty: {bookingDoctor?.specialty}</p>
          <div>
            <label htmlFor="apptTime" className="block text-sm font-medium text-gray-700 mb-1">Select Date & Time</label>
            <input type="datetime-local" id="apptTime" name="apptTime" required className="w-full px-3 py-2 bg-slate-200 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea id="notes" name="notes" rows={3} className="w-full px-3 py-2 bg-slate-200 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"></textarea>
          </div>
          {bookingError && <Alert type="error" message={bookingError} />}
          {bookingSuccess && <Alert type="success" message={bookingSuccess} />}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={() => setBookingDoctor(null)}>Cancel</Button>
            <Button type="submit" isLoading={isBooking}>Confirm Booking</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HomePage;