import { Contact } from '../models/contact.js';
import mongoose from 'mongoose';

export const fetchContacts = async (
  userId,
  {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = {}
) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const filter = { userId };
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

export const fetchContactById = (userId, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Contact.findOne({ _id: id, userId });
};

export const createContact = async (userId, data) => {
  return Contact.create({ ...data, userId });
};

export const updateContactById = (userId, id, data) => {
  return Contact.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
    runValidators: true,
    projection: '-__v',
  });
};

export const deleteContactById = (userId, id) => {
  return Contact.findOneAndDelete({ _id: id, userId });
};
