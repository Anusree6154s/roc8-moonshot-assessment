import { Router } from "express";
import {
  getData,
  signup,
  checkauth,
  signin,
} from "../controllers/user.controller";

const routes = Router();

routes
  .get("/getData", getData)
  .post("/question2/signup", signup)
  .post("/question2/checkauth", checkauth)
  .post("/question2/signin", signin);

export default routes;
