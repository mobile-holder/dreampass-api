var express = require("express");
var router = express.Router();
var Users = require("../entities/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", function (req, res, next) {
  try {
    const { uid, name, company, location } = req.body;

    const userEntity = new Users();
    const pushResult = userEntity.pushData({
      uid,
      name,
      company,
      location,
    });
    if (pushResult) {
      res.json({
        result: true,
      });
    } else {
      throw "Empty";
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({
      error: e || true,
    });
  }
});

router.get("/:uid", function (req, res, next) {
  try {
    const { uid } = req.params;

    const userEntity = new Users();
    const targetData = userEntity.getOneData(uid);

    if (targetData)
      res.json({
        ...targetData,
      });
    else throw "Empty";
  } catch (e) {
    console.log(e);
    res.status(401).json({
      error: e || true,
    });
  }
});

router.delete("/:uid", function(req, res, next) {
  try{
    const { uid } = req.params;

    const userEntity = new Users();
    const deleteResult = userEntity.deleteOne(uid);
    if(deleteResult){
      res.json({
        result: true,
      });
    } else 
    throw "Empty";

  } catch {
    console.log(e);
    res.status(401).json({
      error: e || true,
    });
  }
})

module.exports = router;
