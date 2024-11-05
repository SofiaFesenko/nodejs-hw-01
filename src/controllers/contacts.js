import { createContact, deleteContact, getAllContacts, getContactById, patchContact } from "../services/contacts.js"
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";

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

    const contact = await getContactById(contactId, userId)

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
    const contactData = await createContact(req.body, req.user._id)

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contactData,
    });
}

export const patchContactController = async (req, res, next) => {
    const {contactId} = req.params
    const { _id: userId } = req.user
    
    const { name, phoneNUmber, email, isFavourite, contactType } = req.body

    const contact = await patchContact(
        { _id: contactId, userId },
        {
            name, 
            phoneNUmber, 
            email, 
            isFavourite, 
            contactType
        },
        { new: true }
    )

    if (!contact) {
        throw createHttpError(404, 'Contact not found')
    }

    res.status(200).json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: contact,
    });
};

export const deleteContactController = async (req, res) => {
    const {contactId} = req.params;
    const { _id: userId } = req.user

    const contact = await deleteContact({
        _id: contactId,
        userId
    })

    if (!contact) {
        throw createHttpError(404, 'Contact not found')
    }
    res.status(204).send();
}