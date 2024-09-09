const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        assigned_to: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo",
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
