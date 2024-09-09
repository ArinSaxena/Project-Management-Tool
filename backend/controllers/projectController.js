const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

async function createProject(req, res) {
    try {
        console.log(req.body);
        const { name, description, members } = req.body;

        const project = await Project.create({
            name,
            description,
            createdBy: req.user,
            members,
        });

        await User.findOneAndUpdate(
            { _id: req.user },
            { $push: { projects: project._id } }
        );

        res.status(201).json({
            message: "Project created successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function addMember(req, res) {
    try {
        const { id } = req.params;
        const { members } = req.body;
        // console.log(members); //[ 'user1@gmail.com', 'user2@gmail.com' ]

        const users = await User.find({ email: { $in: members } }, "_id");
        const userIds = users.map((user) => user._id);

        const project = await Project.findByIdAndUpdate(
            id,
            {
                $addToSet: { members: userIds },
            },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await User.updateMany(
            { email: { $in: members } },
            { $addToSet: { projects: project._id } }
        );

        res.status(200).json({
            message: "Member added successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function removeMember(req, res) {
    try {
        const { id } = req.params;
        const { member } = req.body;

        const users = await User.find(
            {
                email: member,
            },
            "_id"
        );
        const userIds = users.map((user) => user._id);

        const project = await Project.findByIdAndUpdate(
            id,
            {
                $pull: { members: userIds },
            },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await User.updateMany(
            { email: member },
            { $pull: { projects: project._id } }
        );

        res.status(200).json({
            message: "Member removed successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function getMembers(req, res) {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate("members");
        res.status(200).json({
            members: project.members,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function getProjects(req, res) {
    try {
        const projects = await Project.find({ createdBy: req.user }).populate(
            "members tasks createdBy"
        );

        res.status(200).json({
            projects,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function getProjectById(req, res) {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate(
            "members tasks createdBy"
        );
        res.status(200).json({
            project,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function updateProject(req, res) {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const project = await Project.findByIdAndUpdate(id, {
            name,
            description,
        });

        res.status(200).json({
            message: "Project updated successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function deleteProject(req, res) {
    try {
        const { id } = req.params;

        await Project.findByIdAndDelete(id);

        await Task.deleteMany({ project: id });

        await User.updateMany({ projects: id }, { $pull: { projects: id } });
        
        res.status(200).json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

async function viewProjectTasks(req, res) {
    try {
        const { id } = req.params;
        const tasks = await Project.findById(id).populate({
            path: "tasks",
            populate: { path: "assigned_to" },
        });

        res.status(200).json({
            tasks,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
    getMembers,
    viewProjectTasks,
};
