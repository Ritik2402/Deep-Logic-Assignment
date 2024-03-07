const express = require('express');
const request = require('request');
const { parse } = require('node-html-parser');

const app = express();
const PORT = 3000;

const extractLatestStories = (html) => {
    const root = parse(html);
    const latestStories = [];

    const latestSection = root.querySelector('div.partial.latest-stories');

    console.log(latestSection);
    if (latestSection) {
        const storyItems = latestSection.querySelectorAll('li.latest-stories__item');
        storyItems.slice(0, 6).forEach(item => {
            const storyTitle = item.querySelector('h3.latest-stories__item-headline').text.trim();
            const storyUrl = item.querySelector('a').getAttribute('href');
            latestStories.push({ title: storyTitle, url: storyUrl});
        });
    }

    return latestStories;
};

app.get('/getTimeStories', (req, res) => {
    const url = 'https://time.com';
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const latestStories = extractLatestStories(body);
            res.json(latestStories);
        } else {
            res.status(500).send('Internal Server Error');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
