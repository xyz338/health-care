import React, { useState, useEffect, useCallback } from 'react';
import { Appointment, AppointmentStatus } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockGetUserAppointments, mockCancelAppointment } from '../../services/mockApiService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  const { user } = useAuth();

  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError('');
      const data = await mockGetUserAppointments(user.id);
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

  const handleCancel = async (appointmentId: string) => {
    if (!user) return;
    setCancellingId(appointmentId);
    try {
      await mockCancelAppointment(appointmentId, user.id);
      setAppointments(prev => 
        prev.map(a => a.id === appointmentId ? { ...a, status: AppointmentStatus.Cancelled } : a)
      );
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

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
      <h1 className="text-4xl font-bold mb-8 text-center">My Appointments</h1>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {isLoading ? (
        <div className="flex justify-center mt-16"><Spinner /></div>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500">You have no appointments scheduled.</p>
      ) : (
        <div className="space-y-6">
          {appointments.map(appt => (
            <Card key={appt.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <p className="text-xl font-bold text-gray-800">Dr. {appt.doctorName}</p>
                <p className="text-gray-600">{appt.doctorSpecialty}</p>
              </div>
              <div>
                <p className="font-semibold">{new Date(appt.apptTime).toLocaleString()}</p>
                <p className={`font-bold ${getStatusColor(appt.status)}`}>{appt.status}</p>
              </div>
              <div className="flex justify-end">
                {appt.status === AppointmentStatus.Scheduled && (
                  <Button 
                    variant="danger" 
                    onClick={() => handleCancel(appt.id)}
                    isLoading={cancellingId === appt.id}
                    disabled={cancellingId !== null}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;