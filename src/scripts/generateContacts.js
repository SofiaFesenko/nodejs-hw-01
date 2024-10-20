import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

const generateContacts = async (number) => {
    const previousData = await readContacts()
    const existingContacts = previousData ? JSON.parse(previousData) : [];
    const newData = []

    for (let i = 0; i < number; i++) {
        newData.push(createFakeContact(number))
    }
    await writeContacts([...existingContacts, ...newData])
};

generateContacts(2);
