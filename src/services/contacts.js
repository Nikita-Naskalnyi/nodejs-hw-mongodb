import { Contact } from '../models/contact.js';
import mongoose from 'mongoose';

export const fetchContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
} = {}) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const [totalItems, contacts] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter, '-__v')
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(Number(perPage)),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: Number(page) > 1,
    hasNextPage: Number(page) < totalPages,
  };
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
