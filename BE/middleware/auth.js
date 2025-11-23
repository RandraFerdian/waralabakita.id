import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import {db} from '../db/db.js';
import { users } from '../models/schema.js';

dotenv.config();

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            status: 'fail',
            message: 'No token provided.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const payload = decoded.userId || decoded.id || decoded.user_id;

        if (!payload) {
            console.error('JWT paylaod missing user id claim: ', decoded);
            return res.status(403).json({
                status: 'fail',
                message: 'Token is valid but missing user id claim',
            });
        }

        const userData = await db.select()
            .from(users)
            .where(eq(users.userId, payload))
            .limit(1);

        if (userData.length === 0) {
            return res.status(401).json({
                status: 'fail',
                message: 'User not found.',
            });
        }

        const user = userData[0];

        if (user.isSuspended) {
            return res.status(403).json({
                status: 'fail',
                message: 'Your account is suspended. Contact support.',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                status: 'fail',
                message: 'Your account is inactive.',
            });
        }

        req.user = {
            id: payload,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (err) {
        return res.status(403).json({
            status: 'fail',
            message: 'Invalid or expired token',
            error: err.message,
        });
    }
};

const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { role } = req.user;

            if (!allowedRoles.includes(role)) {
                return res.status(403).json({
                    status: 'fail',
                    message: `Access denied: only [${allowedRoles.join(', ')}] allowed`,
                });
            }

            next()
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    }
}

export  {verifyToken, authorizeRoles};
