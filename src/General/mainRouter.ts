import express from "express";
const router = express.Router();

import UsersRoute from "./routes/UserRoute";

router.use("/users", UsersRoute);

export default router;
