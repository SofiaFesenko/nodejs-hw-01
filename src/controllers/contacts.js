import { createContact, deleteContact, getAllContacts, getContactById, patchContact, putContact } from "../services/contacts.js"
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";

export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query)
    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder
    });

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
}

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params
    const contact = await getContactById(contactId)

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
    const contact = await createContact(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    });
}

export const putContactController = async (req, res) => {
    const {contactId} = req.params
    const result = await putContact(contactId, req.body, {upsert: true})

    if (!result) {
        throw createHttpError(404, 'Student not found')
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully upserted a student!`,
        data: result.student,
    });
}

export const patchContactController = async (req, res, next) => {
    const {contactId} = req.params
    const { name, phoneNUmber, email, isFavourite, contactType } = req.body
    const updatedContact = await patchContact(contactId, {
        name, 
        phoneNUmber, 
        email, 
        isFavourite, 
        contactType
    })

    const result = await putContact(contactId, req.body)

    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found')
    }

    res.status(200).json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
};

export const deleteContactController = async (req, res) => {
    const {contactId} = req.params;
    const contact = await deleteContact(contactId)
    if (!contact) {
        throw createHttpError(404, 'Contact not found')
    }
    res.status(204).send();
}