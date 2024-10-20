import { PATH_DB } from '../constants/contacts.js';
import fs from 'node:fs/promises'

export const readContacts = async () => {
    try {
        const data = await fs.readFile(`./${PATH_DB}`, { encoding: 'utf-8' })
        return data
    } catch (error) {
        console.log(error);
    }
};

readContacts()