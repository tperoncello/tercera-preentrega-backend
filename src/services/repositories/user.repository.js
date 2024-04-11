import logger from "./../../logger.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import config from '../../config/config.js';


export default class UserRepository {
	constructor(dao) {
		this.dao = dao;
	}

	getAll = async () => {
        try {
            return await this.dao.getAll();
        } catch (error) {
            logger.error('Error al obtener todos los usuarios: ', error);
            throw error;
        }
    }

    getById = async (id) => {
        try {
            return await this.dao.getById(id);
        } catch (error) {
            logger.error('Error al obtener el usuario: ', error);
            throw error;
        }
    }

	create = async (data) => {
        try {
            return await this.dao.create(data);
        } catch (error) {
            logger.error('Error al crear el usuario: ', error);
            throw error;
        }
    }

	update = async (id, data)=> {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            logger.error('Error al actualizar el usuario: ', error);
            throw error;
        }
    }
	delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            logger.error('Error al eliminar el usuario: ', error);
            throw error;
        }
    }
    getAllAdminUsers = async () => {
        try {
            return await this.dao.getAllAdminUsers();
        } catch (error) {
            logger.error('Error al obtener todos los usuarios Admin: ', error);
            throw error;
        }
    }
    getAllPremiumUsers = async () => {
        try {
            return await this.dao.getAllPremiumUsers();
        } catch (error) {
            logger.error('Error al obtener todos los usuarios Premium: ', error);
            throw error;
        }
    }
    getAllNormalUsers = async () => {
        try {
            return await this.dao.getAllNormalUsers();
        } catch (error) {
            logger.error('Error al obtener todos los usuarios user: ', error);
            throw error;
        }
    }

    updateLastConnection = async (id) => {
        try {
            return await this.dao.updateLastConnection(id);
        } catch (error) {
            logger.error('Error al actualizar la ultima coneccion: ', error);
            throw error;
        }
    }
    deleteInactiveUsers = async () => {
        try {
            // Mueve la configuración del transportador fuera de la función
            const mailerConfig = {
                service: 'gmail',
                auth: { user: config.nodemailer.user, pass: config.nodemailer.pass },
                tls: {
                    rejectUnauthorized: false,
                },
            };
            const transporter = nodemailer.createTransport(mailerConfig);
    
            const inactiveUsers = await this.dao.deleteInactiveUsers();
    
            // Usar Promise.all para esperar que se envíen todos los correos electrónicos
            await Promise.all(
                inactiveUsers.map(async (user) => {
                    try {
                        const { email: userEmail } = user; // Asegúrate de obtener la dirección de correo electrónico del usuario
                        let Mailgenerator = new Mailgen({
                            theme: "cerberus",
                            product: {
                                name: "Kame-house",
                                link: "http://localhost:8080",
                            },
                        });
                        let response = {
                            body: {
                                intro: `Hello, this is an email to notify you that we have deleted your account as inactive.`,
                                outro: "Sorry for the inconvenience and we hope you register on our page soon",
                            },
                        };
                        let mail = Mailgenerator.generate(response);
    
                        let message = {
                            from: "Kame-House",
                            to: userEmail,
                            subject: `account deletion notification`,
                            html: mail,
                        };
    
                        // Use async/await for sending emails
                        await transporter.sendMail(message);
                    } catch (emailError) {
                        // Manejar errores al enviar correos electrónicos aquí
                        logger.error(`Error sending email to ${user.email}:`, emailError.message);
                    }
                })
            );
    
            // Devuelve los usuarios inactivos en lugar de una variable no definida
            return inactiveUsers;
        } catch (error) {
            // Manejar errores aquí
            logger.error('Error deleting inactive users:', error.message);
            throw error;
        }
    };
    getByEmail = async(email) => {
        try {
            return await this.dao.getByEmail(email);
        } catch (error) {
            logger.error('Error al obtener el usuario: ', error);
            throw error;
        }
    }
    
}