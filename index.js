console.log(window.location.pathname);
const url = new URL(window.location.href);

const path = url.searchParams.get("path");

if (/medicines\/.*/.test(path)) {
    console.log("Medicine");

    const id = path.split("/")[1];

    fetch(`https://54.229.114.61/product-forms/${id}`)
        .then((res) => res.json())
        .then((medicine) => {
            console.log(medicine);
            document
                .querySelector('meta[property="og:url"]')
                .setAttribute("content", window.location.href);
            document
                .querySelector('meta[property="og:title"]')
                .setAttribute("content", medicine?.product_name);
            document
                .querySelector('meta[property="og:description"]')
                .setAttribute("content", medicine?.description);
            document
                .querySelector('meta[property="og:image"]')
                .setAttribute("content", medicine?.image);
        });
}
// window.location.replace(`medic:/${window.location.pathname}`);
