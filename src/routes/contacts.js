import express from 'express';
import { Router } from 'express';
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, patchContactController} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRole } from '../middlewares/checkRole.js';
import { ROLES } from '../constants/index.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

const jsonParser = express.json()

router.use(authenticate)

router.get('/', ctrlWrapper(getAllContactsController))
router.get('/:contactId', isValidId, checkRole(ROLES.USER), ctrlWrapper(getContactByIdController))
router.post('/', jsonParser, upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController))
router.patch('/:contactId', upload.single('photo'), isValidId, jsonParser, checkRole(ROLES.USER), validateBody(updateContactSchema), ctrlWrapper(patchContactController))
router.delete('/:contactId', isValidId, jsonParser, checkRole(ROLES.USER), ctrlWrapper(deleteContactController));


export default router;