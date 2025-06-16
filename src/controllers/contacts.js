import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.fetchContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.fetchContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const newContact = await contactsService.createContact(req.body);

  // Видаляємо __v з відповіді, якщо є
  const contactData = newContact.toObject();
  delete contactData.__v;

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contactData,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updated = await contactsService.updateContactById(contactId, req.body);

  if (!updated) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await contactsService.deleteContactById(contactId);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
