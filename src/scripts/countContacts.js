import { readContacts } from '../utils/readContacts.js';

export const countContacts = async () => {
    const data = await readContacts()
    return data.length
};

const data = await countContacts()
console.log(data);
