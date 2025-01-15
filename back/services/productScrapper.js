

import axios from 'axios';
import * as cheerio from 'cheerio';



async function scrapeAmazonProduct(productUrl) {
    try {
        const response = await axios.get('https://xchnagetechsecom-main-15-12-2024-2.onrender.com/api/admin/value-changer'); // Adjust the URL as needed
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch addPercentage value.");
        }
        const  addDeliveryBuffer= response.data.values.deliveryLeadTime.value;
        const addPercentage = response.data.values.priceMargin.value;
        console.log('addPercentage : ',addPercentage)

        // Make a GET request to the product page
        const { data } = await axios.get(productUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Cookie': 'session-id=260-3124270-2308463; ubid-acbin=262-8903529-8818126; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg= 179643557%7CMCIDTS%7C20067%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1734331011%7C12%7CMCAAMB-1734331011%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1733733411s%7CNONE%7CvVersion%7C5.5.0%7CMCCIDH%7C545471373; mbox= PC#3b54445e15c94b729752408c2ba856ee.41_0#1796977484|session#bad0eaf1d54c4a8d8204712e7865979e#1733734544; adcloud= {%22_les_v%22:%22y%2Camazon.in%2C1733734466%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token=" ETVSAKQfH8UDbKkxdo+st+xwveX0Y3y+L75EW6CgsGnn15aWXcKoMw3tb9USEIAe3LFs/yQZaACdsL+T7EzUBvdnpN2ynMHbCKjd8mLx9LxQb7VFLnVd3mQ9pc3cHlEmfQHjcuGvZzcpCxcgTfJLT/ngXpsVOGHA2KcFI2x1oMI156ki5WTZT6/x0ewNj/DhVxdjAUD7qHXC1hpYAuy/0xRd+K3vfiwyU2yr0EDCRdkxZPYiyWST4vOLpU9uckRCyYsb5Gpc35kHWeA9/VllBQE9AWcT05XkAczmK7LYTM0H1NGra3/DZkRK7DbwL9nSsVZZBGD8GO3nY7pbxGaxMBUkOQU6sp18lf1GppqZoWrd8TE1ePLWlngsNyxAYWU9"; x-acbin="O4mwO6PPhQ6ZBN9oP0b09lrX@7rObOq9or?@Szw9qkbzYfBgLJgkJKMR0oxpZmRr"; at-acbin= Atza|IwEBIGza8h0mV67_eQdKFrWVmr8KGIawWDh6Q893UGWYdm4TdN3E49sgAOUXblbVdkqTKC_R-A41SI68HgkcNrxzuffHL4DfkBcbQ2ulShAo7kM_w7k-qjKvVsa128qyk3w7vszdmxjXCD0WC3Tz9WhZndgH9KuoVebbSIBlx0038AS5rDzP5bvZDGHjrRltsXIXfvMCWq5Nnj4TvDUTw4VLySpBCheJkHKAhXeHaxcuK8TaRA; sess-at-acbin="SeRaJP/Tk8VNeSII+b4MUH/L3Aqcsml5gqoEQzgqBJQ="; sst-acbin= Sst1|PQGm5OnbNvpJgO0hlrf-M5dECWbpJE5I6MWl9jTWvV6V4PMRCnNkx783gO-w7CCGy_wl_t0AMYXfMeA6SLj0k9UXDAZx0dCk0llB68l-nzgn76U4wr-aVbXl8h1GHV0abfCmTO49Aoica8L8E7t3ZGqw233jHDCZ165mr7n14b51d3r_kn7yoLnW8qS_loSTyWI9vud5KQ-o-8YU8ocUXKJtOqLk3gXGAT2homGr5r2uuD2lI1yInlDOe_NBloMJDCUFbqaenmC4yeb0JYRdS9CalrYNGXRjv7F27CH0Z98VOQc; session-id-time=2082787201l; sp-cdn=J4F7;', // Add all relevant cookies here

            },
        });

        const $ = cheerio.load(data);

        const asinMatch = productUrl.match(/\/dp\/([A-Z0-9]{10})/);  // Extract ASIN from the product link
        const asin = asinMatch ? asinMatch[1] : null;
        // Scrape product details
        const title = $('#productTitle').text().trim();
        // let price = $('#corePrice_desktop .priceblock_vat_excl_price .a-price .a-offscreen').first().text().trim(); // Extract price from corePrice_desktop
        let price = $('#corePrice_desktop .priceblock_vat_excl_price .a-price .a-offscreen').first().text().trim().replace('₹', '');
            price = price.replace(/,/g, '')
            price = parseFloat(price);
            price = Math.round((price + price * (addPercentage / 100)) * 100) / 100;



        let iprice = $('.a-price .a-offscreen').eq(1).text().trim().replace('₹', '')
            iprice = iprice.replace(/,/g, '');
            iprice = parseFloat(iprice);
            iprice = Math.round((iprice + iprice * (addPercentage / 100)) * 100) / 100;
        

        const category = $('#wayfinding-breadcrumbs_feature_div ul.a-unordered-list li span.a-list-item')
            .map((i, el) => {
                const text = $(el).text().trim();
                return text !== '›' ? text : null; // Exclude '›' from the results
            })
            .get()
            .filter(Boolean); // Remove null or undefined values


        const imageUrls = [];

        // Select all <li> elements within the targeted <ul> list
        $('ul.a-unordered-list.a-nostyle.a-horizontal.list.maintain-height ').each((index, element) => {
            // Find the <img> tag inside the current <li>
            const imgElement = $(element).find('img');
            if (imgElement.length) {
                // Extract the image URL from the `src` attribute
                const imgSrc = imgElement.attr('src');
                if (imgSrc) {
                    imageUrls.push(imgSrc);
                }
            }
        });

        const features = $('#feature-bullets ul li span.a-list-item')
            .map((i, el) => $(el).text().trim())
            .get();

        const description = $('#productDescription p').text().trim();

        // Extract "About This Item" section
        const aboutThisItem = $('#feature-bullets ul li span.a-list-item')
            .map((i, el) => $(el).text().trim())
            .get();

        // Extract product details table
        const productDetails = {};
        $('#productDetails_techSpec_section_1 tr').each((i, el) => {
            const key = $(el).find('th').text().trim();
            const value = $(el).find('td').text().trim();
            productDetails[key] = value;
        });

        // Extract delivery date and calculate future delivery date
        // Extract delivery date
        let rawDeliveryDate = $('#mir-layout-DELIVERY_BLOCK div').text().trim();
        let finalDeliveryDate = null;

        if (rawDeliveryDate) {
            if (/today/i.test(rawDeliveryDate)) {
                // If rawDeliveryDate contains "today", set the delivery date to 14 days from now
                finalDeliveryDate = new Date();
                finalDeliveryDate.setDate(finalDeliveryDate.getDate() + addDeliveryBuffer);
            } else if (/tomorrow/i.test(rawDeliveryDate)) {
                // If rawDeliveryDate contains "tomorrow", set the delivery date to 15 days from now
                finalDeliveryDate = new Date();
                finalDeliveryDate.setDate(finalDeliveryDate.getDate() + addDeliveryBuffer);
            } else {
                // Extract date components using regex
                const dateRegex = /(\w+),\s(\d{1,2})\s([a-zA-Z]+)(?:\s(\d{4}))?/;
                const match = rawDeliveryDate.match(dateRegex);
                if (match) {
                    const [_, dayOfWeek, day, month, year = new Date().getFullYear()] = match;
                    finalDeliveryDate = new Date(`${month} ${day}, ${year}`);
                    finalDeliveryDate.setDate(finalDeliveryDate.getDate() + addDeliveryBuffer); // Add buffer days
                }
            }
        }

        console.log(category || 'Not Found');
    

        const product = {
            asin:asin ||'Not Found',
            title: title || 'Not Found',
            price: price || 'Not Found',
            iprice:iprice || 'Not Found',
            category: category || 'Not Found',
            features: features.length > 0 ? features : ['Not Found'],
            description: description,
            aboutThisItem: aboutThisItem.length > 0 ? aboutThisItem : ['Not Found'],
            productDetails: productDetails,
            delivery: finalDeliveryDate ? finalDeliveryDate.toDateString() : 'Not Found',
            images: imageUrls.length > 0 ? imageUrls : ['Not Found'],
        };

        return product
    } catch (error) {
        console.error('Error fetching product details:', error);
    }


}

// Example usage with the provided product URL
export default scrapeAmazonProduct;