import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";
import { countContacts } from "./countContacts.js";
import { getAllContacts } from "./getAllContacts.js";

export const removeLastContact = async () => {
    const arrLength = await countContacts()
    if (arrLength > 0) {        
        const contacts = await getAllContacts()
        await writeContacts(contacts.slice(0, -1))
    }
    else {
        console.log('no contacts');
    }
    
};

removeLastContact();
