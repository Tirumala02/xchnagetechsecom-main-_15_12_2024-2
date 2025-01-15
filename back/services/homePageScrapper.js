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
                'Cookie': 'session-id=260-5885697-2340514; ubid-acbin=258-8888319-6704052; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737527220%7C12%7CMCAAMB-1737527220%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736929620s%7CNONE%7CvVersion%7C5.5.0; mbox=session#a0771eaac02a4d4f9cbde27ef30b42f8#1736924282|PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800167222; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736924221%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="/tuxY5mO3ASUL3ruDLQma3s2TtoE28S6+55ReL4sjX/xA/lpkLdUStqpK/U01fHmuw1w0uOr5frZ1Ziq+ogj9SJrqIIUQYb4O9a1ziwWFmXj/SmtD0hK58URIfpua4nsOU35TVxMrrZH3bJLDxfP2Ciw8EkOQydogL6wxDA7IWN9Ktd0rO4hj5icaNmTdZz0wxvtanIKsRvukUNuLhTmwNecRb+F74KiosnVhNvCoo4H0o4kLso9Ipz6uXZ5aP5r2ASvUrCOeeHnHNc2pg2E9xWDEyp6f7JsKOQTrFcK1QhF7+2CSgYKzf0N//57LXkSZFXUtyRYTOEe7wh/HnSecZXPLdBLFhY2AMNhgK6dyEHY8SNfNL6M4bpSyGEbRUPZ"; x-acbin="zqZr7TB6sqroS?zJ0joZco3NlnhrTHNGyvRyFLLSQvGQULLgEZpRFIetyDNf1fkJ"; at-acbin=Atza|IwEBIIex-oHeADEv3HBJJvmb2WkeRkDC3owQLujXoRkxlgzSfycdA-odnQtBDt719A1ieT0Whec-QimMXLieZRLSlTbJuawm3XGUUZzvzqAxrHocF9vxAtv35XN7I06CWrE9MSX2kDXXDKYl10PtluSli3dW7GX2a6tyQlnOhxPc38zapzesLlpVge1kYRZrctBhQtcMT0ct1OpI8i71TPI0uWWCceQ5vFE1kyMBE-8wVNeZUA; sess-at-acbin="hdhXRCluD/PDuoWgtnXgww4vW1oo8TxVgaH06D1yleg="; sst-acbin=Sst1|PQEHcDWVCj90Y3wDD9CVmBWSCV1dMzNzqk7nPO3uB3wE7eJjF44oRuc3WpwNf1obdYcpExfAI4TT0dAjymXVuAEZF3mE1JYIosTer7pXN3yVg3SyUgpBbIep1AkRw5T-A_87Qx0uiVOlCpa7P3mXmMTjmGI2M3T21_Jdcfe-5dCppOgXvWmu-eo4_g1331LVaYJbeSbtgdL3V8nnKHU9KhbinAHfFng8q4h1XilbTXhchs4Ae0C4EH4RQX63gIUO4JRk0fXPBEQ5F_qv-ZRI9JeWby02czkL85KvsZlXR9D-Zsg; session-id-time=2082787201l; sp-cdn=J4F7; ', // Add all relevant cookies here

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
