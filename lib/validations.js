const validate = require('validate.js');

const VALID_ID = {
  onlyInteger: true,
  greaterThan: 0
};

const USER_VALIDATION = {
  email: {
    presence: true,
    email: true
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
      message: 'must be at least 8 characters'
    }
  },
  firstName: {
    presence: true,
    length: {
      minimum: 1,
      message: 'You must create a first name'
    }
  },
  lastName: {
    presence: true,
    length: {
      minimum: 1,
      message: 'You must create a last name'
    }
  }
};
exports.user = function validateUser(userData) {
  return validate(userData, USER_VALIDATION);
};

// const BOARD_VALIDATION = {
//   ownerId: {
//     presence: true,
//     numericality: VALID_ID
//   },
//   title: {
//     presence: true
//   }
// };
// exports.board = function validateBoard(boardData) {
//   return validate(boardData, BOARD_VALIDATION);
// };

// const BOARD_UPDATE_VALIDATION = {
//   ownerId: {
//     numericality: VALID_ID
//   }
// };
// exports.boardUpdate = function validateBoardUpdate(boardData) {
//   return validate(boardData, BOARD_UPDATE_VALIDATION);
// };

const CREDS_VALIDATION = {
  email: {
    presence: true,
    email: true
  },
  password: {
    presence: true
  }
};
exports.credentials = function validateCredentials(credsData) {
  return validate(credsData, CREDS_VALIDATION);
};


// const BOOKMARK_VALIDATION = {
//   title: {
//     presence: true,
//   },
//   url: {
//     presence: true
//   }
// };

// exports.bookmark = function bookmark(bookmarkData) {
//   return validate(bookmarkData, BOOKMARK_VALIDATION);
// };

// const BOOKMARK_UPDATE_VALIDATION = {
//   boardId: {
//     numericality: VALID_ID
//   }
// };
// exports.bookmarkUpdate = function validateBookmarkUpdate(bookmarkData) {
//   return validate(bookmarkData, BOOKMARK_UPDATE_VALIDATION);
// };