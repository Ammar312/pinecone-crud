import express from "express";
const router = express.Router();

router.post("/login", (req, res, next) => {
  console.log("This is login");
  res.send("This is login v1 " + new Date());
});
router.post("/signup", (req, res, next) => {
  console.log("This is login");
  res.send("This is signup v1 " + new Date());
});

export default router;
