import userModel from './models/user.model.js';

export default class UserMongoDAO {
	getAll = async () => await userModel.find().exec();
	getById = async (id) => await userModel.findById(id).lean().exec();
	create = async (data) => await userModel.create(data);
	update = async (id, data) =>
		await userModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
	delete = async (id) => await userModel.findByIdAndDelete(id);
    getAllAdminUsers = async () => {
		const allUsers = await userModel.find().lean().exec();
		const adminUsers = allUsers.filter(user => user.role === 'admin');
		return adminUsers;
	};
    getAllPremiumUsers = async () => {
		const allUsers = await userModel.find().exec();
		const premiumUsers = allUsers.filter(user => user.role.trim() === 'premium');
		return premiumUsers;
	};
    getAllNormalUsers = async () => {
		const allUsers = await userModel.find().exec();
		const normalUsers = allUsers.filter(user => user.role.trim() === 'user');
		return normalUsers;
	};
	updateLastConnection = async (id) => {
		const user = await userModel.findById(id);
		user.last_connection = new Date();
		await user.save();
	};

	deleteInactiveUsers = async () => {
        const inactiveUsers = await userModel.find({
            last_connection: {
                $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        }).lean().exec();

        const deletedUsers = await Promise.all(
            inactiveUsers.map(async (user) => {
                return await userModel.findByIdAndDelete(user._id).lean().exec();
            })
        );

        return deletedUsers;
    };
	getByEmail = async (email) => await userModel.findOne({ email });

}