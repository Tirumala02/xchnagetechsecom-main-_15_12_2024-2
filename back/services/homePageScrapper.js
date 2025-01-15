import axios from 'axios';
import * as cheerio from 'cheerio';

async function searchAmazonNewReleases() {
    try {
        // Amazon New Releases URL
        const url = `https://www.amazon.in/gp/new-releases/electronics`;

        // Rotate User-Agent for better anti-scraping evasion
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
            // Add more user-agents as needed
        ];

        // Rotate User-Agent and Cookie for each request to mimic real user behavior
        const headers = {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
            'Cookie': 'session-id=262-6056897-5987938; ubid-acbin=258-5332390-7652227; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737527220%7C12%7CMCAAMB-1737527220%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736929620s%7CNONE%7CvVersion%7C5.5.0; mbox=session#a0771eaac02a4d4f9cbde27ef30b42f8#1736924282|PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800167222; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736924221%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="ZnVBWK4HH4/yMlA0bTOKuilja7Z4Pt0Xe+06pPvU52FOxuviS9xCIxWkkRGDQsLVt71UrDVENSf6WCt5tA3hOZ8AcVusRBVuwXLiYVVbisnCYayliOTEENlTgRMsRgLJ61nfig6cA6hdQMkdMVDgBiM9UiWt2B+CAA++2uRGYyOdPWvTBMZ3E7UfJvRtsJ0MfWifP/u/tt711oNLHUid7lDtbuUrVZ6ULiYxwBDk0xLI3EaKyHtFD82ZIgG0xt+/CvOjxUkxIoh3c49DhWUdwO0Bw5CtJf2b69T3lyoxewyfuLa3T5TO9utN+iD29qao6lnnqxKo7ilH242CC7tcT+4oOAgDkUGUvkqljyfmA/nWu0NEjhPbS16njzqcJEE3";',
            // Add other necessary headers as needed
        };

        // Make the request with the appropriate headers
        const { data } = await axios.get(url, { headers });

        const $ = cheerio.load(data);
        const products = [];
        
        // Update selector and structure for extracting data based on the page's HTML structure
        $('#gridItemRoot .p13n-sc-uncoverable-faceout').each((index, element) => {
            const title = $(element).find('div .a-link-normal').text().trim();
            const price = $(element).find('div div').next().next().next('div').find('a-link-normal a-text-normal').text().trim();

            if (title && price) {
                products.push({ title, price });
            }
        });

        // Display the results
        if (products.length > 0) {
            console.log('Found Products:');
            products.forEach(product => {
                console.log(`Title: ${product.title}\n`);
                console.log(`Price: ${product.price}`);
            });
        } else {
            console.log('No products found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Run the function to scrape the New Releases page
searchAmazonNewReleases();
