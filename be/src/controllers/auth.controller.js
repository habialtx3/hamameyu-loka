const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthService = require('../services/auth.service');

const AuthController = {
    register: async (req, res, next) => {
        try {
            const { username, email, password,name } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            await AuthService.createUser(username, email, hashedPassword,name);
            
            return res.status(201).json({ message: "Registrasi berhasil" });
        } catch (error) {
            next(error); // Lempar ke error middleware Anda
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await AuthService.findByEmail(email);
            
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: "Email atau password salah" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role_name },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Set cookie ke browser client
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 3600000 
            });

            return res.json({ message: "Login berhasil", role: user.role_name });
        } catch (error) {
            next(error);
        }
    },

    me: async (req, res) => {
        // req.user didapatkan dari auth middleware nantinya
        return res.json({ user: req.user });
    },

    logout: async (req, res) => {
        res.clearCookie('token');
        return res.json({ message: "Logout berhasil" });
    }
};

module.exports = AuthController;