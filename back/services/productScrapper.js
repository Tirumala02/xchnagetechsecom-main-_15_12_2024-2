

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
                'Cookie': 'session-id=257-5186271-0161543; ubid-acbin=258-7440453-9716007; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737527220%7C12%7CMCAAMB-1737527220%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736929620s%7CNONE%7CvVersion%7C5.5.0; mbox=session#a0771eaac02a4d4f9cbde27ef30b42f8#1736924282|PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800167222; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736924221%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="4mIH5pWoQ9ShRcvQxNm1WG0J6LSL6aDUfALWCnrmcyHP3D81eciRqv8NnZ806sEVWLyA9GynfCwzB9+3QHkVkp+ysRidUdTD7QhPdvGmN3+rqdONP01ICm2VaVM6F6V88q4xlzZTcrVK9IHrak8xSL40GudepV/eXpyNOdrAMhKtkGma6uXbfeIOD2rIP7+blo3l6UI7HOSWyd4jS90pXfLNhVTUU4ijWT7ElsZwKCSaJIapGIIZK9P1aG/H0i2MaoUIRi6f7ZJttEnIH+C++TcOjfD/Dh16o+1IBpKFylD1T2+gglmnfWQE2sV6bNysryb7KbaXMnP2NAMTfFKNyaWr+qD1++gpgsuyuW7Wh3yIVSeShyJuPOzM2q2TcjSc"; x-acbin= "3PhDQSg9p5s@3V?0W2TiymoVBgMRGzTZdjgo2bbWhfufmU3uTK0LibEQVMuvPlqJ"; at-acbin= Atza|IwEBILWeatDr90VM9YKW99KsKAHwIzJDX3gIzNSGqKoaG-QETbDBuvRMUpu0yLytC5H1B8izg-E2FQfFh-zAJZC7EEKnJuAvdeLAeMzB1hiMqJxIgZJG0zSAPGFFb395svZr0VzV_UcLrIgp0201s_pu-EO1RlqrYUhLjP5EyGQGwtbzOGnIMZ9eifEkIHyQaHojQV6x2PzFrQeb2XNm8J8hZcIi5jfUaQMmuoWzlxKwX_VDtCGQV6Yz3jzsH-Wrx0z5hc4; sess-at-acbin= "LqRZNQl3mYC7ONpucY5qcsnG2WG6RBE60cuw90MemzQ="; sst-acbin= Sst1|PQHVupVX2FZS7_1Lfvwd-j5rDB208SjZ81w_oW0TtwYJUedHGhC8w2g92TAU19VsExikrM0zZWgGUO48ANJ34jP9e8dHpVzmMDZl2Jy98_7BhW2SCOk6sGjO4pX3QJYvYzKGLr7kV0waG_4n2aL9i9AdmJZgExR9nTya1GQ7mJvoQmj0By8fD08ex2_Hk_Fsf77yxtktEvhwCNI46Qx4cMLNuCXHDQLecvdVyr-6cpi2yc8J0sdk7nq-d3kJ5tsyXOurUgmqLXcFez_UqTWVlaF7dQP2ltTyxSB36ucmcTvo8OBFQg7ZMGb0Y4ZTzHQv2_E8pGDgNzWWyRQaUuzqeFj8Y4i8s780dSXhXnhwARHrauk; session-id-time=2082787201l; sp-cdn=J4F7; ',

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