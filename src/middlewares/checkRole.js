import createHttpError from "http-errors"
import { ROLES } from "../constants"
import { ContactsCollection } from "../db/models/contacts"

export const checkRole = (...roles) => {
    async (req, res, next) => {
        const { user } = req
        if (!user) {
            throw createHttpError(401)
        }

        const { role } = user
        if (roles.includes(ROLES.USER) && role === ROLES.USER) {
            const { contactId } = req.params
            if (!contactId) {
                throw createHttpError(403)
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
        throw createHttpError(403)
    }
}