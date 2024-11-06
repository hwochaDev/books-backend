const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if (pageCount === readPage) {
    finished = true;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
  }

  return h
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
};

const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;
  
    // Jika belum ada buku
    if (books.length === 0) {
      return h.response({
        status: "success",
        data: {
          books: [],
        },
      }).code(200);
    }
  
    // Filter berdasarkan nama
    if (name) {
      return h
        .response({
          status: "success",
          data: {
            books: books
              .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
          },
        })
        .code(200);
    }
  
    // Filter berdasarkan reading
    if (reading === "1") {
      return h
        .response({
          status: "success",
          data: {
            books: books
              .filter((book) => book.reading === true)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
          },
        })
        .code(200);
    }
  
    if (reading === "0") {
      return h
        .response({
          status: "success",
          data: {
            books: books
              .filter((book) => book.reading === false)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
          },
        })
        .code(200);
    }
  
    // Filter berdasarkan finished
    if (finished === "1") {
      return h
        .response({
          status: "success",
          data: {
            books: books
              .filter((book) => book.finished === true)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
          },
        })
        .code(200);
    }
  
    if (finished === "0") {
      return h
        .response({
          status: "success",
          data: {
            books: books
              .filter((book) => book.finished === false)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
          },
        })
        .code(200);
    }
  
    // Respons untuk semua buku
    return h
      .response({
        status: "success",
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  };
  
  const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return h.response({
        status: 'success',
        data: {
            book,
        },
    }).code(200);
};

const updateBook = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    updatedAt: new Date().toString(),
  };
  return h
    .response({
      status: "success",
      message: "Buku berhasil diperbarui",
    })
    .code(200);
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
};

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    updateBook,
    deleteBook
  };
  
