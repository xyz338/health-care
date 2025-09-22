import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { Role } from '../../types';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.Patient);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await auth.register(name, email, password, role);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} />}
          <Input label="Full Name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Register as a:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="role" value={Role.Patient} checked={role === Role.Patient} onChange={() => setRole(Role.Patient)} className="form-radio h-4 w-4 text-teal-600 bg-gray-200 border-gray-300 focus:ring-teal-500" />
                <span className="ml-2 text-gray-700">Patient</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="role" value={Role.Doctor} checked={role === Role.Doctor} onChange={() => setRole(Role.Doctor)} className="form-radio h-4 w-4 text-teal-600 bg-gray-200 border-gray-300 focus:ring-teal-500" />
                <span className="ml-2 text-gray-700">Doctor</span>
              </label>
            </div>
            {role === Role.Doctor && <p className="text-xs text-orange-600 mt-2">Note: Doctor accounts require admin approval before you can log in.</p>}
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Register
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
            Login here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;