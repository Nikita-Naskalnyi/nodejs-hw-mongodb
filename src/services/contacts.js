import { Contact } from '../models/contact.js';

export const fetchContacts = () => {
  return Contact.find();
};

export const fetchContactById = (id) => {
  return Contact.findById(id);
};
