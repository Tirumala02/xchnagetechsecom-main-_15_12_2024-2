

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
                'Cookie': 'session-id=260-3124270-2308463; ubid-acbin=262-8903529-8818126; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg= 179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737523595%7C12%7CMCAAMB-1737523595%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736925995s%7CNONE%7CvVersion%7C5.5.0%7CMCCIDH%7C545471373; mbox= PC#3b54445e15c94b729752408c2ba856ee.41_0#1800163874|session#ce9379aaf0a4433c8395714d540191a1#1736920934; i18n-prefs=INR; lc-acbin=en_IN; session-token "mH95/3u2VI1imaxDs7NRwBiIfFW91KVD2jZDFTN93ZEVRDhmPeurX05XE9I8ji6Z+fxkWIBhZNm+4U4k3WKUUC1b+qjhAscY5FMIDU8EinCNfvBnXH1v0bqXXqMy1lvvBd/ebusC3/RIcVE6Mh7Uo2qMZGEXktrdaDQwDpH3j2pMuUrNETO2nEIesdNyK/2xTxdCozbJZK/WwaXVfPBPqInFtH13K2WbnGe+pK/kftReb+jxjpwLM9Vq9ZR3cIvI+Iy+Waq5KlZ//ONkad7PbN3xbzs3HX1ilWYRQR9y6ZNZCAVoKNuQkPP+m0W2oDEyEqA2qgm7KWj6C6zK1Xu7BResQEI1a+dYjw/QPhQlbO6KFWuMC0y1hw=="; x-acbin= "53lQF3YE2@KKjYDP2JbrZT9udQnTEPhL6Ehq34cBEtoz@ijstj91XknhowrbMcbP"; at-acbin= Atza|IwEBIBbA_WZmIWg6z_sPdHcj9ZhtcyO3xm94hWVaEo2_Wdb5Xo78y7BjOGB0HI7Q-fxmjOo2AHtPnLrHU61imGBrvfTP10crvnifCyTDRatfks7ubkiebh0fzEgTN9liC-UJgdMgvvn4RWbKLeiVux_hQ3shmsm7sVI5GgPjbwuuFOy3tttA-3tvU4PO-meG1fOdQCkKapr30SLO9YD-L5hgRPcLPPxsxn0elu1jep0_5heIig; sess-at-acbin="xqPjIbXNyn5wCif1KjN5VpEpH/5CLq0oN7QPbM40ncA="; sst-acbin= Sst1|PQHbujB9CCzuwjVoYzMbMax1CXFWuaHfYTLtDOthW-kiicKVzzgWx9Ms8sGrwHHXb4tV1BRpn7sc3rjEzdNrhhvMRF9P6Gd3SjmGzznQtFYNnQ6uWIileZlgRKwI1J8UfllQ_tFEPVE_AwBziMCn0UyATh0nAlqfGGiVqJ_Fduzk-gRrsz8x9MaiWc8XhFriq8k70D0kt0zefSLraraqO0BpqjAFx-yt0tpLR6uK_8RhMkKubudcu3cVLuY9Rw051CATgO--5DScIWi7D7w-x1e-ztDJnU4R3-gcMLgSN6Hpb9c;sp-cdn=J4F7; ',
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