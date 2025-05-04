

import axios from 'axios';
import * as cheerio from 'cheerio';



async function scrapeAmazonProduct(productUrl) {
    try {
        const response = await axios.get('https://xchnagetechsecom-main-15-12-2024-2-1-quz4.onrender.com/api/admin/value-changer'); // Adjust the URL as needed
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
                'Cookie': 'session-id=257-4517540-8932521; ubid-acbin=260-0108776-0537347; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557|MCIDTS|20104|MCMID|91803326462664857293820254995898386697|MCAAMLH-1737554343|12|MCAAMB-1737554343|RKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y|MCOPTOUT-1736956743s|NONE|vVersion|5.5.0|MCCIDH|545471373; mbox=PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800194344|session#41940a9883ec47078b650d52738b1e30#1736951404; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736951344%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token=ocx421hzY/KuXxnRzwFxbruZ8SedYIs0XOfQMkMitf+vqz3f8jITDvo8gZPF8BE0nnyylnJREzMIRXbKL1RQjIaqk7AwD0Jx0FHCvJmcm243Rgle0Jj3+ozGB1U7tsg+0odAMIiZiCGHAfs8wV/wMrROLwbjmxgdss12v+HJ4usIbvRn40G50pt4Yano6ju/MTxSY/zfWZ57G89oPbuRb8mxLhsr/6m6l1N+a48AX4rLDSmWlwIbXvtZxweoul6Zi0D3NBCJNx7c7xgpdFcW0dDPfn6ONSMck5rIo2eboKO6d21dV3uW4v7o6l7K82DV+fum7yETvahG5AvsRUEKGxZBsK4rS9Rw7Ezy1RFGhfHVxbQL4geo7g==; x-acbin="HSdVsOZd3?9g@ER0CmiqS?BlXkJdi@lOpmHPPExC2YMAi7ylOm9oTa8MVnIIYqyN"; at-acbin= Atza|IwEBIGzuyHIbf1iIBBO6S5qJZLmaiQEofdzylZ4FQE8gX2QRA8h3N-D9qbujK77a-BF76SgEE7_vKHxhtSK_Rf7-GvPKhAiCX5iLvI_iap94sfNQfjm94xY8EewqEoy0BLsci_-iErascYKm2IQUY7-Ql_FpIQMb6AQVBsm2yI3CReukFmH-p8kvBcXbXrWYC0JQj4LCOaWaunti-2wUhG93hiV19iWcE9sUTcRsXxSN9iZGPw; sess-at-acbin="tYsVGzF3vqSXPU7tBDUuGejZg++U/oObuM1tIz5drvQ="; sst-acbin=Sst1|PQEB00A_NblwEP_-Q0BQh5FPCX6LBTbloOhp6dEAfOhW8sptiGsX6M_oceh-kIZZHMxPBXSZtXios4N8BErG4hNEVUTnQ6Ab7B7P4L_r_4OVSlbRQFyWsFllqOINjoFWxqea4xaM2HTbHrAgrZb1I0p4HdjAozNJUxcLgtsT6m133dC04W0TEKhw1S8aIeNWWwSNp1HT-YFEwqDf7VuBYs12bg0O3YIGWL8SjN4DbbqisHVWr3yWgUZHrH6k2Kvl0oow67Y0Uwomskkh2qWPRFKGthyl0EWh3LY4R4ZuCKMU4NU; session-id-time=2082787201l; sp-cdn=J4F7; ',

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
            iprice: iprice || 'Not Found',
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
