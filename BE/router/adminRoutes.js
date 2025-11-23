import express from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';
import { 
    getPendingListings, 
    reviewListingDetail, 
    approveListing, 
    rejectListing, 
    getUsers, 
    suspendUser 
} from '../controllers/adminController.js'; 

const adminRouter = express.Router();
const roles = ['admin']; // Hanya Admin yang bisa mengakses ini

// Middleware Otorisasi diterapkan di sini untuk semua rute di bawah:
adminRouter.use(verifyToken, authorizeRoles(...roles)); 

// Antrian Verifikasi Listing (Tabel)
adminRouter.get('/listings/pending', getPendingListings); 

// Detail Listing dan Dokumen untuk Review Modal
adminRouter.get('/listings/review/:id', reviewListingDetail); 

// Aksi Keputusan Admin
adminRouter.post('/listings/:id/approve', approveListing); 
adminRouter.post('/listings/:id/reject', rejectListing); 

// Daftar semua User/Mitra
adminRouter.get('/users', getUsers); 

// Aksi Suspensi (PUT/POST untuk mengubah status isSuspended/isActive)
adminRouter.post('/users/:id/suspend', suspendUser); 

export default adminRouter;