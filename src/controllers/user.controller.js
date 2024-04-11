import { UserService } from "../services/repositories/index.js";
import UserPasswordModel from '../dao/models/user_password.model.js'
import UserDTO from "../dto/user.dto.js"
import logger from '../logger.js';
import fs from 'fs';
import config from '../config/config.js';
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { generateRandomString } from '../utils.js';
import { PORT } from '../app.js';
import UserModel from '../dao/models/user.model.js';


export const getUsersController = async (req, res) => {
    try {
        const users = await UserService.getAll();

        const usersDTO = users.map(user => new UserDTO(user));

        res.status(200).json(usersDTO);
    } catch (error) {
        logger.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getUsertByIdController = async (req, res) => {
	try {
		const userId = req.params.uid;

		const user = await UserService.getById(userId);
        console.log(user)

		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		res.status(200).json({ payload: user });
	} catch (error) {
		logger.error("Error al obtener el usuario:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const addUserController = async (req, res) => {
	try {
		const data = req.body;
		const addedUser = await UserService.create(data);

		res.status(201).json({
			message: "User added successfully.",
			payload: addedUser,
		});
	} catch (error) {
		logger.error("Error adding User:", error.message);
		res.status(500).json({ error: error.message });
	} finally {
		if (res.statusCode == 201) {
			logger.error("Post completed successfully");
		} else {
			logger.http("Post failed");
		}
	}
};

export const updateUser = async (req, res) => {
	try {
		const id = req.params.uid;
		const data = req.body;

		const updatedUser = await UserService.update(id, data, {
			new: true,
		});

		if (!updatedUser) {
			return res.status(404).json({ error: `User with ID ${id} not found.` });
		}

		res.status(200).json({
			message: "User updated successfully.",
			ticket: updatedUser,
		});
	} catch (error) {
		logger.error("Error updating User:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const deleteUser = async (req, res) => {
    let deletedUsers;
    try {
        deletedUsers = await UserService.deleteInactiveUsers();

        if (deletedUsers.length === 0) {
            return res.status(204).json({ message: "No inactive users found" });
        }

        res.status(200).json({
            message: "Inactive users deleted successfully.",
            deletedUsers: deletedUsers,
        });
    } catch (error) {
        logger.error("Error deleting inactive users:", error.message);
        res.status(500).json({ error: error.message });
    } finally {
        if (deletedUsers) {
            logger.info("Deleted inactive users:", deletedUsers);
        }
    }
};


export const getAdminsController = async ( req, res ) => {
	try {
		const adminUsers = await UserService.getAllAdminUsers();
		res.status(200).json(adminUsers);
	} catch (error) {
		logger.error("Error to get admin user:", error.message);
		res.status(500).json({ error: error.message });
	}
}

export const getPremiumsController = async ( req, res ) => {
	try {
		const premiumUsers = await UserService.getAllPremiumUsers();
		res.status(200).json(premiumUsers);
	} catch (error) {
		logger.error("Error to get premium user:", error.message);
		res.status(500).json({ error: error.message });
	}
}

export const getNormalController = async ( req, res ) => {
	try {
		const normalUsers = await UserService.getAllNormalUsers();
		res.status(200).json(normalUsers);
	} catch (error) {
		logger.error("Error to get normal user:", error.message);
		res.status(500).json({ error: error.message });
	}
}

export const upgradeToPremiumController = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.uid)
        await UserModel.findByIdAndUpdate(req.params.uid, { role: user.role === 'user' ? 'premium' : 'user' })
        res.json({ status: 'success', message: 'Se ha actualizado el rol del usuario' })
	}catch (error) {
		logger.error("Error to upgrade user:", error.message);
		res.status(500).json({ error: error.message });
	}
}

export const sendDocumentsController = async (req, res) => {
	try {
		const fileType = req.body.fileType;

		// Directorio base donde se guardarán los archivos
		const baseDirectory = 'uploads';
	
		// Lógica para determinar la carpeta de destino según el fileType
		let destinationFolder;
	
		switch (fileType) {
			case 'document':
				destinationFolder = 'documents';
				break;
			case 'profileImage':
				destinationFolder = 'profiles';
				break;
			case 'productImage':
				destinationFolder = 'products';
				break;
			default:
				// Manejar otros casos si es necesario
				return res.status(400).json({ error: 'Tipo de archivo no válido' });
		}
	
		// Crear la carpeta de destino si no existe
		const targetDirectory = `${baseDirectory}/${destinationFolder}`;
	
		if (!fs.existsSync(targetDirectory)) {
			fs.mkdirSync(targetDirectory, { recursive: true });
		}
	
		// Mover el archivo al directorio de destino
		const sourcePath = req.file.path;
		const targetPath = `${targetDirectory}/${req.file.filename}`;
	
		fs.renameSync(sourcePath, targetPath);
	
		res.json({ message: 'Archivo subido exitosamente' })
	}catch (error) {
		logger.error("Error al subir el archivo:", error.message);
		res.status(500).json({ error: error.message });
	}
}

export const forgetPasswordController = async (req, res) => {
    const email = req.body.email;

    try {
        const user = await UserService.getByEmail(email);

        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        const token = generateRandomString(16);
        await UserPasswordModel.create({ email, token });

        const mailerConfig = {
            service: 'gmail',
            auth: {
                user: config.nodemailer.user,
                pass: config.nodemailer.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        };

        let transporter = nodemailer.createTransport(mailerConfig);

        let Mailgenerator = new Mailgen({
            theme: 'cerberus',
            product: {
                name: 'Kame-house',
                link: 'http://localhost:8080',
            },
        });

        let response = {
            body: {
                intro: `You have asked to reset your password. You can do it here: <a href="http://${req.hostname}:${PORT}/reset-password/${token}">http://${req.hostname}:${PORT}/reset-password/${token}</a><hr />Best regards,<br>`,
                outro: 'The Kame-House team',
            },
        };

        let mail = Mailgenerator.generate(response);

        let message = {
            from: 'Kame-House',
            to: email,
            subject: 'Reset your password',
            html: mail,
        };

        await transporter.sendMail(message);

        res.render("sessions/emailSent", { email: email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
};
