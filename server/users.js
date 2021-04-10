const users = [];


const addUser = ({ id, name, room, peerId }) => {

    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(u => u.id === id)
    if (existingUser) {
        return {
            error: 'This user is already in that room'
        };
    }

    const user = { id, name, room, peerId };
    users.push(user);

    return  { user }

};

const removeUser = (id) => {
    const index = users.findIndex(u => u.id === id);

    if(index !== -1) {
        return users.splice(index);
    }
};

const getUser = (id) => {
    return users.find(u => u.id === id);
};

const getUserInRoom = (room) => {
    return users.filter(u => u.room === room);
};

const getAllConnectedUsers = () => {
    return users;
}

module.exports = {
    addUser,
    getUser,
    removeUser,
    getUserInRoom,
    getAllConnectedUsers
}