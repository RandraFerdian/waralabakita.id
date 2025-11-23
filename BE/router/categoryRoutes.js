import express from 'express';
import getCategoriesList from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.get('/get-categories-list', getCategoriesList);

export default categoryRouter;