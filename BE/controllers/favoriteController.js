import e from 'express';
import {db} from '../db/db.js';
import { favorites } from '../models/schema.js';
import {eq, and} from 'drizzle-orm';

const toggleFavorite = async (req, res) => {
  const userId = req.user.id;
  const {listingId} = req.body;

  try {
    const existingFavorite = await db.select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.listingId, listingId)))
      .limit(1);

    if (existingFavorite.length > 0) {
      await db.delete(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.listingId, listingId)));

      return res.status(200).json({
        status: 'success',
        message: 'Waralaba was removed from favorites',
      });
    } else {
      await db.insert(favorites).values({userId, listingId});

      return res.status(201).json({
        status: 'success',
        message: 'Waralaba was added to favorites',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const getFavoriteListings = async (req, res) => {
  const userId = req.user.id;

  try {
    const favoriteList = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      with: {
        listing: true,
      },
    });

    res.status(200).json({
      status: 'success',
      count: favoriteList.length,
      data: favoriteList.map(fav => fav.listing),  
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

export {toggleFavorite, getFavoriteListings};