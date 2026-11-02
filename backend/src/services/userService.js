const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

const UserService = {
    async getAllUsers() {
        return await UserModel.getAll();
    },
    async getUserById(id) {
        return await UserModel.getById(id);
    },
    async createUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await UserModel.create({
            username: data.username,
            password_hash: hashedPassword,
            role: data.role || 'petugas',
            no_hp: data.no_hp,
            alamat: data.alamat
        });
    },
    async updateUser(id, data) {
        return await UserModel.update(id, data);
    },
    async deleteUser(id) {
        return await UserModel.delete(id);
    }
};

module.exports = UserService;