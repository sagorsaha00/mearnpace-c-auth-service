import { AuthControllers } from './../controllers/AuthControllers';
import  express from "express";
 

const router = express.Router();
const authControllers = new AuthControllers();

router.post('/register', (res,req) =>  authControllers.register(req,res))

 export default router;