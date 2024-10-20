import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

const addOneContact = async () => {
    const previousData = await readContacts()
    const existingContacts = previousData ? JSON.parse(previousData) : [];
    const newData = []
    newData.push(createFakeContact())
    await writeContacts([...existingContacts, ...newData])
};

addOneContact();
