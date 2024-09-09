const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

async function createTask(req, res) {
    try {
        let { name, description, dueDate, project, assigned_to } = req.body;

        // here assigned_to is an array of user emails
        // we need to find the user ids of the users with the given emails

        if (!name || !description || !dueDate || !project || !assigned_to) {
            return res.status(400).json({
                message: "Please provide all the details",
            });
        }

        if (assigned_to.length === 0) {
            return res.status(400).json({
                message: "Please provide atleast one user",
            });
        }

        if (!Array.isArray(assigned_to)) {
            return res.status(400).json({
                message: "Please provide assigned_to as an array",
            });
        }

        // due date format is yyyy-mm-dd
        // we need to convert it to a date object
        const dateParts = dueDate.split("-");
        let newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        dueDate = newDate;

        if (dueDate < new Date()) {
            return res.status(400).json({
                message: "Due date should be greater than current date",
            });
        }

        const users = await User.find({ email: { $in: assigned_to } }, "_id");
        const userIds = users.map((user) => user._id);

        const task = await Task.create({
            name,
            description,
            dueDate,
            project,
            assigned_to: userIds,
        });

        await Project.findByIdAndUpdate(
            project,
            { $push: { tasks: task._id } },
            { new: true }
        );

        await User.updateMany(
            { email: { $in: assigned_to } },
            { $push: { tasks: task._id } }
        );

        res.status(201).json({
            message: "Task created successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function getTasks(req, res) {
    try {
        const { project } = req.body;

        const tasks = await Project.findById(project).populate("tasks");

        res.status(200).json({
            tasks,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function getTaskById(req, res) {
    try {
        const { id } = req.body;
        console.log(id);
        const task = await Task.findById(id);
        res.status(200).json({
            task,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { name, description, dueDate, status, project, assigned_to } =
            req.body;

        // if (!name || !description || !dueDate || !status || !project || !assigned_to) {
        //     return res.status(400).json({
        //         message: "Please provide all the details",
        //     });
        // }

        // if (!Array.isArray(assigned_to)) {
        //     return res.status(400).json({
        //         message: "Please provide assigned_to as an array",
        //     });
        // }

        const users = await User.find({ email: { $in: assigned_to } }, "_id");
        const userIds = users.map((user) => user._id);

        const task = await Task.findByIdAndUpdate(
            id,
            {
                name,
                description,
                dueDate,
                status,
                project,
                assigned_to: assigned_to ? userIds : assigned_to,
            },
            { new: true }
        ).populate("assigned_to project");

        await Project.findByIdAndUpdate(
            task.project._id,
            { $addToSet: { tasks: task._id } },
            { new: true }
        );

        await User.updateMany(
            { email: { $in: assigned_to } },
            { $addToSet: { tasks: task._id } }
        );

        res.status(200).json({
            message: "Task updated successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);

        await Project.findByIdAndUpdate(
            task.project,
            { $pull: { tasks: task._id } }, 
            { new: true }
        );

        await User.updateMany(
            { tasks: task._id },
            { $pull: { tasks: task._id } }
        );

        res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function addMemberToTask(req, res) {
    try {
        const { id } = req.params;
        const { emails } = req.body;

        const users = await User.find({ email: { $in: emails } }, "_id");
        const userIds = users.map((user) => user._id);

        // TODO => verify userids exit in project members or not

        const task = await Task.findByIdAndUpdate(
            id,
            { $addToSet: { assigned_to: userIds } },
            { new: true }
        );

        await User.updateMany(
            { email: { $in: emails } },
            { $addToSet: { tasks: task._id } }
        );

        res.status(200).json({
            message: "User added to task successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function removeMemberFromTask(req, res) {
    try {
        const { id } = req.params;
        const { emails } = req.body;

        const users = await User.find({ email: { $in: emails } }, "_id");
        const userIds = users.map((user) => user._id);

        console.log(userIds);
        const task = await Task.findByIdAndUpdate(
            id,
            { $pull: { assigned_to: { $in: userIds } } },
            { new: true }
        );

        console.log(task);

        await User.updateMany(
            { email: { $in: emails } },
            { $pull: { tasks: task._id } }
        );

        res.status(200).json({
            message: "User removed from task successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    addMemberToTask,
    removeMemberFromTask,
};
