import { getAllBooks, getBookById } from '../models/books.js';

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

const getBookByIdHandler = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await getBookById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book by ID:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

export { getBooksHandler, getBookByIdHandler };