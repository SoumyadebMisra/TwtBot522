require("dotenv").config();
const axios = require("axios").default;
const fs = require("fs");

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: "stream",
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on("finish", () => resolve())
          .on("error", (e) => reject(e));
      })
  );

const options = {
  method: "GET",
  url: "https://meme-api.herokuapp.com/gimme/ProgrammerHumor",
};




module.exports.download_image = download_image;
module.exports.options = options;
