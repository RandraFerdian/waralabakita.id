import express from "express";
import {
    registerMitra,
    getMitraListings,
    getMitraListingDetail,
    createListing,
    updateListing,
    getMitraDashboardData
} from "../controllers/mitraController.js";
import { verifyToken, authorizeRoles } from '../middleware/auth.js';
import { documentUpload } from "../middleware/uploadMidleware.js";
import { uploadListingFiles } from "../controllers/uploadController.js";

const mitraRouter = express.Router();
const roles = ['mitra'];

mitraRouter.post('/register', registerMitra);
mitraRouter.get('/dashboard', verifyToken, authorizeRoles(...roles), getMitraDashboardData);
mitraRouter.get('/listings', verifyToken, authorizeRoles(...roles), getMitraListings);
mitraRouter.get('/listings/:id', verifyToken, authorizeRoles(...roles), getMitraListingDetail);
mitraRouter.post('/listings', verifyToken, authorizeRoles(...roles), createListing);
mitraRouter.put('/listings/:id', verifyToken, authorizeRoles(...roles), updateListing);
mitraRouter.post('/listings/:id/upload', verifyToken, authorizeRoles(...roles), documentUpload, uploadListingFiles );

export default mitraRouter;