

class UserService {
    constructor() {
        //
    }

    getUser = async ({ id, name, room, peerId }) => {
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
    }
}