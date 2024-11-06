const {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    updateBook,
    deleteBook,
  } = require("./handler");
  
const routes = [
    {
      method: "POST",
      path: "/books",
      handler: addBookHandler,
      options: {
        cors: {
          origin: ["*"],
        },
      },
    },
    {
      method: "GET",
      path: "/books",
      handler: getAllBookHandler,
    },
    {
      method: "GET",
      path: "/books/{bookId}",
      handler: getBookByIdHandler,
    },
    {
      method: "PUT",
      path: "/books/{bookId}",
      handler: updateBook,
    },
    {
      method: "DELETE",
      path: "/books/{bookId}",
      handler: deleteBook,
    },
  ];
  
  module.exports = routes;
  