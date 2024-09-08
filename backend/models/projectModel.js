const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
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
        tasks : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            }
        ],

    },
    {
        timestamps: true,
    }
);


const Project = mongoose.model("Project", projectSchema);

module.exports = Project;