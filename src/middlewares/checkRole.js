import createHttpError from "http-errors"
import { ROLES } from "../constants/index.js"
import { ContactsCollection } from "../db/models/contacts.js"

export const checkRole = (...roles) => {
    return async (req, res, next) => {
        
        const { user } = req
        if (!user) {
            throw createHttpError(401)
        }

        const { role } = user
        if (roles.includes(ROLES.USER) && role === ROLES.USER) {
            const { contactId } = req.params
            if (!contactId) {
                next(createHttpError(403))
                return
            }

            const contact = await ContactsCollection.findOne({
                _id: contactId,
                userId: user._id
            })

            if (contact) {
                next()
                return
            }
        }
        next(createHttpError(403))
    }
}