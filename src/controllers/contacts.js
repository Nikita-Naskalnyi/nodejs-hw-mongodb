import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';
import {Contact} from '../models/contact.js';

export const getAllContacts = async (req, res) => {
  const paginationResult = await contactsService.fetchContacts(
    req.user._id,
    req.query
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: paginationResult,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.fetchContactById(
    req.user._id,
    contactId
  );

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
  const { _id: userId } = req.user;
  const photo = req.file?.path || '';

  const newContact = await Contact.create({
    ...req.body,
    userId,
    photo,
  });

  res.status(201).json({
    status: 'success',
    message: 'Contact created',
    data: {
      contact: newContact,
    },
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) throw createError(404, 'Contact not found');

  if (req.file?.path) {
    req.body.photo = req.file.path;
  }

  const updated = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  res.json({
    status: 'success',
    message: 'Contact updated',
    data: {
      contact: updated,
    },
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await contactsService.deleteContactById(
    req.user._id,
    contactId
  );

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
