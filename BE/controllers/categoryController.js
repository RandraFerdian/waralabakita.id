import {db} from '../db/db.js';
import { categories } from '../models/schema.js';

const getCategoriesList = async (req, res) => {
  try {
    const categoiresList = await db.select().from(categories);

    res.status(200).json({
      status: 'success',
      count: categoiresList.length,
      data: categoiresList,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

export default getCategoriesList;