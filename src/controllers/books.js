import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} from '../models/books.js';

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await getBookById(id);

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createBookHandler = async (req, res) => {
    try {
        const { id, authorId, title, publicationDate } = req.body;

        if (!id || !authorId || !title || !publicationDate) {
            return res.status(400).json({
                message: 'id, authorId, title, and publicationDate are required'
            });
        }

        const book = await createBook({
            id,
            authorId,
            title,
            publicationDate
        });

        return res.status(201).json(book);
    } catch (error) {
        if (error.message === 'Author does not exist') {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.message === 'Book id already exists') {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error('Error creating book:', error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

const updateBookHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { authorId, title, publicationDate } = req.body;

        if (!authorId || !title || !publicationDate) {
            return res.status(400).json({
                message: 'authorId, title, and publicationDate are required'
            });
        }

        const existingBook = await getBookById(id);

        if (!existingBook) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        const updatedBook = await updateBook(id, {
            authorId,
            title,
            publicationDate
        });

        return res.status(200).json(updatedBook);
    } catch (error) {
        if (error.message === 'Author does not exist') {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error('Error updating book:', error.message);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

const deleteBookHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await deleteBook(id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting book:', error.message);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler
};