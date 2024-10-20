import { getAllContacts } from './getAllContacts.js';

export const countContacts = async () => {
    const data = await getAllContacts()
    return JSON.parse(data).length
};

console.log(await countContacts());
