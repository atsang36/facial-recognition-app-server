require("dotenv").config();

const Clarifai = require("clarifai");
const { response } = require("express");
const CLARIFAI_API_KEY = process.env.REACT_APP_CLARIFAI_API_KEY;

const app = new Clarifai.App({
  apiKey: CLARIFAI_API_KEY,
});

const handleApiCall = (req, res) => {
  try {
    const responnse = await app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      req.body.input
    );
    res.json(response);
  } catch (error) {
    res.status(400).json("unable to work with image recognition api");
  }
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  try {
    await db("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries");
    res.json(users[0]);
  } catch (err) {
    res.status(400).json("unable to get entries");
  }
};
module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall,
};
