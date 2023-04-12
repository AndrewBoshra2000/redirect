const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const app = express();

const getPage = (
    title = "",
    description = "",
    image = "",
    url = "http://localhost:3000"
) => {
    const filePath = path.join(__dirname, "public", "index.html");

    const file = fs.readFileSync(filePath, "utf8");

    const html = file
        .replace("{{title}}", title)
        .replace("{{description}}", description)
        .replace("{{image}}", image);

    return html;
};
app.get("/", async (req, res) => {
    const path = req.query.path;

    if (/medicines\/.*/.test(path)) {
        console.log("Medicine");

        const id = path.split("/")[1];

        const resp = await fetch(`http://54.229.114.61/product-forms/${id}`);
        const medicine = await resp.json();

        return res.send(
            getPage(
                medicine?.product_name,
                medicine?.description,
                medicine?.image
            )
        );
    }

    res.send(getPage());
});

const { createProxyMiddleware } = require("http-proxy-middleware");

const splunkUrl = "http://splunk.getmedic.co:8088/services/collector";
app.use(
    "/splunk",
    createProxyMiddleware({
        target: splunkUrl,
        changeOrigin: false,

        followRedirects: true,
        logLevel: "debug",
        pathRewrite: {
            "^/splunk": "",
        },
        headers: {
            Authorization: "Splunk 90d4d19e-6eac-4edb-b414-09b43949175e",
        },
        onProxyRes: function (proxyRes, req, res) {
            proxyRes.headers["Access-Control-Allow-Origin"] = "*";
            proxyRes.headers["Access-Control-Allow-Headers"] = "Authorization";
        },
    })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}/`);
});
