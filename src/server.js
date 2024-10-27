import dotenv from 'dotenv';
import express from 'express';
import { getAllContacts, getContactById } from './services/contacts.js';

dotenv.config()
const PORT = Number(process.env.PORT);

export function setupServer() {
    const app = express()

    app.get('/', (req, res) => {
        res.json({
          message: 'Hello World!',
        });
    });

    app.get('/contacts', async(req, res) => {
        const contacts = await getAllContacts()
        res.status(200).json(
            {
                status: 200,
                message: "Successfully found contacts!",
                data: contacts
            }
        )
    })

    app.get('/contacts/:contactId', async(req, res) => {
        const { contactId } = req.params
        const contact = await getContactById(contactId)

        if (!contact) {
            res.status(404).json({message: 'contact not found'})
            return
        }

        res.status(200).json(
            {
                status: 200,
                message: `Successfully found contact with id ${contactId}!`,
                data: contact
            }
        )
    })

    app.use('*', (req, res, next) => {
        res.status(404).json({message: 'not found'})
    })

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}