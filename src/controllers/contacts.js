import { createContact, deleteContact, getAllContacts, getContactById, patchContact } from "../services/contacts.js"
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import fs from 'node:fs/promises'

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
    let photo = null

    if (typeof req.file !== 'undefined') {
        if (process.env.ENABLE_CLOUDINARY == 'true') {
            const result = await uploadToCloudinary(req.file.path)
            await fs.unlink(req.file.path)
            photo = result.secure_url
        } 
        else {
            await fs.rename(req.file.path, path.resolve('src', 'public/photos', req.file.filename))
            photo = `http://localhost:3000/photos/${req.file.filename}`
        }        
    }

    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
        userId: req.user._id,
        photo
    }

    const contactData = await createContact(contact)

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contactData,
    });
}

export const patchContactController = async (req, res, next) => {
    const {contactId} = req.params
    const { _id: userId } = req.user

    let photo = null

    if (typeof req.file !== 'undefined') {
        if (process.env.ENABLE_CLOUDINARY == 'true') {
            const result = await uploadToCloudinary(req.file.path)
            await fs.unlink(req.file.path)
            photo = result.secure_url
        } 
        else {
            await fs.rename(req.file.path, path.resolve('src', 'public/photos', req.file.filename))
            photo = `http://localhost:3000/photos/${req.file.filename}`
        }        
    }
    
    const { name, phoneNUmber, email, isFavourite, contactType } = req.body

    const contact = await patchContact(
        { _id: contactId, userId },
        {
            name, 
            phoneNUmber, 
            email, 
            isFavourite, 
            contactType,
            photo
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