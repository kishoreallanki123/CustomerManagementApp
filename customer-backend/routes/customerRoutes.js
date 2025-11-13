// routes/customerRoutes.js
import express from 'express';
import CustomerController from '../controllers/CustomerController.js';
const router = express.Router();

router.get('/', CustomerController.getAll.bind(CustomerController));
router.post('/', CustomerController.create.bind(CustomerController));
router.put('/:id', CustomerController.update.bind(CustomerController));
router.delete('/:id', CustomerController.delete.bind(CustomerController));

export default router;
