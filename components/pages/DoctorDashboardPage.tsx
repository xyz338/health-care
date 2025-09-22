import React, { useState, useEffect, useCallback } from 'react';
import { Appointment, AppointmentStatus } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockGetDoctorAppointments } from '../../services/mockApiService';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

const DoctorDashboardPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError('');
      const data = await mockGetDoctorAppointments(user.id);
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Scheduled: return 'text-green-600';
      case AppointmentStatus.Cancelled: return 'text-red-600';
      case AppointmentStatus.Completed: return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Doctor Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Your Appointments</h2>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {isLoading ? (
        <div className="flex justify-center mt-16"><Spinner /></div>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500">You have no appointments scheduled.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map(appt => (
            <Card key={appt.id}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gray-800">Patient: {appt.userName}</p>
                  <p className="text-gray-600">{new Date(appt.apptTime).toLocaleString()}</p>
                </div>
                <p className={`font-bold text-lg ${getStatusColor(appt.status)}`}>{appt.status}</p>
              </div>
              {appt.notes && <p className="mt-2 text-gray-500 italic">Notes: "{appt.notes}"</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardPage;