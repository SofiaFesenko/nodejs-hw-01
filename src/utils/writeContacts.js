import { PATH_DB } from '../constants/contacts.js';
import fs from 'node:fs/promises'


export const writeContacts = async (updatedContacts) => {
    try {
        const data = await fs.writeFile(PATH_DB, JSON.stringify(updatedContacts, null, 2))
        return data
    } catch (error) {
        console.log(error);
    }
};