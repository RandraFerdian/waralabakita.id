import { db } from '../db/db.js';
import { franchiseListings, franchisors, listingHistory, users, documents } from '../models/schema.js';
import { eq, asc, desc, inArray } from 'drizzle-orm';

const getPendingListings = async (req, res) => {
    try {
        const pendingList = await db.select({
            listingId: franchiseListings.listingId,
            listingName: franchiseListings.listingName,
            companyName: franchisors.companyName,
            submissionDate: franchiseListings.createdAt,
        })
        .from(franchiseListings)
        .innerJoin(franchisors, eq(franchisors.userId, franchiseListings.franchisorId))
        .where(eq(franchiseListings.status, 'pending_review'))
        .orderBy(asc(franchiseListings.createdAt)); 

        res.status(200).json({
            status: 'success',
            count: pendingList.length,
            data: pendingList,
        });
    } catch (err) {
        console.error("Error fetching pending listings:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const reviewListingDetail = async (req, res) => {
    const listingId = req.params.id;

    try {
        const detail = await db.query.franchiseListings.findFirst({
            where: eq(franchiseListings.listingId, listingId),
            with: {
                metrics: true,
                franchisor: true,
                documents: {
                    columns: {
                        documentType: true,
                        storageUrl: true, 
                        uploadedAt: true,
                    }
                },
            }
        });

        if (!detail) {
             return res.status(404).json({ status: "fail", message: "Listing not found" });
        }

        res.status(200).json({ status: 'success', data: detail });

    } catch (err) {
        console.error("Error fetching review detail:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const approveListing = async (req, res) => {
    const listingId = req.params.id;
    const adminId = req.user.id; 

    try {
        await db.transaction(async (tx) => {
            const result = await tx.update(franchiseListings)
                .set({ status: 'active' })
                .where(eq(franchiseListings.listingId, listingId)).returning();

            await tx.update(documents)
                .set({
                    isVerified: true,
                    updatedAt: new Date(),
                })
                .where(
                    eq(documents.listingId, listingId)
                );

            await tx.insert(listingHistory).values({
                listingId: listingId,
                userId: adminId,
                oldStatus: 'pending_review',
                newStatus: 'active',
                reason: 'Approved by Admin',
            });
            
            res.status(200).json({ 
                status: 'success', 
                message: 'Listing approved and published.', 
                data: result[0] 
            });
        });
    } catch (err) {
        console.error("Error approving listing:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const usersList = await db.select({
            id: users.userId,
            name: users.name,
            username: users.username,
            email: users.email,
            role: users.role,
            isSuspended: users.isSuspended,
            isActive: users.isActive,
            registrationDate: users.registrationDate,
        })
        .from(users)
        .orderBy(desc(users.registrationDate));

        res.status(200).json({ status: 'success', count: usersList.length, data: usersList });

    } catch (err) {
        return res.status(500).json({ 
            status: 'error', 
            message: err.message 
        });
    }
};

const suspendUser = async (req, res) => {
    const targetUserId = req.params.id;
    const { reason, status } = req.body; 
    const adminId = req.user.id; 

    try {
        await db.update(users)
            .set({ 
                isSuspended: status, 
                isActive: !status,
                updatedAt: new Date()
            })
            .where(eq(users.userId, targetUserId));
        
        const action = status ? "suspended" : "unsuspended";

        const nameOfUser = await db.select({
            name: users.name
        })
        .from(users)
        .where(eq(users.userId, targetUserId));

        const userName = nameOfUser.length > 0 ? nameOfUser[0].name : targetUserId;

        res.status(200).json({ 
            status: 'success', 
            message: `${userName} has been ${action} successfully. Reason: ${reason}` 
        });

    } catch (err) {
        console.error("Error suspending user:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

const rejectListing = async (req, res) => {
    const listingId = req.params.id;
    const adminId = req.user.id;
    const { reason } = req.body; 
    if (!reason) {
        return res.status(400).json({ 
            status: 'fail', 
            message: 'Rejection reason is required to maintain accountability.' 
        });
    }

    try {
        await db.transaction(async (tx) => {
            await tx.update(franchiseListings)
                .set({ status: 'rejected' })
                .where(eq(franchiseListings.listingId, listingId));

            await tx.insert(listingHistory).values({
                listingId: listingId,
                userId: adminId,
                oldStatus: 'pending_review', 
                newStatus: 'rejected',
                reason: reason, 
            });
        });

        res.status(200).json({ 
            status: 'success', 
            message: 'Listing rejected. The owner will be notified with the reason.' 
        });

    } catch (err) {
        console.error("Error rejecting listing:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export {getPendingListings, reviewListingDetail, approveListing, getUsers, suspendUser, rejectListing};