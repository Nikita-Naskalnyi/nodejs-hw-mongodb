import { fetchContacts, fetchContactById } from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const contacts = await fetchContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await fetchContactById(id);

  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};
