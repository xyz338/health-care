
import React, { useState } from 'react';
import { getSymptomAdvice } from '../services/geminiService';
import Button from './ui/Button';
import Alert from './ui/Alert';

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please describe your symptoms.');
      return;
    }
    setError('');
    setIsLoading(true);
    setAdvice('');
    try {
      const result = await getSymptomAdvice(symptoms);
      setAdvice(result);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-400">Describe your symptoms below to get AI-powered general information. This is not a substitute for professional medical advice.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., I have a headache and a slight fever..."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none"
          disabled={isLoading}
        />
        <Button type="submit" isLoading={isLoading} disabled={isLoading || !symptoms.trim()} className="w-full">
          Get Advice
        </Button>
      </form>
      {error && <Alert type="error" message={error} />}
      
      {advice && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-lg mb-2 text-blue-300">AI-Generated Information</h4>
            <div className="prose prose-invert prose-sm text-gray-300 whitespace-pre-wrap">
                {advice.split('\n').map((line, index) => (
                    <p key={index} className={line.includes('IMPORTANT:') ? 'font-bold text-yellow-300 mt-4' : ''}>
                        {line}
                    </p>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
