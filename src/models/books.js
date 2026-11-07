import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');
    const books = await collection.find({}).toArray();
    return books;
};

const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.findOne({ id: bookId });
    return book;
};

const authorExists = async (authorId) => {
    const db = getDb();
    const author = await db
        .collection('authors')
        .findOne({ id: authorId });

    return !!author;
};

const createBook = async (bookData) => {
    const db = getDb();

    if (!(await authorExists(bookData.authorId))) {
        throw new Error('Author does not exist');
    }

    if (!bookData.id || !bookData.authorId || !bookData.title || !bookData.publicationDate) {
        throw new Error('id, authorId, title, and publicationDate are required');
    }

    if (await getBookById(bookData.id)) {
        throw new Error('Book id already exists');
    }

    await db.collection('books').insertOne(bookData);

    return bookData;
};

const updateBook = async (bookId, updatedBook) => {
    const db = getDb();

    if (
        updatedBook.authorId &&
        !(await authorExists(updatedBook.authorId))
    ) {
        throw new Error('Author does not exist');
    }

    await db.collection('books').updateOne(
        { id: bookId },
        { $set: updatedBook }
    );

    return getBookById(bookId);
};

const deleteBook = async (bookId) => {
    const db = getDb();

    const result = await db
        .collection('books')
        .deleteOne({ id: bookId });

    return result.deletedCount > 0;
};

export {
    getAllBooks,
    getBookById,
    authorExists,
    createBook,
    updateBook,
    deleteBook
};
    
