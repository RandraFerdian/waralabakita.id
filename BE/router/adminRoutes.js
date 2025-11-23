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
const roles = ['admin']; 

adminRouter.use(verifyToken, authorizeRoles(...roles)); 
adminRouter.get('/listings/pending', getPendingListings); 
adminRouter.get('/listings/review/:id', reviewListingDetail); 
adminRouter.post('/listings/:id/approve', approveListing); 
adminRouter.post('/listings/:id/reject', rejectListing); 
adminRouter.get('/users', getUsers); 
adminRouter.post('/users/:id/suspend', suspendUser); 

export default adminRouter;