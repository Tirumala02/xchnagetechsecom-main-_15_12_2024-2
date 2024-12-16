
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'dotenv/config'


const backendUrl = process.env.BACKEN_URL

async function searchAmazonQuery(query) {
    
    try {

       
        const response = await axios.get('http://localhost:4000/api/admin/value-changer'); // Adjust the URL as needed
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch addPercentage value.");
        }
        // const  addDeliveryBuffer= response.data.values.deliveryLeadTime.value;
        const addPercentage = response.data.values.priceMargin.value;
        console.log('addPercentage : ',addPercentage)

        const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

        // Make a request with the appropriate headers, including the session cookies
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Cookie': 'session-id=257-3703096-7411867; ubid-acbin=262-9261014-9907709; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20057%7CMCMID%7C52088843386858178740972293294356216919%7CMCAAMLH-1733467200%7C12%7CMCAAMB-1733467200%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1732869600s%7CNONE%7CvVersion%7C5.5.0%7CMCCIDH%7C1924369723; mbox=session#4cff5739b84f431686ebf32a502339c8#1732864336|PC#4cff5739b84f431686ebf32a502339c8.41_0#1796107201; i18n-prefs=INR; lc-acbin=en_IN; session-token="2HB48rR22VkolUwrYH5ILldIbAvTJLgh+OUZ4J3U7u7E/jcox6vs6g4uzBZf7IQrBTJTWbrx2Rx95i3G4Cvr/97DPBgS6B4ZtgUlYNH/oHSHskW5kLuLFE3Ypeh5Gr1nxUXEGBQrUZOp96Z0WuIDSZqiDToem5vEMelu5YgoKxdtQTceQYsSzq7gA/rywtCbKTpfB2a3UH6uPMjUYDJbx7odIC+fr2EhEAILIh91MNY2GYHAkzx/SjNkdp9X6DGmq0JNnjIqhmj4IEZ949Q+N7ECKtP/ZBtivgPmPXfQ0ResmfDJvv5RowevBBDEi6QcmretTCt0EpbzHsYMjhWAcTt9EF2iTcbTXLhFjPDow3hnTAg9niPeMA=="; x-acbin="KME?gP5Amb@oprrhKSoa1mA5fI8?LW0qelDCHAtEQToRiSXz6EwgX0febhrAjpGS"; at-acbin=Atza|IwEBIGtkILKM4HAmH5_qulqWo18swOpvwNzPqRqvFv7oUKZ4j6CiroJ5j34pIMVRof1uXs2dRD7nG_phbnDy38gghRubbpr6BXGVMw4pGdQQ9cQsGZZ5dWkMCBKdpAmM1NediVJMUXs9QqLpYPdrtjc4KIT3jM3lhxPrcyoz-Cyg4T6q33V0Iw69PA4v-gW9PwMkOZ0g1RRE7T5ywlU4WJQVr9ljt7HjpdN0U9pESshMHIforA; sess-at-acbin="qrQrmY8M9pFddXIj+nhL6wCj9kiV6c/877c0nI4bpQg="; sst-acbin=Sst1|PQG3zfxfSr5mOKHCmTY4yeKcCVpwoP13z4nsvDZ0t7K_pGStAzu9XTws-E3dma5z3-gh8y8nmSYjyc-jSiwqqDTk1bVaFmkJZgQqtUk3_TcayIoVrXzeeblRtVbPAvRR3VezMUtRavMjJRPpGWNDEyaDmeTL5ClGbUZzwyFOJYMHcYVSx0G48FmAO8nCxb9JxnLeJQuXwRRqms8eDuOZCNCrAT4rrSTitQ6pLs6IFhbT_ysxreAa-wjY9kMZmQZ1KuMfPxX2wromVbbnKxF-Mkby3MSTZm5gE_lK4YUKvOr3j04;  sp-cdn=J4F7; ', // Add all relevant cookies here
                // 'Cookie': 'session-id=257-3703096-7411867; ubid-acbin=262-9261014-9907709; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20057%7CMCMID%7C52088843386858178740972293294356216919%7CMCAAMLH-1733467200%7C12%7CMCAAMB-1733467200%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1732869600s%7CNONE%7CvVersion%7C5.5.0%7CMCCIDH%7C1924369723; mbox=session#4cff5739b84f431686ebf32a502339c8#1732864336|PC#4cff5739b84f431686ebf32a502339c8.41_0#1796107201; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1732864280%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="2HB48rR22VkolUwrYH5ILldIbAvTJLgh+OUZ4J3U7u7E/jcox6vs6g4uzBZf7IQrBTJTWbrx2Rx95i3G4Cvr/97DPBgS6B4ZtgUlYNH/oHSHskW5kLuLFE3Ypeh5Gr1nxUXEGBQrUZOp96Z0WuIDSZqiDToem5vEMelu5YgoKxdtQTceQYsSzq7gA/rywtCbKTpfB2a3UH6uPMjUYDJbx7odIC+fr2EhEAILIh91MNY2GYHAkzx/SjNkdp9X6DGmq0JNnjIqhmj4IEZ949Q+N7ECKtP/ZBtivgPmPXfQ0ResmfDJvv5RowevBBDEi6QcmretTCt0EpbzHsYMjhWAcTt9EF2iTcbTXLhFjPDow3hnTAg9niPeMA=="; x-acbin="KME?gP5Amb@oprrhKSoa1mA5fI8?LW0qelDCHAtEQToRiSXz6EwgX0febhrAjpGS"; at-acbin=Atza|IwEBIGtkILKM4HAmH5_qulqWo18swOpvwNzPqRqvFv7oUKZ4j6CiroJ5j34pIMVRof1uXs2dRD7nG_phbnDy38gghRubbpr6BXGVMw4pGdQQ9cQsGZZ5dWkMCBKdpAmM1NediVJMUXs9QqLpYPdrtjc4KIT3jM3lhxPrcyoz-Cyg4T6q33V0Iw69PA4v-gW9PwMkOZ0g1RRE7T5ywlU4WJQVr9ljt7HjpdN0U9pESshMHIforA; sess-at-acbin="qrQrmY8M9pFddXIj+nhL6wCj9kiV6c/877c0nI4bpQg="; sst-acbin=Sst1|PQG3zfxfSr5mOKHCmTY4yeKcCVpwoP13z4nsvDZ0t7K_pGStAzu9XTws-E3dma5z3-gh8y8nmSYjyc-jSiwqqDTk1bVaFmkJZgQqtUk3_TcayIoVrXzeeblRtVbPAvRR3VezMUtRavMjJRPpGWNDEyaDmeTL5ClGbUZzwyFOJYMHcYVSx0G48FmAO8nCxb9JxnLeJQuXwRRqms8eDuOZCNCrAT4rrSTitQ6pLs6IFhbT_ysxreAa-wjY9kMZmQZ1KuMfPxX2wromVbbnKxF-Mkby3MSTZm5gE_lK4YUKvOr3j04; session-id-time=2082787201l; sp-cdn=J4F7; ', // Add all relevant cookies here
                // 'Cookie':'session-id=260-2977260-6704856; i18n-prefs=INR; ubid-acbin=260-4425737-3177304; x-acbin="D37sJKQS4YO2oz50Z@YZzEbhfvi9vAIZQ2tiS82tgPvMocfVA8OcklFp2u3BQKjh"; at-acbin=Atza|IwEBIL4atEji090g5wq6WwH9hMN261jxlYM1GcZ-YH5KjSTDWFNk7o3ZNIZ3gkWWlaJZ010HLBLE8rI0lnBa81J8Fb00H-ZiA2a_ItM1Rs_w3tUErtt3k9Gx0szsYRcWp6TH28sE84NnHGnkMU_7NarKyygX9_KLMkGTUlUaU6P-Qjq63nFp53H0poFBBUtZREc6Ec0Vd4n6J5kkc51CGPOsYrb0xweZ_DK3ZUWHEVA1gSFIXw; sess-at-acbin="86zs2Xy2MAH9qgs5WnyXzwGXSVKiDBExvK6yw3GCO6g="; sst-acbin=Sst1|PQHSHvEDavc-zPMvRBMw4g-gCdBrkQSSJjDjam3XMDaCOwyClY4a6JndqfEcbjCfRaFV7ZdNzVtRiJI5JPKGooo3kSqM_bK3v9SBEtdTvWELRptwbDBkgjknUm1Qx0jAxM9QXXTufggqVNu-XP0b5fbA4lUGoMKgocP_0D7AU4-te_K831w10QhyJCc7V27JRGJCe_BlKKdfjMbYEADD3EMcnPh2wj8Hc5ZuqLchBdchE49rjw9xQKaZZd6ht4-wLFXf9_1QxSDapaTkZA030UA6ZN1_1uZ3GloyALPkJrzf0is; lc-acbin=en_IN; sp-cdn=J4F7; b2b="VFJVRQ=="; session-token=UvRFiefHVKWkugPXIaB8/tpHu+zmpyc9BFymV7G/XOaAgVHEbljapVeCDHapb2WNqUsibtQ+q74lxwjp9ONLirkD462A0AiQcyu1uY/asFjENsUqePSKO8udtXRY7tsJnHVNRb1C6CH6dMk8tn6V437uT/1am9lGuknTayWcE9ljSsxgGQ1FV+QJP6Y0+Zw/KyAP/I0nudxgsdjZrdcWEBSA7Dm5rSa1qwXMIVnnAWjgYNRIJ2VyVtqUjwALtZnm8plNNgd+g5smJAdWJHs2wcnxqp7+s1OfjYR8zFziIPCPj93ijUiZQnMac3hMtLMUfwYsvWzDeWe2+0L69mL4j8DrCww13TJ31WwlbK3p0XhH2CBfzv+IhfdfFksQUQue; session-id-time=2082758401l'
            },
        });

        const $ = cheerio.load(data);

        // Scrape product details (title, price, link)
        const products = [];
        $('.s-main-slot .s-result-item').each((index, element) => {
            const title = $(element).find('.a-text-normal h2').text().trim();

            let price = $(element).find('.a-price .a-offscreen').first().text().trim().replace('₹', '');
            price = price.replace(',', '')
            price = parseFloat(price);
            price+=price*((addPercentage)/100);
            
            let iprice = $(element).find('.a-price .a-offscreen').eq(1).text().trim().replace('₹', '')
            iprice = iprice.replace(',', '');
            iprice = parseFloat(iprice);

            const image = $(element).find('.s-image').attr('src');
            const link = 'https://www.amazon.in' + $(element).find('.a-link-normal').attr('href');
            // Skip sponsored items by checking for '/sspa/click?' in the URL
            if (link.includes('/sspa/click?')) {
                return;
            }

            const asinMatch = link.match(/\/dp\/([A-Z0-9]{10})/);  // Extract ASIN from the product link
            const asin = asinMatch ? asinMatch[1] : null;
            // Try to extract the category from the breadcrumb or other elements
            // const category = $(element).find('.a-row.a-size-base.a-color-secondary').text().trim(); // Adjust selector if needed

            if (title && price && image && link && asin) {
                products.push({ title, price, iprice, link, image, asin });
            }
        });

        // Display the results
        if (products.length > 0) {
            return products
        } else {
            console.log('No products found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Example: Search for "smartwatch"
export default searchAmazonQuery;



// async function searchAmazonProduct(query) {
//     let valueChanger;

//     const fetchValueChanger = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/api/admin/value-changer`);
//             if (response.data.success) {
//                 const values = response.data.values;
//                 console.log("Fetched valueChanger:", values);
//                 return values;
//             } else {
//                 console.error("Error in fetchValueChanger:", response.data.message);
//             }
//         } catch (error) {
//             console.error("Error in fetchValueChanger:", error);
//         }
//     };

//     try {
//         // Fetch the valueChanger data
//         valueChanger =  fetchValueChanger();
//         if (!valueChanger) {
//             console.error("valueChanger is undefined or null. Exiting function.");
//             return;
//         }

//         // Use the user's search query to generate the Amazon search URL
//         const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

//         // Make a request with the appropriate headers, including the session cookies
//         const { data } = await axios.get(searchUrl, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
//                 'Cookie': 'session-id=257-3703096-7411867; ubid-acbin=262-9261014-9907709;', // Add all relevant cookies here
//             },
//         });

//         const $ = cheerio.load(data);

//         // Scrape product details (title, price, link)
//         const products = [];
//         $('.s-main-slot .s-result-item').each((index, element) => {
//             const title = $(element).find('.a-text-normal h2').text().trim();
//             let price = $(element).find('.a-price .a-offscreen').first().text().trim().replace('₹', '');
//             price= price.replace(',', '')
//             console.log("price before: "+price)
//             // Parse price as float and apply valueChanger logic
//             // price = parseFloat(price);
//             console.log("price after parseFloat: "+ price)
//             // if (price && valueChanger && valueChanger.priceMargin) {
//             //     price += (price * valueChanger.priceMargin.value)/100; // Ensure valueChanger has the necessary structure
//             // }
//             // console.log("price after added margin : "+ price + '\n\n')
//              price = $(element).find('.a-price .a-offscreen').first().text().trim();

//             const image = $(element).find('.s-image').attr('src');
//             const link = 'https://www.amazon.in' + $(element).find('.a-link-normal').attr('href');

//             // Skip sponsored items by checking for '/sspa/click?' in the URL
//             if (link.includes('/sspa/click?')) {
//                 return;
//             }

//             const asinMatch = link.match(/\/dp\/([A-Z0-9]{10})/); // Extract ASIN from the product link
//             const asin = asinMatch ? asinMatch[1] : null;

//             if (title && price && image && link && asin) {
//                 products.push({ title, price, link, image, asin });
//             }
//         });

//         // Display the results
//         if (products.length > 0) {
//             // console.log('Found Products:', products);
//             return products;
//         } else {
//             console.log('No products found.');
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// export default searchAmazonProduct