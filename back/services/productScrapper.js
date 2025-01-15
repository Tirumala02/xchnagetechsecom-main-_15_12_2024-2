

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
                'Cookie': 'session-id=260-5885697-2340514; ubid-acbin=258-8888319-6704052; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737527220%7C12%7CMCAAMB-1737527220%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736929620s%7CNONE%7CvVersion%7C5.5.0; mbox=session#a0771eaac02a4d4f9cbde27ef30b42f8#1736924282|PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800167222; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736924221%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="ubr7pPOwxNAZb9NZr9zwfUpC5ASZvVO+xMVsjNiSCVcgonIiwUYgkLZQpgv6dZKdv9owlaKNAbdJnnVW+hDM4S5/EaDhf7C0P06AYWvsYjXCDbU0QGp2ERIzbjuGCDXki5j8lv9evJJbQ5AtB29wTv9x0JXPtN/Ni2Dqpm/5DfVaC2y9BDeUoyPu7UJTEBfCbMuz7NeERQCzr7PBu/O4fy201vcG26Sft0VIgYc/7kWKrjOWTImfVXKtxKRTYm9DQufiqF6QnKci9tkW9UYtKWU8PT/PpP015hVE/RG2uwWu//z80+n0nWkLLIWXygPXOrtt+MwTSY3rq8+VMqwVpD3+p0VHsHmMYTlmONKKE9kWFLJ5tgvKrw=="; x-acbin="jipjKzEG7@8hTk?4CuNu4EENkyNrLinZcn7unNK65@Laruq0LUbI8HRxRDCGTpII"; at-acbin=Atza|IwEBIIex-oHeADEv3HBJJvmb2WkeRkDC3owQLujXoRkxlgzSfycdA-odnQtBDt719A1ieT0Whec-QimMXLieZRLSlTbJuawm3XGUUZzvzqAxrHocF9vxAtv35XN7I06CWrE9MSX2kDXXDKYl10PtluSli3dW7GX2a6tyQlnOhxPc38zapzesLlpVge1kYRZrctBhQtcMT0ct1OpI8i71TPI0uWWCceQ5vFE1kyMBE-8wVNeZUA; sess-at-acbin="hdhXRCluD/PDuoWgtnXgww4vW1oo8TxVgaH06D1yleg="; sst-acbin=Sst1|PQEHcDWVCj90Y3wDD9CVmBWSCV1dMzNzqk7nPO3uB3wE7eJjF44oRuc3WpwNf1obdYcpExfAI4TT0dAjymXVuAEZF3mE1JYIosTer7pXN3yVg3SyUgpBbIep1AkRw5T-A_87Qx0uiVOlCpa7P3mXmMTjmGI2M3T21_Jdcfe-5dCppOgXvWmu-eo4_g1331LVaYJbeSbtgdL3V8nnKHU9KhbinAHfFng8q4h1XilbTXhchs4Ae0C4EH4RQX63gIUO4JRk0fXPBEQ5F_qv-ZRI9JeWby02czkL85KvsZlXR9D-Zsg; session-id-time=2082787201l; sp-cdn=J4F7; ', // Add all relevant cookies here

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