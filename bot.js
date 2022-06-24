const Twit = require("twit");
const config = require("./config");
const { download_image, options } = require("./getImage");
const fs = require("fs");
const axios = require("axios").default;

// console.log(Config);
var T = new Twit(config);

const tweeted = function (err, data, response) {
  if (err) {
    console.log("Something went wrong! " + err.stack);
  } else console.log("It worked!");
};

var tweetIt = () => {
  var txt = '#programming #programmingmeme #programminghumor';
  axios
    .request(options)
    .then(async function (response) {
      if (response.data.title !== "") {
        txt = response.data.title + " " + txt;
      }
      console.log(response.data.title);
      const img = await download_image(response.data.url, "output.png");
      console.log("Image downloaded");
      const b64content = fs.readFileSync("output.png", { encoding: "base64" });

      // first we must post the media to Twitter
      T.post(
        "media/upload",
        { media_data: b64content },
        function (err, data, response) {
          if (err) {
            console.log(err);
          } else {
            const mediaIdStr = data.media_id_string;
            const altText = "Some good old programming humor";
            const meta_params = {
              media_id: mediaIdStr,
              alt_text: { text: altText },
            };

            T.post(
              "media/metadata/create",
              meta_params,
              function (err, data, response) {
                if (!err) {
                  // now we can reference the media and post a tweet (media will attach to the tweet)
                  var params = {
                    status: txt,
                    media_ids: [mediaIdStr],
                  };

                  T.post("statuses/update", params, tweeted);
                }
              }
            );
          }
        }
      );
    })
    .catch(function (error) {
      console.error(error);
    });
};

tweetIt();
setInterval(tweetIt, 1000 * 60*60*24);