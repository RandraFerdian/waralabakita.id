import supabase from "../db/supabase.js";
import { documents, media } from "../models/schema.js"; 
import { eq, and } from "drizzle-orm";
import {db} from '../db/db.js';
import { randomUUID } from "crypto";

const BUCKET_PRIVAT = 'verification-docs'; 
const BUCKET_PUBLIC = 'public-assets';

export const uploadListingFiles = async (req, res) => {
    const listingId = req.params.id; 
    const userId = req.user.id;
    const uploadedFiles = req.files; 
    
    const uploadType = req.body.uploadType; 

    if (!uploadType || !['document', 'public_media'].includes(uploadType)) {
        return res.status(400).json({ status: "fail", message: "Missing or invalid uploadType (must be 'document' or 'public_media')." });
    }

    if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
        return res.status(400).json({ status: 'fail', message: 'No files provided for upload.' });
    }

    const insertedRecords = [];

    try {
        await db.transaction(async (tx) => {
            
            if (uploadType === 'document') {
                for (const fieldName in uploadedFiles) {
                    const fileArray = uploadedFiles[fieldName];
                    if (!fileArray || fileArray.length === 0) continue; 

                    for (const file of fileArray) {
                        const documentType = fieldName.toUpperCase(); 
                        const ext = file.originalname.split('.').pop();
                        const storagePath = `${userId}/${listingId}/doc_${documentType}_${Date.now()}.${ext}`;

                        const { data: storageData, error: storageError } = await supabase.storage
                            .from(BUCKET_PRIVAT) 
                            .upload(storagePath, file.buffer, { contentType: file.mimetype });

                        if (storageError) throw new Error(`Upload Privat failed for ${documentType}: ${storageError.message}`);

                        const newDoc = await tx.insert(documents).values({
                            listingId: listingId,
                            documentType: documentType,
                            storageUrl: storageData.path, 
                        }).returning();

                        insertedRecords.push(newDoc[0]);
                    }
                }
            
            } else if (uploadType === 'public_media') {
                const galleryFiles = uploadedFiles.gallery_photos || []; 
                if (galleryFiles.length === 0) return; 

                for (const file of galleryFiles) {
                    const ext = file.originalname.split('.').pop();
                    const storagePath = `listings/${listingId}/gallery/${randomUUID()}.${ext}`;

                    const { data: storageData, error: storageError } = await supabase.storage
                        .from(BUCKET_PUBLIC) 
                        .upload(storagePath, file.buffer, { contentType: file.mimetype });

                    if (storageError) throw new Error(`Upload Publik failed: ${storageError.message}`);

                    const { data: publicUrlData } = supabase.storage
                        .from(BUCKET_PUBLIC)
                        .getPublicUrl(storageData.path);
                    
                    const newMedia = await tx.insert(media).values({
                        listingId: listingId,
                        mediaUrl: publicUrlData.publicUrl, 
                        mediaType: 'image',
                    }).returning();

                    insertedRecords.push(newMedia[0]);
                }
            }
        });

        res.status(200).json({
            status: 'success',
            message: `${insertedRecords.length} files processed successfully.`,
            data: insertedRecords
        });

    } catch (err) {
        console.error("Upload/Database Error:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};