import axios from 'axios';
import * as cheerio from 'cheerio';

async function searchAmazonNewReleases() {
    try {
        // Amazon New Releases URL
        const url = `https://www.amazon.in/gp/new-releases/electronics`;

        // Make a request with the appropriate headers
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Cookie': 'session-id=260-3124270-2308463; ubid-acbin=262-8903529-8818126; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg= 179643557%7CMCIDTS%7C20067%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1734331011%7C12%7CMCAAMB-1734331011%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1733733411s%7CNONE%7CvVersion%7C5.5.0%7CMCCIDH%7C545471373; mbox= PC#3b54445e15c94b729752408c2ba856ee.41_0#1796977484|session#bad0eaf1d54c4a8d8204712e7865979e#1733734544; adcloud= {%22_les_v%22:%22y%2Camazon.in%2C1733734466%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token=" ETVSAKQfH8UDbKkxdo+st+xwveX0Y3y+L75EW6CgsGnn15aWXcKoMw3tb9USEIAe3LFs/yQZaACdsL+T7EzUBvdnpN2ynMHbCKjd8mLx9LxQb7VFLnVd3mQ9pc3cHlEmfQHjcuGvZzcpCxcgTfJLT/ngXpsVOGHA2KcFI2x1oMI156ki5WTZT6/x0ewNj/DhVxdjAUD7qHXC1hpYAuy/0xRd+K3vfiwyU2yr0EDCRdkxZPYiyWST4vOLpU9uckRCyYsb5Gpc35kHWeA9/VllBQE9AWcT05XkAczmK7LYTM0H1NGra3/DZkRK7DbwL9nSsVZZBGD8GO3nY7pbxGaxMBUkOQU6sp18lf1GppqZoWrd8TE1ePLWlngsNyxAYWU9"; x-acbin="O4mwO6PPhQ6ZBN9oP0b09lrX@7rObOq9or?@Szw9qkbzYfBgLJgkJKMR0oxpZmRr"; at-acbin= Atza|IwEBIGza8h0mV67_eQdKFrWVmr8KGIawWDh6Q893UGWYdm4TdN3E49sgAOUXblbVdkqTKC_R-A41SI68HgkcNrxzuffHL4DfkBcbQ2ulShAo7kM_w7k-qjKvVsa128qyk3w7vszdmxjXCD0WC3Tz9WhZndgH9KuoVebbSIBlx0038AS5rDzP5bvZDGHjrRltsXIXfvMCWq5Nnj4TvDUTw4VLySpBCheJkHKAhXeHaxcuK8TaRA; sess-at-acbin="SeRaJP/Tk8VNeSII+b4MUH/L3Aqcsml5gqoEQzgqBJQ="; sst-acbin= Sst1|PQGm5OnbNvpJgO0hlrf-M5dECWbpJE5I6MWl9jTWvV6V4PMRCnNkx783gO-w7CCGy_wl_t0AMYXfMeA6SLj0k9UXDAZx0dCk0llB68l-nzgn76U4wr-aVbXl8h1GHV0abfCmTO49Aoica8L8E7t3ZGqw233jHDCZ165mr7n14b51d3r_kn7yoLnW8qS_loSTyWI9vud5KQ-o-8YU8ocUXKJtOqLk3gXGAT2homGr5r2uuD2lI1yInlDOe_NBloMJDCUFbqaenmC4yeb0JYRdS9CalrYNGXRjv7F27CH0Z98VOQc; session-id-time=2082787201l; sp-cdn=J4F7;', // Add all relevant cookies here
            },
        });

        const $ = cheerio.load(data);

        // Scrape product details (title, price, image, delivery date)
        const products = [];
        $('#gridItemRoot .p13n-sc-uncoverable-faceout').each((index, element) => {
            const title = $(element).find('div .a-link-normal').text().trim();
            const price = $(element).find('div div').next().next().next('div').find('a-link-normal a-text-normal').text().trim();
            // const image = $(element).find('img').attr('src');
            // const link = 'https://www.amazon.in' + $(element).find('.a-link-normal').attr('href');
            // const rating = $(element).find('.a-icon-alt').text().trim();
            
            // You can extract the delivery date if available in a specific part of the HTML
            // const deliveryDate = $(element).find('.a-color-secondary').text().trim(); // Adjust the selector if needed

            // if (title && price && image && link) {
                // products.push({ title, price, image, link, rating, deliveryDate });
                products.push({ title,price });
            // }
        });

        // Display the results
        if (products.length > 0) {
            console.log('Found Products:');
            products.forEach(product => {
                console.log(`Title: ${product.title}\n`);
                console.log(`Price: ${product.price}`);
                // console.log(`Delivery Date: ${product.deliveryDate || 'Not available'}`);
                // console.log(`Image URL: ${product.image}`);
                // console.log(`Product Link: ${product.link}\n`);
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
