import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { UserCollection } from '../db/models/user.js'
import createHttpError from 'http-errors'
import { SessionCollection } from '../db/models/session.js'
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { sendEmail } from '../utils/sendMail.js'
import { SMTP } from '../constants/index.js';

export const registerUser = async (payload) => {
    const user = await UserCollection.findOne({email: payload.email})
    if (user) throw createHttpError(409, 'email in use')

    const encryptedPassword = await bcrypt.hash(payload.password, 10)

    return await UserCollection.create({
        ...payload,
        password: encryptedPassword
    })
}

export const loginUser = async (payload) => {
    const user = await UserCollection.findOne({email: payload.email})

    if (!user) {
        throw createHttpError(404, 'User not found')
    }

    const isEqual = await bcrypt.compare(payload.password, user.password)

    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized')
    }

    await SessionCollection.deleteOne({userId: user._id});

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await SessionCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });
}

export const logoutUser = async (sessionId) => {
    await SessionCollection.deleteOne({_id: sessionId})
}

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64')
    const refreshToken = randomBytes(30).toString('base64')
  
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionCollection.findOne({
      _id: sessionId,
      refreshToken,
    });
  
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }
  
    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
  
    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }
    
    const newSession = createSession();
  
    await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
  
    return await SessionCollection.create({
      userId: session.userId,
      ...newSession,
    });
};

dotenv.config()
export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({email})

  if (!user) {
    throw createHttpError(404, 'user not found')
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m'
    }
  )

  await sendEmail({
    from: process.env[SMTP.SMTP_FROM],
    to: email,
    subject: 'reset password',
    html: `<p>click <a href="http://localhost:3000/auth/reset-password/?token=${resetToken}">here</a> to reset your password </p>`
  })
}

export const resetPassword = async (payload) => {
  let entries

  try {
    entries = jwt.verify(payload.token, process.env.JWT_SECRET)
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message)
      throw error
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub
  })

  if (!user) {
    throw createHttpError(404, 'user not found')
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10)

  await UserCollection.updateOne(
    {_id: user._id},
    {password: encryptedPassword}
  )
}