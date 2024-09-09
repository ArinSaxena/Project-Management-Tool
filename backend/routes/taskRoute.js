const router = require("express").Router();

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    addMemberToTask,
    removeMemberFromTask,
    deleteTask,
} = require("../controllers/taskContoller");

const {
    authenticateAdmin,
    authenticateMember,
} = require("../middlewares/authenticateUser");

router.post("/tasks", authenticateAdmin, createTask);
router.get("/tasks", authenticateMember, getTasks);
router.get("/tasks/:id", authenticateMember, getTaskById);

router.put("/tasks/:id", authenticateAdmin, updateTask);

router.patch("/tasks/:id/members", authenticateAdmin, addMemberToTask);

router.put("/tasks/:id/members/remove", authenticateAdmin, removeMemberFromTask);
router.delete("/tasks/:id", authenticateAdmin, deleteTask);

module.exports = router;
