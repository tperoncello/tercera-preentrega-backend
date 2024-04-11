import logger from "./../../logger.js";

export default class TicketRepository {
	constructor(dao) {
		this.dao = dao;
	}

	getAll = async () => {
        try{
            return await this.dao.getAll();
        } catch( error ){
            logger.error('Error al obtener todos los tickets: ', error);
            throw error;
        }
    }
	getById = async (id) => {
        try {
            return await this.dao.getById(id);
        } catch ( error ) {
            logger.error('Error al obtener el ticket: ', error);
            throw error;
        }
    }
	create = async (data) => {
        try{
            return await this.dao.create(data);
        } catch ( error ) {
            logger.error('Error al crear el ticket: ', error);
            throw error;
        }
    }
	update = async (id, data) => {
        try {
            return await this.dao.update(id, data);
        } catch ( error ) {
            logger.error('Error al actualizar el ticket: ', error);
            throw error;
        }
    }
	delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch ( error ) {
            logger.error('Error al eliminar el ticket: ', error);
            throw error;
        }
    }
	getTicketsByPurchaser = async (email) =>{
        try {
            return await this.dao.getTicketsByPurchaser(email);
        } catch ( error ) {
            logger.error('Error al obtener los tickets: ', error);
            throw error;
        }
    }
	getTicketPopulate = async (id) => {
        try {
            return await this.dao.findByIdAndPopulate(id) 
        } catch (error) {
            logger.error('Error al obtener el ticket populate: ', error);
            throw error;
        }
    }
}