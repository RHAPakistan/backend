const users = {};

// Join user to chat
function userJoin(id, socket) {
  users[id] = socket;
  return socket;
}

// Get current user
function getUserSocket(id) {
    return users[id];
}

// User leaves chat
function userLeave(id) {
  users.delete(id);
  return True
}

// // Get room users
// function getRoomUsers(room) {
//   return users.filter(user => user.room === room);
// }

module.exports = {
  userJoin,
  getUserSocket,
  userLeave
};