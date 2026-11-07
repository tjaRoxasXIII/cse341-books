import {
    getAllAuthors as getAllAuthorsFromDb,
    getAuthorById as getAuthorByIdFromDb,
    createAuthor as createAuthorInDb,
    updateAuthor as updateAuthorInDb,
    deleteAuthor as deleteAuthorFromDb,
    authorHasBooks
 } from '../models/authors.js';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await getAuthorByIdFromDb(id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    return res.status(200).json(author);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve author.' });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body;

    if (!id || !name || birthYear === undefined) {
      return res.status(400).json({
        message: 'id, name, and birthYear are required.'
      });
    }

    const existingAuthor = await getAuthorByIdFromDb(id);

    if (existingAuthor) {
      return res.status(400).json({
        message: 'Author id already exists.'
      });
    }

    const author = await createAuthorInDb({
      id,
      name,
      birthYear
    });

    return res.status(201).json(author);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create author.' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birthYear } = req.body;

    if (!name || birthYear === undefined) {
      return res.status(400).json({
        message: 'name and birthYear are required.'
      });
    }

    const existingAuthor = await getAuthorByIdFromDb(id);

    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const updatedAuthor = await updateAuthorInDb(id, {
      name,
      birthYear
    });

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update author.' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await getAuthorByIdFromDb(id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const hasBooks = await authorHasBooks(id);

    if (hasBooks) {
      return res.status(409).json({
        message: 'Author cannot be deleted because one or more books reference this author.'
      });
    }

    await deleteAuthorFromDb(id);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete author.' });
  }
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };