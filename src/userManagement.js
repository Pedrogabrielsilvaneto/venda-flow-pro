const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USERS_FILE = path.join(__dirname, '..', 'users.json');

const defaultUsers = [
    {
        id: 'admin_master',
        name: 'Admin',
        username: process.env.ADMIN_USER || 'admin',
        password: process.env.ADMIN_PASS || 'pereira2024',
        role: 'ADMIN',
        signature: 'Admin',
        active: true
    }
];

function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            saveUsers(defaultUsers);
            return defaultUsers;
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Erro ao carregar usuários:", e);
        return defaultUsers;
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (e) {
        console.error("Erro ao salvar usuários:", e);
    }
}

function getUsers() {
    return loadUsers();
}

function addUser(userData) {
    const users = loadUsers();
    
    // Check if username exists
    if (users.find(u => u.username === userData.username)) {
        throw new Error("Usuário já existe");
    }

    const newUser = {
        id: crypto.randomBytes(16).toString('hex'),
        name: userData.name,
        username: userData.username,
        password: userData.password,
        role: userData.role === 'ADMIN' ? 'ADMIN' : 'VENDEDOR',
        signature: userData.signature || userData.name,
        active: true
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
}

function updateUser(id, updates) {
    const users = loadUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        saveUsers(users);
        return users[index];
    }
    return null;
}

function deleteUser(id) {
    let users = loadUsers();
    if (id === 'admin_master') throw new Error("Não é possível deletar o admin principal");
    
    users = users.filter(u => u.id !== id);
    saveUsers(users);
}

module.exports = {
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
