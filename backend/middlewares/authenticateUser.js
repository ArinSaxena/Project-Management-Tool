const jwt = require("jsonwebtoken");
const Project = require("../models/projectModel");

require("dotenv").config();

exports.authenticateUser = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({
            error: "No access token",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
        if (err) {
            return res.status(403).json({
                error: "Invalid Token",
            });
        }
        req.user = result.id;
        next();
    });
};

exports.authenticateMember = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    const projectId = req.body.project || req.params.id;

    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({
            error: "No access token",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
        if (err) {
            return res.status(403).json({
                error: "Invalid Token",
            });
        }

        let project = await Project.findById(projectId);

        console.log(project);

        if (!project.members.includes(result.id)) {
            return res.status(403).json({
                error: "You are not authorized to perform this action",
            });
        }

        req.user = result.id;

        next();
    });
};

exports.authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    const projectId =  req.body.project || req.params.id ;

    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({
            error: "No access token",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
        if (err) {
            return res.status(403).json({
                error: "Invalid Token",
            });
        }

        let project = await Project.findById(projectId);

        if (project.createdBy != result.id) {
            return res.status(403).json({
                error: "You are not authorized to perform this action",
            });
        }

        req.user = result.id;

        next();
    });
};
