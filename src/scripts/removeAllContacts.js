import { writeContacts } from "../utils/writeContacts.js";
import { getAllContacts } from "./getAllContacts.js";

export const removeAllContacts = async () => {
    let data = getAllContacts()
    data = []
    return await writeContacts(data)
};

removeAllContacts();
