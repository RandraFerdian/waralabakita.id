import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {db} from '../db/db.js';
import {users} from '../models/schema.js';
import { eq, or } from 'drizzle-orm';

const register = async (req, res) => {
  const {name, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    } 

    const existingUser = await db.select({
      email: users.email,
    })
    .from(users)
    .where(or(
      eq(users.email, email),
    ));

    if (existingUser.length > 0) {
      if (existingUser.some(u => u.email === email)) {
        return res.status(409).json({
          status: 'fail',
          message: 'User already exist',
        });
      }
    }

    const newUser = await db.insert(users).values({
      name: name,
      email: email,
      passwordHash: hashedPassword,
      role: 'user',
    }).returning({
      uderId: users.userId,
      email: users.email,
      role: users.role,
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: newUser[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const login = async (req, res) => {
  const {email, password} = req.body;

  try {
     // cek user di database
      const result = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (result.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    const user = result[0];

    if (user.isSuspended) {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account has been suspended'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account is inactive'
      });
    }

    const passwordIsMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordIsMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Wrong password',
      });
    }

    const payload = {
      id: user.userId,
      username: user.username,
      role: user.role
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: '7d'
    });

    user.refreshToken = refreshToken;

    await db.update(users).set({
      refreshToken: refreshToken
    }).where(eq(users.userId, user.userId));

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successfully',
      userId: user.userId,
      role: user.role,
      accessToken: accessToken,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
}

export {register, login};