const router = require("express").Router();

const {
    createProject,
    getProjects,
    getProjectById,
    addMember,
    deleteProject,
    getMembers,
    removeMember,
    updateProject,
    viewProjectTasks,
} = require("../controllers/projectController");
const {
    authenticateUser,
    authenticateAdmin,
    authenticateMember,
} = require("../middlewares/authenticateUser");

router.post("/projects", authenticateUser, createProject);
router.get("/projects", authenticateAdmin, getProjects);
router.get("/projects/:id", authenticateMember, getProjectById);
router.put("/projects/:id", authenticateAdmin, updateProject);
router.delete("/projects/:id", authenticateAdmin, deleteProject);
router.post("/projects/:id/members", authenticateAdmin, addMember);
router.get("/projects/:id/members", authenticateAdmin, getMembers);
router.get("/projects/:id/tasks", authenticateMember, viewProjectTasks);
router.delete(
    "/projects/:id/members/:memberId",
    authenticateAdmin,
    removeMember
);

module.exports = router;
