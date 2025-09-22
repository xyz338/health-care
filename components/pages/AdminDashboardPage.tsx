import React, { useState, useEffect, useCallback } from 'react';
import { Doctor } from '../../types';
import { mockGetAllDoctors, mockApproveDoctor, mockRemoveDoctor } from '../../services/mockApiService';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import Button from '../ui/Button';

const AdminDashboardPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await mockGetAllDoctors();
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

  const handleApprove = async (doctorId: string) => {
    setProcessingId(doctorId);
    try {
      await mockApproveDoctor(doctorId);
      setDoctors(prev =>
        prev.map(d => (d.id === doctorId ? { ...d, approved: true } : d))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to approve doctor.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (doctorId: string) => {
    if (window.confirm('Are you sure you want to remove this doctor?')) {
      setProcessingId(doctorId);
      try {
        await mockRemoveDoctor(doctorId);
        setDoctors(prev => prev.filter(d => d.id !== doctorId));
      } catch (err: any) {
        setError(err.message || 'Failed to remove doctor.');
      } finally {
        setProcessingId(null);
      }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Manage Doctors</h2>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {isLoading ? (
        <div className="flex justify-center mt-16"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {doctor.approved ? 
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span> :
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {!doctor.approved && (
                      <Button variant="success" size="sm" onClick={() => handleApprove(doctor.id)} isLoading={processingId === doctor.id} disabled={!!processingId}>Approve</Button>
                    )}
                    <Button variant="danger" size="sm" onClick={() => handleRemove(doctor.id)} isLoading={processingId === doctor.id} disabled={!!processingId}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;