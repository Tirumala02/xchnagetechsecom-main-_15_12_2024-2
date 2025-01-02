import axios from 'axios';
import* as cheerio from 'cheerio';

async function scrapeAmazonProduct(productUrl) {
    try {
        // Make a GET request to the product page
        const { data } = await axios.get(productUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Cookie': 'session-id=257-3703096-7411867; ubid-acbin=262-8903529-8818126; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20067%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1734331011%7C12%7CMCAAMB-1734331011%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1733733411s%7CNONE%7CvVersion%7C5.5.0%7CMCCIDH%7C545471373; mbox=PC#3b54445e15c94b729752408c2ba856ee.41_0#1796977484|session#bad0eaf1d54c4a8d8204712e7865979e#1733734544; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1733734466%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="0rOgPR9509Oa80WOBp1JXRD57XvDBnuQwiPGKW3TIb+AkeOpRyO4Q7yefQ65Nfe0MT0p30ljnEsYxKL5m7gveUj9TLHAcaWG6dNbo9MNOVyxkzQLbH3h9WEUlc98zo9NB2E5LXhyp7sxkINythQqFpq2wTF7WQekCfyd2+5nOrJTznu8RVrnxcedUYTKNRd0cskCbJP+JnjZ44I/f/IeByjQBE6kkRvG+GvR2lMFdtnAiSAW1tBtTTHqoDBlb8pTj364yC0rQtkFv4za7v1FulZnkAJWZq8u0P9RMObkqbvyn00PNsoPjXmCR8C4Uy0OwxGL5rzKZRiT72LcOv/Y/rYQB6wC5GXSs0PpeoH+HmRSoFYCGBkbuWULmF3aDQzc"; x-acbin="vJjD2tXppR8LQY7u5uH2oZ?mNmCpCcmRjYGH9Q?BuNoWUndFgcgx@bTyQwIdv5?D"; at-acbin=Atza|IwEBIIc0xO_XpGjeNwLAVBb00uRIzpcB4DJDp3QGngKwersM7Bktq34cmak5Q6m0ftgUbjUhNd-TiTJXWYp4MU08ZzJp8V8XllgNYVDEVpqhldvs6q8kVfFtCKILGoku7jlyOZ0EprRLirhhTiXQ6lDv93EcyNgvJxCrmyn5slwQYDZCGfOmZzl9LJM1ctPrnCIEDwKSo7EYL23zxfiZckSn0B5lm6gZRvVn2uK2ASsHSKz2dzud7y6l-a6ejMgux3IW-mQ; sess-at-acbin="9vsMY/scG6lf+3zC6Wrka+fADavJ96AloNG+LOy+XDA="; sst-acbin=Sst1|PQGm5OnbNvpJgO0hlrf-M5dECWbpJE5I6MWl9jTWvV6V4PMRCnNkx783gO-w7CCGy_wl_t0AMYXfMeA6SLj0k9UXDAZx0dCk0llB68l-nzgn76U4wr-aVbXl8h1GHV0abfCmTO49Aoica8L8E7t3ZGqw233jHDCZ165mr7n14b51d3r_kn7yoLnW8qS_loSTyWI9vud5KQ-o-8YU8ocUXKJtOqLk3gXGAT2homGr5r2uuD2lI1yInlDOe_NBloMJDCUFbqaenmC4yeb0JYRdS9CalrYNGXRjv7F27CH0Z98VOQc; session-id-time=2082787201l; sp-cdn=J4F7; ', // Add all relevant cookies here
            },
        });

        const $ = cheerio.load(data);

        // Scrape product details
        const title = $('#productTitle').text().trim();
        const price = $('#corePrice_desktop .priceblock_vat_excl_price .a-price .a-offscreen').first().text().trim(); // Extract price from corePrice_desktop
        const category = $('#wayfinding-breadcrumbs_feature_div ul.a-unordered-list li span.a-list-item')
            .map((i, el) => $(el).text().trim())
            .get()
            .join(' > ');
        const features = $('#feature-bullets ul li span.a-list-item')
            .map((i, el) => $(el).text().trim())
            .get();
        const description = $('#productDescription p').text().trim();

        // Log the results
        console.log('Product Details:');
        console.log(`Title: ${title}`);
        console.log(`Price: ${price || 'Not Found'}`);
        console.log(`Category: ${category || 'Not Found'}`);
        console.log('Features:');
        features.forEach((feature, index) => console.log(`  ${index + 1}. ${feature}`));
        console.log(`Description: ${description || 'Not Found'}`);
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Example usage with the provided product URL
const productUrl = 'https://www.amazon.in/KEDARFAB-Jacquard-Semi-Stitched-Lehenga-Duaptta/dp/B0CS9RXR8D';
scrapeAmazonProduct(productUrl);
