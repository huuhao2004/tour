// helpers/pagination.js
module.exports = (query, countRecord) => {
  const objectPagination = {
    currentPage: 1,
    limitItem: 2,
  };


  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
    if (objectPagination.currentPage <= 0) {
      objectPagination.currentPage = 1;
    }
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItem;
  
  objectPagination.totalRecord = countRecord;
  objectPagination.totalPage = Math.ceil(countRecord / objectPagination.limitItem);

  return objectPagination;
};
