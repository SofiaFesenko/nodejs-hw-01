import { createContact, deleteContact, getAllContacts, getContactById, patchContact, putContact } from "../services/contacts.js"
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query)

    const { _id: userId } = req.user

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        userId
    });

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
}

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params
    const { _id: userId } = req.user

    const contact = await ContactsCollection.findOne({
        _id: contactId,
        userId
    })

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json(
        {
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact
        }
    )
}

export const createContactController = async (req, res) => {
    const contactData = {
        contact: await createContact(req.body),
        userId: req.user._id
    }

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contactData,
    });
}

export const putContactController = async (req, res) => {
    const {contactId} = req.params
    const {_id: userId} = req.user

    const contact = await ContactsCollection.findOne({_id: contactId, userId})

    if (!contact) {
        throw createHttpError(404, 'contact not founf or access denied')
    }

    const result = await putContact(contactId, req.body, {upsert: true})

    if (!result) {
       throw createHttpError(404, 'Contact not found')
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully upserted a contact!`,
        data: result.contact,
    });
}

export const patchContactController = async (req, res, next) => {
    const {contactId} = req.params
    const { _id: userId } = req.user
    
    const { name, phoneNUmber, email, isFavourite, contactType } = req.body
    const updatedContact = await patchContact(contactId, {
        name, 
        phoneNUmber, 
        email, 
        isFavourite, 
        contactType
    })

    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found')
    }

    const contact = await ContactsCollection.findOneAndUpdate(
        { _id: contactId, userId },
        updatedContact,
        { new: true }
    );

    res.status(200).json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: contact,
    });
};

export const deleteContactController = async (req, res) => {
    const {contactId} = req.params;
    const { _id: userId } = req.user

    const contact = await ContactsCollection.findOneAndDelete({
        _id: contactId,
        userId
    })
    if (!contact) {
        throw createHttpError(404, 'Contact not found')
    }
    res.status(204).send();
}