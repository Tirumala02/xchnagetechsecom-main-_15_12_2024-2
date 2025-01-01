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
                'Cookie': 'session-id=145-3258532-6168631; ubid-acbin=2262-8903529-8818126; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20067%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1734331011%7C12%7CMCAAMB-1734331011%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1733733411s%7CNONE%7CvVersion%7C5.5.0%7CMCCIDH%7C545471373; mbox=PC#3b54445e15c94b729752408c2ba856ee.41_0#1796977484|session#bad0eaf1d54c4a8d8204712e7865979e#1733734544; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1733734466%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="Kdl9h0C8gwdczyYBW45sq73U1mXkxlJgsPvO3/lGkTir47QGcEjrI7XPjBn5UK9fGzcRclsAYta7JJtfWHxzMUh8a2AZspjln90LK2K4znFcB+UaKP8N7sirq40sP4FZIisKcBxE9VAAV6h48zfJnDO9K+RW4FZgzEGPSrKc6fXPOr/jVXvHuTRGqzq0hSO/9vxfO7XxBic196GwxhmEzgfj8o32U6OKvhgQvUnRhPGR60b4yaAVXUzVpm1BkuDfWn/Me2eRZrwWxs+VITmZYreZxc+N1RJxFIA25r+ONRUy0QPMnab1KHoyxO7Ut7Mu2dzMPZD2xrPnRgnDgRUg5j20tkB04U/h"; x-acbin="nzlg4dA52EJ63gp2ny216ScZHHYmjyOy6coeHaCT7Us8LGKQeCKyCNSHPEgzpV9f"; at-acbin=Atza|IwEBIIc0xO_XpGjeNwLAVBb00uRIzpcB4DJDp3QGngKwersM7Bktq34cmak5Q6m0ftgUbjUhNd-TiTJXWYp4MU08ZzJp8V8XllgNYVDEVpqhldvs6q8kVfFtCKILGoku7jlyOZ0EprRLirhhTiXQ6lDv93EcyNgvJxCrmyn5slwQYDZCGfOmZzl9LJM1ctPrnCIEDwKSo7EYL23zxfiZckSn0B5lm6gZRvVn2uK2ASsHSKz2dzud7y6l-a6ejMgux3IW-mQ; sess-at-acbin="9vsMY/scG6lf+3zC6Wrka+fADavJ96AloNG+LOy+XDA="; sst-acbin=Sst1|PQGm5OnbNvpJgO0hlrf-M5dECWbpJE5I6MWl9jTWvV6V4PMRCnNkx783gO-w7CCGy_wl_t0AMYXfMeA6SLj0k9UXDAZx0dCk0llB68l-nzgn76U4wr-aVbXl8h1GHV0abfCmTO49Aoica8L8E7t3ZGqw233jHDCZ165mr7n14b51d3r_kn7yoLnW8qS_loSTyWI9vud5KQ-o-8YU8ocUXKJtOqLk3gXGAT2homGr5r2uuD2lI1yInlDOe_NBloMJDCUFbqaenmC4yeb0JYRdS9CalrYNGXRjv7F27CH0Z98VOQc; session-id-time=2082787201l; sp-cdn=J4F7; ', // Add all relevant cookies here
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
