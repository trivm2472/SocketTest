const users = [];

function userJoin(id, username, room) {
    const user = {id, username, room};
    users.push(user);

    return user;
}

function getCurrentUser(id) {
    const user = users.find(user => user.id === id);
    return user;
}

module.exports = {userJoin, getCurrentUser};