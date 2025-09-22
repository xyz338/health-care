import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Chatbot from '../Chatbot';
import { Doctor, User } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { mockGetApprovedDoctors } from '../../services/mockApiService';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch doctor data to provide context to the chatbot
    const fetchDoctors = async () => {
      try {
        const data = await mockGetApprovedDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctors for chatbot context:", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-100 transition-transform hover:scale-110 z-30"
        title="AI Health Assistant"
        aria-label="Open AI Health Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        doctors={doctors}
        user={user}
      />
    </div>
  );
};