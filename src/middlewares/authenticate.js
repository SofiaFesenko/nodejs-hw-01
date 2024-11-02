import createHttpError from "http-errors"
import { SessionCollection } from "../db/models/session.js"
import { UserCollection } from "../db/models/user.js"

export const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization')

    if (!authHeader) {
        next(createHttpError(401, 'provide Authorization header'))
        return
    }

    const bearer = authHeader.split(' ')[0]
    const token = authHeader.split(' ')[1]

    if (bearer !== 'Bearer' || !token) {
        next(createHttpError(401, 'auth header should be of type Bearer'))
        return
    }

    const session = await SessionCollection.findOne({accessToken: token})

    if (!session) {
        next(createHttpError(401, 'session not found'))
        return
    }

    const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil)

    if (isAccessTokenExpired) {
        next(createHttpError(401, 'access token expired'))
    }

    const user = await UserCollection.findById(session.userId);

    if (!user) {
        next(createHttpError(401));
        return;
    }

    req.user = user;

    next();
}