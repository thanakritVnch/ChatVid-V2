//manage users event

const users = [];

// helper fucntion

const addUser = ({ id, name, room }) => {
  // id will get from socket
  // username must be all trim and lowerase
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  //check existing user
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "username that using by other user" };
  }

  const user = { id, name, room };
  users.push(user);

  return { user };
};
const removeuser = ({ id }) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
const getUser = (id) => users.find((user) => user.id === id);
const getUserInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeuser, getUser, getUserInRoom };
