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

export const getContactById = async (contactId, userId) => {
    const contact = await ContactsCollection.findOne({_id: contactId, userId})
    return contact
}

export const createContact = async (payload, userId) => {    
    const contact = await ContactsCollection.create({
        ...payload,
        userId
    })
    return contact
};

export const patchContact = async ({_id: contactId, userId}, payload, options = {}) => {
    const result = await ContactsCollection.findOneAndUpdate(
        { _id: contactId, userId },
        payload,
        {
          new: true,
          ...options
        },
    );
    
    if (!result) return null;

    return {
        contact: result.value,
        isNew: Boolean(result?.lastErrorObject?.upserted),
    };
}

export const deleteContact = async ({_id: contactId, userId}) => {
    return await ContactsCollection.findOneAndDelete({_id: contactId, userId})
}