const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// User routes
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Loan routes
router.get("/loans", adminController.getAllLoans);
router.get("/loans/:id", adminController.getLoanById);
router.post("/loans", adminController.createLoan);
router.put("/loans/:id", adminController.updateLoan);
router.delete("/loans/:id", adminController.deleteLoan);

// Loan approval routes
router.put("/loans/:id/approve", adminController.approveLoan);
router.put("/loans/:id/reject", adminController.rejectLoan);

module.exports = router;
