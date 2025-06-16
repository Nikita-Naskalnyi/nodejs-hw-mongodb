import { Contact } from '../models/contact.js';
import mongoose from 'mongoose';

export const fetchContacts = () => {
  return Contact.find({}, '-__v');
};

export const fetchContactById = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return Contact.findById(id);
};

export const createContact = async (data) => {
  const newContact = await Contact.create(data);
  return newContact;
};

export const updateContactById = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    projection: '-__v',
  });
};

export const deleteContactById = async (id) => {
  return Contact.findByIdAndDelete(id);
};
