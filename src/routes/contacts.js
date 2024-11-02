import express from 'express';
import { Router } from 'express';
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, patchContactController, putContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

const jsonParser = express.json()

router.use(authenticate)

router.get('/', ctrlWrapper(getAllContactsController))
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController))
router.post('/', jsonParser, validateBody(createContactSchema), ctrlWrapper(createContactController))
router.put('/:contactId', isValidId, jsonParser, ctrlWrapper(putContactController))
router.patch('/:contactId', isValidId, jsonParser, validateBody(updateContactSchema), ctrlWrapper(patchContactController))
router.delete('/:contactId', isValidId, jsonParser, ctrlWrapper(deleteContactController));


export default router;