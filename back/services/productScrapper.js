

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
                'Cookie': 'session-id=260-5885697-2340514; ubid-acbin=258-8888319-6704052; mbox=PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800194344|session#41940a9883ec47078b650d52738b1e30#1736951404; i18n-prefs=INR; lc-acbin=en_IN; session-token=8YmJGhLiFGT4IfhfDQyZkXDx5sXdJnpjrIUnez0ELVDQr8oE/DJDHYO//5ROOCMB+SlQRgUQ92oC0oMN3QQfzCa89PpRQeMoiXQNTWyUiA479x1ZPHF6pPRipms0S77PGUl4EqjxSuyeUna6IdzVcE9yb53uXYZmgIqyrYcgte+WmPeuqhbflafwh8157hzLPjWmiTMTXJBlbAjCCq2PbslbUGz5oACRu92l8ezwfSqYY/NN9psxGPIgEfh6uYS1UZrfjKlpMcXoTQA87QF5zTRR19XyoYVYTbPaMwx7s8YcdwTahVyNqDqjwuM5hPMx7GMFRifhYT/fYi1R0v2eiWA29X6k+DhMVYILQCjzFf9aUJUQ6G56bvZnXU0xO/CU; x-acbin="TbFygNU8AMzSneprfNnuyg8TbIJi79teIoLCMPkSP6QNjbCGZSQYB9Mo@DpwWwZy"; at-acbin= Atza|IwEBIL1JptvG9emJP2e3dGG__ycMihjoV8bZKjxeos9gND6VPYtdH174klYEJJBEDh7K3KghvGJur257WigyUUjtmM4QV5itNYEkbeVtY1b6IRPn1jQs5KA2nNXPePgDTRbfi70i_OmjkwO2kbykYW5EDNk1b3mJTEj2-j5zYqvoBu9P3RzopXuiEV2KyGy4o121oumUQwvdylYNjemKCtpqQ8qCCDWLzl27IqQsoqhUIbRajw; sess-at-acbin="O0GdhlOf5abf4jA+y+uPzK7c046Ywc1zarHPlijuhZU="; sst-acbin=Sst1|PQFxmkHir35Iopwrfx1j9mReCUG0SCsqT9lqgbQZ8bUPolPO09uI3cygFlP5pxUgovg3Anxqtktb7lPJKr887Sr6oxgOBI4zaUSlLzRuX7iSPlluIwrv3SG4MF7T43pmWCZHECUPKIWjq5QnYjj7AH_MCecLfr-JvWnerbvy3GnLeiSfqzjD8qqZrua98ronDsoxVvszcHLbd_4yF8XNGHs_KcIKyNO9HtrUHVxS7IfB8R7sWkVwQDUpSKqSDHG1cTNJOTDqaMAXXkJNxT04yL7RaAqtwmeBdnxWUlkys_OwYMI; session-id-time=2082787201l; sp-cdn=J4F7; ',

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