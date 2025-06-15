import express from 'express';
import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';


const router = express.Router();

router.get('/', ctrlWrapper(contactsController.getAllContacts));
router.post('/', ctrlWrapper(contactsController.createContact));
router.get('/:contactId', ctrlWrapper(contactsController.getContactById));
router.patch('/:contactId', ctrlWrapper(contactsController.updateContact));
router.delete('/:contactId', ctrlWrapper(contactsController.deleteContact));

export default router;
