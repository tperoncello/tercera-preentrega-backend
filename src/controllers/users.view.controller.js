import { UserService } from "../services/repositories/index.js";

export const updateUserView = async (req, res) => {
    try {
        const id = req.body.userId;
        const data = {
            role: req.body.role,
        };

        const updatedUser = await UserService.update(id, data, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: `User with ID ${id} not found.` });
        }

        res.status(200).json({
            message: "User updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating User:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = req.body.userIdDelete;

        const deletedUser = await UserService.delete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: `User with ID ${id} not found.` });
        }

        res.status(200).json({
            message: "User deleted successfully.",
            user: deletedUser,
        });
    } catch (error) {
        console.error("Error deleting User:", error.message);
        res.status(500).json({ error: error.message });
    }
};

