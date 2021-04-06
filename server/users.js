const users = [];


const addUser = ({ id, name, room }) => {

    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(u => u.room === room && u.name === name)
    if (existingUser) {
        //same name already exists
        return {
            error: 'User with that name already exists!'
        };
    }

    const user = { id, name, room };
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

module.exports = {
    addUser,
    getUser,
    removeUser,
    getUserInRoom
}