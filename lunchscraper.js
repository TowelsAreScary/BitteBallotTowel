const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');



async function fetchAndParseURL(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Assuming the lunch menu is included as an item in the array of events
        const eventsToday = [];
        $('.fsCalendarToday .fsCalendarEventTitle').each((i, elem) => {
            eventsToday.push($(elem).text().trim());
            console.log(eventsToday)
        });

        // Extract the lunch menu from the events array using regular expressions
        const lunchMenuRegex = /Lunch Menu: (.+)/;
        const lunchMenu = eventsToday.find(event => lunchMenuRegex.test(event));

        if (lunchMenu) {
            // Extract the actual menu text using the regex match
            const menuText = lunchMenu.match(lunchMenuRegex)[1];

            // Write the lunch menu to a file
            fs.writeFile('lunchMenu.txt', menuText, (err) => {
                if (err) {
                    console.error('Error writing lunch menu to file:', err);
                } else {
                    console.log('Lunch menu saved to file');
                }
            });
        } else {
            console.log('Lunch menu not found in events');
        }
    } catch (error) {
        console.error('Error fetching or parsing the page:', error);
    }
}

// Replace 'http://example.com' with the actual URL
fetchAndParseURL('https://www.lwhs.org/calendar1');