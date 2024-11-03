import { ContactsCollection } from "../db/models/contacts.js"
import { calculatePaginationData } from "../utils/calculatePagination.js"
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    userId
}) => {
    const limit = perPage
    const skip = (page - 1) * perPage

    const contactsQuery = ContactsCollection.find({userId})
    const contactsCount = await ContactsCollection.find().merge(contactsQuery).countDocuments({userId})

    const contacts = await contactsQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec()
    const paginationData = calculatePaginationData(contactsCount, perPage, page)
    return {
        data: contacts,
        ...paginationData
    }
}

export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId)
    return contact
}

export const createContact = async (payload, userId) => {    
    const contact = await ContactsCollection.create({
        ...payload,
        userId
    })
    return contact
};

export const patchContact = async (contactId, payload, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id: contactId },
        payload,
        {
          new: true,
          ...options
        },
    );
    
    if (!rawResult) return null;

    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
}

export const deleteContact = async (contactId) => {
    return await ContactsCollection.findOneAndDelete({_id: contactId})
}