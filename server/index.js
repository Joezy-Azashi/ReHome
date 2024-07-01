const express = require('express');
const path = require('path');
const fs = require("fs");
const { getPageById } = require('./stub/pages.js');
const compression = require('compression');
const app = express();

const PORT = process.env.PORT || 4000;
const indexPath  = path.resolve(__dirname, '..', 'build', 'home.html');

if (!process.env.API_BASEURL)
    process.env.API_BASEURL = "https://api.rehomeofficial.com"

if (!process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL = "https://www.rehomeofficial.com"
}

//enabling gzip compression
app.use(compression())

// static resources should just be served as they are
app.use(express.static(
    path.resolve(__dirname, '..', 'build'),
    { maxAge: '0' },
));

app.get('/robots.txt', function (req, res) {
    if (process.env.NODE_ENV ==='production'){
        res.type('text/plain');
        res.send("User-agent: *\nDisallow:\n\nSitemap: https://www.rehomeafrica.com/sitemap.txt\n");
    } else {
        res.type('text/plain');
        res.send("User-agent: *\nDisallow: /");
    }
});

app.get('/sitemap.txt', function(req, res) {
    (async () => {
        try {
            const params = "filter=%7B%0A%20%20%22offset%22%3A%200%2C%0A%20%20%22limit%22%3A%20100%2C%0A%20%20%22skip%22%3A%200%2C%0A%20%20%22where%22%3A%20%7B%0A%20%20%20%20%22propertyType%22%3A%20%7B%22neq%22%3A%20%22development%22%7D%2C%0A%20%20%20%20%22published%22%3A%20true%0A%20%20%7D%2C%0A%20%20%22fields%22%3A%20%7B%0A%20%20%20%20%22deleted%22%3A%20false%2C%0A%20%20%20%20%22deletedOn%22%3A%20false%2C%0A%20%20%20%20%22deletedBy%22%3A%20false%2C%0A%20%20%20%20%22id%22%3A%20true%2C%0A%20%20%20%20%22name%22%3A%20false%2C%0A%20%20%20%20%22propertyType%22%3A%20false%2C%0A%20%20%20%20%22gpsLocation%22%3A%20false%2C%0A%20%20%20%20%22geoAddress%22%3A%20false%2C%0A%20%20%20%20%22description%22%3A%20false%2C%0A%20%20%20%20%22transactionType%22%3A%20false%2C%0A%20%20%20%20%22propertyStatus%22%3A%20false%2C%0A%20%20%20%20%22sizeOfHouse%22%3A%20false%2C%0A%20%20%20%20%22sizeOfLand%22%3A%20false%2C%0A%20%20%20%20%22numberOfViews%22%3A%20false%2C%0A%20%20%20%20%22furnishingOptions%22%3A%20false%2C%0A%20%20%20%20%22bedrooms%22%3A%20false%2C%0A%20%20%20%20%22weight%22%3A%20false%2C%0A%20%20%20%20%22bathrooms%22%3A%20false%2C%0A%20%20%20%20%22halfBathrooms%22%3A%20false%2C%0A%20%20%20%20%22year_constructed%22%3A%20false%2C%0A%20%20%20%20%22pictures%22%3A%20false%2C%0A%20%20%20%20%22videos%22%3A%20false%2C%0A%20%20%20%20%22tour3D%22%3A%20false%2C%0A%20%20%20%20%22price%22%3A%20false%2C%0A%20%20%20%20%22hidePrice%22%3A%20false%2C%0A%20%20%20%20%22priceInGHS%22%3A%20false%2C%0A%20%20%20%20%22currency%22%3A%20false%2C%0A%20%20%20%20%22rehomeEstimate%22%3A%20false%2C%0A%20%20%20%20%22taxApplicable%22%3A%20false%2C%0A%20%20%20%20%22sponsored%22%3A%20false%2C%0A%20%20%20%20%22documents%22%3A%20false%2C%0A%20%20%20%20%22published%22%3A%20false%2C%0A%20%20%20%20%22companyId%22%3A%20false%2C%0A%20%20%20%20%22verified%22%3A%20false%2C%0A%20%20%20%20%22userId%22%3A%20false%2C%0A%20%20%20%20%22draftId%22%3A%20false%2C%0A%20%20%20%20%22units%22%3A%20false%2C%0A%20%20%20%20%22amenities%22%3A%20false%2C%0A%20%20%20%20%22features%22%3A%20false%2C%0A%20%20%20%20%22createdAt%22%3A%20false%2C%0A%20%20%20%20%22updatedAt%22%3A%20false%2C%0A%20%20%20%20%22unavailableAt%22%3A%20false%0A%20%20%7D%0A%7D"

            const response = await fetch(`${process.env.API_BASEURL}/api/rehome-properties?`+params);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            let listing = "https://www.rehomeafrica.com/\n" +
                "https://www.rehomeafrica.com/buy\n" +
                "https://www.rehomeafrica.com/rent\n" +
                "https://www.rehomeafrica.com/off-plan\n" +
                "https://www.rehomeafrica.com/mortgage\n" +
                "https://www.rehomeafrica.com/find-a-broker\n" +
                "https://www.rehomeafrica.com/about\n" +
                "https://www.rehomeafrica.com/about#contactUs\n" +
                "https://www.rehomeafrica.com/privacypolicy\n" +
                "https://www.rehomeafrica.com/terms&conditions\n" +
                "https://www.rehomeafrica.com/advertise\n" +
                "https://www.rehomeafrica.com/help\n"

            data.forEach((item) => {
                listing += `${process.env.FRONTEND_URL}/listing/${item.id}/details\n`
            })
            res.type('text/plain');
            res.send(`${listing}`)
        } catch (error) {
            console.log(error)
            res.send("")
        }
    })().catch(err => {
        console.log(err)
        console.error(err);
        res.send("")
    });

})

app.get('*', (req, res, next) => {
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        if (err) {
            console.error('Error during file reading', err);
            return res.status(404).end()
        }
        // get normal page info
        const pageId = req.path.slice(1)
        let page = getPageById("home");
        if (pageId.trim() != ""){
             page = getPageById(pageId);
        }

        //listings and developments
        if (req.path.startsWith('/listing/') || req.path.startsWith('/development/')) {
            const id = req.path.split('/')[2];
            try {
                const response = await fetch(`${process.env.API_BASEURL}/api/rehome-properties/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                page = {
                    title: data.name,
                    description: data.description,
                    thumbnail: data.pictures[0]
                }
            } catch (error) {
                console.log(error)
            }
        }

        //brokers
        if (req.path.startsWith('/brokers/')) {
            const id = req.path.split('/')[3];
            try {
                const response = await fetch(`${process.env.API_BASEURL}/api/users/safe/${id}?filter={"include":["agencies"]}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                //console.log(data)
                page = {
                    title: data.agencies[0].name,
                    description: data?.agencies[0]?.description ? data?.agencies[0]?.description : data.agencies[0].address,
                    thumbnail: data?.agencies[0]?.logo || data?.avatar
                }
            } catch (error) {
                console.log(error)
            }
        }


        //if page is undefined then use home page tags
        if (!page) {
            page = getPageById("home");
        }

        // inject meta tags
        htmlData = htmlData
            .replace("<title>ReHome Africa</title>", `<title>${page.title}</title>`)
            .replace('__META_OG_TITLE__', page.title)
            .replace('__META_OG_DESCRIPTION__', page.description)
            .replace('__META_DESCRIPTION__', page.description)
            .replace('__META_OG_IMAGE__', page.thumbnail)

        return res.send(htmlData);
    });
});

// listening...
app.listen(PORT, (error) => {
    if (error) {
        return console.log('Error during app startup', error);
    }
    console.log("listening on " + PORT + "...");
});