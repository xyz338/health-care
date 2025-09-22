import { Role, AppointmentStatus, User, Doctor, Appointment } from '../types';

// In-memory database
let users: (User | Doctor)[] = [
    { id: '1', name: 'Admin User', email: 'admin@health.com', role: Role.Admin },
    { id: '2', name: 'Patient Zero', email: 'patient@health.com', role: Role.Patient },
    { id: 'd1', name: 'Dr. Alice Wonderland', email: 'alice@health.com', role: Role.Doctor, specialty: 'Cardiology', fee: 250, approved: true, experience: 15 },
    { id: 'd2', name: 'Dr. Bob Builder', email: 'bob@health.com', role: Role.Doctor, specialty: 'Pediatrics', fee: 150, approved: true, experience: 12 },
    { id: 'd3', name: 'Dr. Carol Danvers', email: 'carol@health.com', role: Role.Doctor, specialty: 'Dermatology', fee: 200, approved: false, experience: 8 },
    { id: 'd4', name: 'Dr. David Banner', email: 'david@health.com', role: Role.Doctor, specialty: 'Neurology', fee: 300, approved: true, experience: 20 },
    { id: 'd5', name: 'Dr. Eleanor Arroway', email: 'eleanor@health.com', role: Role.Doctor, specialty: 'Oncology', fee: 275, approved: true, experience: 18 },
    { id: 'd6', name: 'Dr. Frank Poole', email: 'frank@health.com', role: Role.Doctor, specialty: 'Orthopedics', fee: 220, approved: true, experience: 9 },
    { id: 'd7', name: 'Dr. Grace Augustine', email: 'grace@health.com', role: Role.Doctor, specialty: 'General Practice', fee: 120, approved: false, experience: 5 },
];
let appointments: Appointment[] = [
    { id: 'a1', userId: '2', userName: 'Patient Zero', doctorId: 'd1', doctorName: 'Dr. Alice Wonderland', doctorSpecialty: 'Cardiology', apptTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), notes: 'Annual check-up', status: AppointmentStatus.Scheduled },
];
let nextUserId = 4;
let nextDoctorId = 8;
let nextAppointmentId = 2;

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Auth ---
export const mockLogin = async (email: string) => {
    await simulateDelay(500);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    if (user.role === Role.Doctor && !(user as Doctor).approved) {
        throw new Error('Doctor account not yet approved.');
    }
    return { token: `mock-token-for-${user.id}`, user };
};

export const mockRegister = async (name: string, email: string, role: Role) => {
    await simulateDelay(500);
    if (users.some(u => u.email === email)) throw new Error('Email already in use');
    
    let newUser;
    if (role === Role.Doctor) {
        newUser = { id: `d${nextDoctorId++}`, name, email, role, specialty: 'General', fee: 100, approved: false, experience: 1 };
    } else {
        newUser = { id: `${nextUserId++}`, name, email, role };
    }
    users.push(newUser);
    return newUser;
};

// --- Doctors ---
export const mockGetApprovedDoctors = async () => {
    await simulateDelay(500);
    return users.filter(u => u.role === Role.Doctor && (u as Doctor).approved) as Doctor[];
};

// --- Appointments ---
export const mockBookAppointment = async (userId: string, doctorId: string, apptTime: Date, notes: string) => {
    await simulateDelay(700);
    const user = users.find(u => u.id === userId);
    const doctor = users.find(d => d.id === doctorId) as Doctor;
    if (!user || !doctor) throw new Error('User or Doctor not found');

    const newAppointment: Appointment = {
        id: `a${nextAppointmentId++}`,
        userId,
        userName: user.name,
        doctorId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        apptTime,
        notes,
        status: AppointmentStatus.Scheduled
    };
    appointments.push(newAppointment);
    return newAppointment;
};

export const mockGetUserAppointments = async (userId: string) => {
    await simulateDelay(500);
    return appointments.filter(a => a.userId === userId).sort((a,b) => b.apptTime.getTime() - a.apptTime.getTime());
};

export const mockCancelAppointment = async (appointmentId: string, userId: string) => {
    await simulateDelay(300);
    const appointment = appointments.find(a => a.id === appointmentId && a.userId === userId);
    if (!appointment) throw new Error('Appointment not found or unauthorized');
    appointment.status = AppointmentStatus.Cancelled;
    return appointment;
};

// --- Doctor Dashboard ---
export const mockGetDoctorAppointments = async (doctorId: string) => {
    await simulateDelay(500);
    return appointments.filter(a => a.doctorId === doctorId).sort((a,b) => b.apptTime.getTime() - a.apptTime.getTime());
};

// --- Admin Dashboard ---
export const mockGetAllDoctors = async () => {
    await simulateDelay(500);
    return users.filter(u => u.role === Role.Doctor) as Doctor[];
};

export const mockApproveDoctor = async (doctorId: string) => {
    await simulateDelay(300);
    const doctor = users.find(u => u.id === doctorId && u.role === Role.Doctor) as Doctor;
    if (!doctor) throw new Error('Doctor not found');
    doctor.approved = true;
    return doctor;
};

export const mockRemoveDoctor = async (doctorId: string) => {
    await simulateDelay(300);
    users = users.filter(u => u.id !== doctorId);
    return { success: true };
};