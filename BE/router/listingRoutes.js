import express from 'express';
import { 
  getFilteredListing, 
  getDetailWaralaba, 
  getFlashSaleListings, 
  getRecommendedListings 
} from '../controllers/listingController.js';
import { toggleFavorite, getFavoriteListings } from '../controllers/favoriteController.js';
import {verifyToken}  from '../middleware/auth.js';

const listingRouter = express.Router();

listingRouter.get('/get-filtered-listing', getFilteredListing);
listingRouter.get('/flash-sale', getFlashSaleListings);
listingRouter.get('/recommended', verifyToken, getRecommendedListings);
listingRouter.get('/favorites', verifyToken, getFavoriteListings);
listingRouter.post('/favorites',verifyToken, toggleFavorite);
listingRouter.get('/:id', getDetailWaralaba);

export default listingRouter;