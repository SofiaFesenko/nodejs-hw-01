import express from 'express';
import { Router } from 'express';
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, patchContactController, putContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

const jsonParser = express.json()

router.get('/contacts', ctrlWrapper(getAllContactsController))
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController))
router.post('/contacts', jsonParser, ctrlWrapper(createContactController))
router.put('/contacts/:contactId', jsonParser, ctrlWrapper(putContactController))
router.patch('/contacts/:contactId', jsonParser, ctrlWrapper(patchContactController))
router.delete('/contacts/:contactId', jsonParser, ctrlWrapper(deleteContactController));


export default router;