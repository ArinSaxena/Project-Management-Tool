const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "completed"],
            default: "inactive",
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


const Task = mongoose.model("Task", taskSchema);

module.exports = Task;