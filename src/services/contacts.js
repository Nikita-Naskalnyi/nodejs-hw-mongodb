import { Contact } from '../models/contact.js';

export const fetchContacts = () => {
  return Contact.find();
};

export const fetchContactById = (id) => {
  return Contact.findById(id);
};

export const createContact = async (data) => {
  const newContact = await Contact.create(data);
  return newContact;
};

export const updateContactById = async (id, data) => {
  const updated = await Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updated;
};

export const deleteContactById = async (id) => {
  const deleted = await Contact.findByIdAndDelete(id);
  return deleted;
};