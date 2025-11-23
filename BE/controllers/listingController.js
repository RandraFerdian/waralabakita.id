import { db } from '../db/db.js';
import {
  franchiseListings,
  franchisors,
  investmentMetrics,
  franchiseCategories,
  categories,
  media,
  favorites,
  reviews
} from "../models/schema.js";
import { eq, and, gt, lt, ilike, sql, inArray, asc, desc, or, count} from "drizzle-orm";

const getFilteredListing = async (req, res) => {
  try {
    const {
      q,
      modalMin,
      modalMax,
      categories: categoryParams,
      location,
      sort = "terbaru",
      limit = 24,
      page = 1,
    } = req.query;

    const limitInt = parseInt(limit);
    const offset = (parseInt(page) - 1) * limitInt;

    const categoryNames = categoryParams ? 
      Array.isArray(categoryParams)
        ? categoryParams
        : categoryParams.split(",").map((n) => n.trim()).filter(Boolean)
      : [];

    let categoryIds = [];

    if (categoryNames.length > 0) {
      const catRows = await db
        .select({ 
          id: categories.categoryId,
          name: categories.categoryName 
        })
        .from(categories)
        .where(
          or(
            ...categoryNames.map(name => 
              ilike(categories.categoryName, name)
            )
          )
        );

      categoryIds = catRows.map((c) => c.id);
      console.log("Category rows dari DB:", catRows);
    }

    console.log("Catetgory filter: ", categoryIds);
    const conditions = [eq(franchisors.isVerified, true)];

    if (q) conditions.push(ilike(franchiseListings.listingName, `%${q}%`));

    if (location) conditions.push(eq(franchiseListings.location, location));

    if (modalMin)
      conditions.push(
        gt(investmentMetrics.initialCapitalMax, parseInt(modalMin))
      );
    if (modalMax)
      conditions.push(
        lt(investmentMetrics.initialCapitalMin, parseInt(modalMax))
      );

    let orderByColumn;
    switch (sort) {
      case "terpopuler":
        orderByColumn = franchiseListings.views;
        break;
      case "modalTerendah":
        orderByColumn = investmentMetrics.initialCapitalMin;
        break;
      case "modalTertinggi":
        orderByColumn = investmentMetrics.initialCapitalMax;
        break;
      default:
        orderByColumn = franchiseListings.createdAt;
    }

    const orderDirection = sort === "modalTertinggi" ? desc(orderByColumn) : asc(orderByColumn);

    let listingQuery = db
      .select({
        listingId: franchiseListings.listingId,
        listingName: franchiseListings.listingName,
        slogan: franchiseListings.slogan,
        location: franchiseListings.location,
        status: franchiseListings.status,
        views: franchiseListings.views,
        franchiseFee: investmentMetrics.franchiseFee,
        initialCapitalMin: investmentMetrics.initialCapitalMin,
        initialCapitalMax: investmentMetrics.initialCapitalMax,
        isVerified: franchisors.isVerified,
      })
      .from(franchiseListings)
      .innerJoin(
        franchisors,
        eq(franchisors.userId, franchiseListings.franchisorId)
      )
      .innerJoin(
        investmentMetrics,
        eq(investmentMetrics.listingId, franchiseListings.listingId)
      );

    if (categoryNames.length > 0) {
      listingQuery = listingQuery
        .innerJoin(
          franchiseCategories,
          eq(franchiseCategories.listingId, franchiseListings.listingId)
        )
        .innerJoin(
          categories,
          eq(franchiseCategories.categoryId, categories.categoryId)
        )
        .where(
          and(
            inArray(categories.categoryId, categoryIds),
            ...conditions
          )
        )
        .groupBy(
          franchiseListings.listingId,
          franchiseListings.listingName,
          franchiseListings.slogan,
          franchiseListings.location,
          franchiseListings.status,
          franchiseListings.views,
          franchiseListings.createdAt, 
          investmentMetrics.franchiseFee,
          investmentMetrics.initialCapitalMin,
          investmentMetrics.initialCapitalMax,
          franchisors.isVerified
        );
    } else {
      listingQuery = listingQuery.where(and(...conditions));
    }

    const listings = await listingQuery
      .orderBy(orderDirection)
      .limit(limitInt)
      .offset(offset);

    res.status(200).json({
      status: "success",
      data: listings,
      page: parseInt(page),
      limit: limitInt,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getDetailWaralaba = async (req, res) => {
  const listingId = req.params.id;

  try {
    const detail = await db.query.franchiseListings.findFirst({
      where: eq(franchiseListings.listingId, listingId),
      with: {
        franchisor: true,
        metrics: true,
        media: true,
        reviews: {
          with: {
            user: {
              columns: {
                name: true,
                registrationDate: true,
              }
            }
          },
          orderBy: desc(reviews.createdAt),
        },
        packages: true,
        franchiseCategories: {
          with: { category: true },
        },
      },
    });

    if (!detail) {
      return res.status(404).json({
        status: "fail",
        message: "Listing not found",
      });
    }

    const favoriteCountResult = await db.select({
      count: count(favorites.listingId)
    })
    .from(favorites)
    .where(eq(favorites.listingId, listingId));

    const totalFavorites = favoriteCountResult[0].count;

    db.update(franchiseListings)
      .set({ views: sql`${franchiseListings.views} + 1` })
      .where(eq(franchiseListings.listingId, listingId))
      .execute();

    const finalDetail = {...detail, totalFavorites: totalFavorites};

    res.status(200).json({
      status: "success",
      data: finalDetail,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getFlashSaleListings = async  (req, res) => {
  try {
     const listings = await db.select({
      listingId: franchiseListings.listingId,
      listingName: franchiseListings.listingName,
      slogan: franchiseListings.slogan,
    })
    .from(franchiseListings)
    .innerJoin(franchisors, eq(franchisors.userId, franchiseListings.franchisorId))
    .where(eq(franchisors.isVerified, true))
    .orderBy(desc(franchiseListings.createdAt))
    .limit(5);

    res.status(200).json({
      status: 'success',
      data: listings,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const getRecommendedListings = async (req, res) => {
  const userId = req.user.id;
  let targetCategoryName = 'Makanan';
  let targetCategoryId;

  try {
    const userFavoritCategory = await db.select({
      categoryName: categories.categoryName,
      categoryId: categories.categoryId,
      count: count(favorites.listingId).as('favorite_count')
    })
    .from(favorites)
    .innerJoin(franchiseListings, eq(favorites.listingId, franchiseListings.listingId))
    .innerJoin(franchiseCategories, eq(franchiseCategories.listingId, franchiseListings.listingId))
    .innerJoin(categories, eq(franchiseCategories.categoryId, categories.categoryId))
    .where(eq(favorites.userId, userId)) 
    .groupBy(categories.categoryName, categories.categoryId)
    .orderBy(desc(sql`favorite_count`))
    .limit(1);

    if (userFavoritCategory.length > 0) {
      targetCategoryName = userFavoritCategory[0].categoryName;
      targetCategoryId = userFavoritCategory[0].categoryId;
    } else {
      //jika user belum punya riwayat, cari ID untuk kategori fallback (misal: 'Makanan & Minuman')
      const fallbackCat = await db.select({ id: categories.categoryId })
        .from(categories)
        .where(eq(categories.categoryName, targetCategoryName))
        .limit(1);
            
      if (fallbackCat.length > 0) {
        targetCategoryId = fallbackCat[0].id;
      } else {
        // Jika kategori fallback pun tidak ditemukan, hentikan proses
        return res.status(200).json({ 
          status: "success", 
          data: [] 
        });
      }
    }

    const thumbnailUrlSql = sql`
          COALESCE(
              (SELECT ${media.mediaUrl} 
               FROM ${media} 
               WHERE ${media.listingId} = ${franchiseListings.listingId} 
                 AND ${media.mediaType} = 'thumbnail'
               LIMIT 1), 
              NULL
          )
      `;

    const recommended = await db.select({
      listingId: franchiseListings.listingId,
      listingName: franchiseListings.listingName,
      slogan: franchiseListings.slogan,
      views: franchiseListings.views,
      initialCapitalMin: investmentMetrics.initialCapitalMin,
      isVerified: franchisors.isVerified,
      thumbnailUrl: thumbnailUrlSql.as('thumbnailUrl'),
    })
    .from(franchiseListings)
    .innerJoin(franchiseCategories, eq(franchiseCategories.listingId, franchiseListings.listingId))
    .innerJoin(investmentMetrics, eq(investmentMetrics.listingId, franchiseListings.listingId))
    .innerJoin(franchisors, eq(franchisors.userId, franchiseListings.franchisorId))
    .where(
      and(
        eq(franchisors.isVerified, true),
        eq(franchiseCategories.categoryId, targetCategoryId)
      )
    )
    .groupBy(
      franchiseListings.listingId,
      franchiseListings.listingName,
      franchiseListings.slogan,
      franchiseListings.views,
      investmentMetrics.initialCapitalMin,
      franchisors.isVerified,
      thumbnailUrlSql
    )
    .orderBy(desc(franchiseListings.views)).limit(10);

    const finalData = recommended.map(listing => ({
      ...listing,
      categoryName: targetCategoryName,
    }));

    res.status(200).json({
      status: 'success',
      data: finalData,
      targetCategoryName: targetCategoryName,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

export { getFilteredListing, getDetailWaralaba, getFlashSaleListings, getRecommendedListings };
