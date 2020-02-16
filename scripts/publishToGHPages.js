const path = require("path");
const ghpages = require("gh-pages");

ghpages.publish(path.resolve(__dirname, "../dist"), err => {
    if (err) console.error("Something went wrong!!!", err);

    console.log("All good.");
});
