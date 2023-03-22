const express = require("express");
const fetch = require("node-fetch");

const app = express();
const getPage = ({ title = "", description = "", image = "" }) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="http://localhost:3000" />

    <title>Medic App Redirect</title>
    <script type="text/javascript" src="./index.js"></script>
</head>

<body>
    <h1>Medic App Redirect</h1>
    <p>Redirecting to Medic App...</p>
</body>

</html>
`;
app.get("/", async (req, res) => {
    const path = req.query.path;

    if (/medicines\/.*/.test(path)) {
        console.log("Medicine");

        const id = path.split("/")[1];

        const resp = await fetch(`http://54.229.114.61/product-forms/${id}`);
        const medicine = await resp.json();

        return res.send(
            getPage({
                description: medicine?.description,
                image: medicine?.image,
                title: medicine?.product_name,
            })
        );
    }

    res.send(getPage());
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
