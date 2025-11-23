import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/db.js';
import {users, 
  franchisors, 
  franchiseListings, 
  investmentMetrics, 
  franchiseCategories, 
  listingHistory,
  documents as documentsTable
} from '../models/schema.js';
import { eq, count, sum, desc, and, ilike } from 'drizzle-orm';

const registerMitra = async (req, res) => {
  const {contactName, email, phoneNumber, password, listingName, bussinesCategory, companyName, agreedToTerms} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (!req.body) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    const existingUser = await db.select({email: users.email}).from(users).where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(409).json({
        status: 'fail',
        message: 'User already exist',
      });
    }

    const username = contactName.toLowerCase().replace(/\s+/g, '_');

    //insert data to table franchisors and users
    const result = await db.transaction(async (tx) => {
      const newUser = await tx.insert(users).values({
        name: contactName,
        username: username,
        email: email,
        passwordHash: hashedPassword,
        role: 'mitra',
      }).returning({userId: users.userId, email: users.email, role: users.role});

      const userId = newUser[0].userId;

      await tx.insert(franchisors).values({
        userId: userId,
        companyName: companyName,
        contactName: contactName,
        email: email,
        phoneNumber: phoneNumber,
        listingName: listingName,
        bussinesCategory: bussinesCategory,
        isVerified: false,
      });

      return newUser[0];
    });

    res.status(200).json({
      status: 'success',
      message: 'User registered successfully. Your account is awaiting verification by the Admin.',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const getMitraDashboardData = async (req, res) => {
    const userId = req.user.id; // Mitra ID

    try {
        const metrics = await db.select({
            totalViews: sum(franchiseListings.views).as('totalViews'),
            totalClicks: sum(franchiseListings.whatsappClicks).as('totalClicks'),
            totalListings: count(franchiseListings.listingId).as('totalListings')
        })
        .from(franchiseListings)
        .where(eq(franchiseListings.franchisorId, userId));

        const statusBreakdown = await db.select({
            status: franchiseListings.status,
            count: count(franchiseListings.listingId)
        })
        .from(franchiseListings)
        .where(eq(franchiseListings.franchisorId, userId))
        .groupBy(franchiseListings.status);

        res.status(200).json({
            status: 'success',
            data: {
                metrics: metrics[0],
                statusBreakdown: statusBreakdown,
            }
        });
    } catch (err) {
        console.error("Error fetching Mitra Dashboard:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const getMitraListings = async (req, res) => {
    const userId = req.user.id;

    try {
        const listings = await db.select({
            listingId: franchiseListings.listingId,
            listingName: franchiseListings.listingName,
            status: franchiseListings.status, 
            updatedAt: franchiseListings.updatedAt,
            views: franchiseListings.views,
        })
        .from(franchiseListings)
        .where(eq(franchiseListings.franchisorId, userId))
        .orderBy(desc(franchiseListings.updatedAt));

        res.status(200).json({
            status: 'success',
            count: listings.length,
            data: listings,
        });
    } catch (err) {
        console.error("Error fetching Mitra Listings:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const createListing = async (req, res) => {
    const userId = req.user.id;
    const { infoDasar, finansial, paketDukungan, documents, actionType } = req.body; 

    if (!infoDasar || !finansial || !infoDasar.name) {
        return res.status(400).json({ 
            status: 'fail', 
            message: 'Basic and Financial information are required.' 
        });
    }

    const initialStatus = (actionType === 'draft') ? 'draft' : 'pending_review';

    try {
        const existingListing = await db.select()
            .from(franchiseListings)
            .where(
                and(
                    eq(franchiseListings.franchisorId, userId),
                    ilike(franchiseListings.listingName, infoDasar.name)
                )
            )
            .limit(1);

        if (existingListing && existingListing.length > 0) {
            return res.status(409).json({
                status: 'fail',
                message: 'Listing with this name already exist',
            });
        }

        const newListing = await db.transaction(async (tx) => {
            const listing = await tx.insert(franchiseListings).values({
                franchisorId: userId,
                listingName: infoDasar.name,
                slogan: infoDasar.slogan,
                description: infoDasar.description,
                status: initialStatus, 
                location: infoDasar.location,
            }).returning({ listingId: franchiseListings.listingId });

            if (!listing || listing.length === 0 || !listing[0].listingId) {
                throw new Error('Failed to retrieve new listing id after creation');
            }

            const listingId = listing[0].listingId;

            await tx.insert(investmentMetrics).values({
                listingId: listingId,
                initialCapitalMin: finansial.modalMin,
                franchiseFee: finansial.fee,
                royaltyFeePercent: finansial.royalty,
                estimatedBepMonths: finansial.bep, 
            });

            if (infoDasar.categoryIds && infoDasar.categoryIds.length > 0) {
                const categoryInserts = infoDasar.categoryIds.map(catId => ({
                    listingId: listingId,
                    categoryId: catId,
                }));
                await tx.insert(franchiseCategories).values(categoryInserts);
            }
            
            await tx.insert(listingHistory).values({
                listingId: listingId,
                userId: userId, 
                oldStatus: 'draft',
                newStatus: initialStatus,
                reason: (actionType === 'draft') ? 'Saved as draft' : 'Submitted for verification',
            });

            if (documents && documents.length > 0) {
                const docs = documents;

                await tx.insert(documentsTable).values(docs.map(doc => ({
                    listingId: listingId,
                    documentType: doc.type,  
                    storageUrl: doc.url,
                })));
            }

            return listing[0];
        });

        res.status(201).json({
            status: 'success',
            message: `Listing saved with status: ${initialStatus}`,
            data: newListing,
        });

    } catch (err) {
        console.error("Error in createListing:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const getMitraListingDetail = async (req, res) => {
    const listingId = req.params.id;
    const userId = req.user.id;

    try {
        const detail = await db.query.franchiseListings.findFirst({
            where: and(
                eq(franchiseListings.listingId, listingId),
                eq(franchiseListings.franchisorId, userId) 
            ),
            with: {
                metrics: true,
                franchiseCategories: { with: { category: true } },
                packages: true, 
                documents: true, 
            },
        });

        if (!detail) {
            return res.status(404).json({ status: "fail", message: "Listing not found or access denied." });
        }

        res.status(200).json({ status: 'success', data: detail });

    } catch (err) {
        console.error("Error fetching Mitra listing detail:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const cleanUpdateObject = (data) => {
    if (!data) return {};
    const cleaned = {};
    for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
            cleaned[key] = data[key];
        }
    }
    return cleaned;
};

const updateListing = async (req, res) => {
    const listingId = req.params.id;
    const userId = req.user.id;
    const { infoDasar, finansial, actionType } = req.body; 
    
    const newStatus = (actionType === 'submit') ? 'pending_review' : 'draft';

    try {
        const listingRecord = await db.select({ 
            id: franchiseListings.listingId,
            currentStatus: franchiseListings.status 
        })
        .from(franchiseListings)
        .where(and(
            eq(franchiseListings.listingId, listingId), 
            eq(franchiseListings.franchisorId, userId)
        ))
        .limit(1);

        if (listingRecord.length === 0) {
            return res.status(403).json({ status: "fail", message: "Access denied. Listing not found or not owned." });
        }
        
        const oldStatus = listingRecord[0].currentStatus; 

        const baseListingData = {
            listingName: infoDasar?.name,
            slogan: infoDasar?.slogan,
            description: infoDasar?.description,
            location: infoDasar?.location,
        };
        const cleanedListingData = cleanUpdateObject(baseListingData);

        cleanedListingData.status = newStatus;
        cleanedListingData.updatedAt = new Date();

        const metricsUpdateData = cleanUpdateObject({
            initialCapitalMin: finansial?.modalMin,
            franchiseFee: finansial?.fee,
            royaltyFeePercent: finansial?.royalty,
            estimatedBepMonths: finansial?.bep,
        });

        await db.transaction(async (tx) => {
            await tx.update(franchiseListings).set(cleanedListingData)
                .where(eq(franchiseListings.listingId, listingId));
            
            if (Object.keys(metricsUpdateData).length > 0) {
                 await tx.update(investmentMetrics).set(metricsUpdateData)
                     .where(eq(investmentMetrics.listingId, listingId));
            }
            
            await tx.insert(listingHistory).values({
                listingId: listingId,
                userId: userId, 
                oldStatus: oldStatus, 
                newStatus: newStatus,
                reason: (actionType === 'submit') ? 
                    `Content updated and sent for re-verification (From ${oldStatus}).` : 
                    `Content updated and saved as draft (From ${oldStatus}).`,
            });
        });

        res.status(200).json({ status: 'success', message: `Listing updated. Status changed from ${oldStatus} to ${newStatus}.` });

    } catch (err) {
        console.error("Error updating listing:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export {
  registerMitra,
  getMitraDashboardData,
  getMitraListings,
  getMitraListingDetail,
  createListing,
  updateListing
};