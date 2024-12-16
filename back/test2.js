import axios from 'axios';
import* as cheerio from 'cheerio';

async function scrapeAmazonProduct(productUrl) {
    try {
        // Make a GET request to the product page
        const { data } = await axios.get(productUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Cookie': 'session-id=257-3703096-7411867; ubid-acbin=262-9261014-9907709; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20057%7CMCMID%7C52088843386858178740972293294356216919%7CMCAAMLH-1733467200%7C12%7CMCAAMB-1733467200%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1732869600s%7CNONE%7CvVersion%7C5.5.0%7CMCCIDH%7C1924369723; mbox=session#4cff5739b84f431686ebf32a502339c8#1732864336|PC#4cff5739b84f431686ebf32a502339c8.41_0#1796107201; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1732864280%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="2HB48rR22VkolUwrYH5ILldIbAvTJLgh+OUZ4J3U7u7E/jcox6vs6g4uzBZf7IQrBTJTWbrx2Rx95i3G4Cvr/97DPBgS6B4ZtgUlYNH/oHSHskW5kLuLFE3Ypeh5Gr1nxUXEGBQrUZOp96Z0WuIDSZqiDToem5vEMelu5YgoKxdtQTceQYsSzq7gA/rywtCbKTpfB2a3UH6uPMjUYDJbx7odIC+fr2EhEAILIh91MNY2GYHAkzx/SjNkdp9X6DGmq0JNnjIqhmj4IEZ949Q+N7ECKtP/ZBtivgPmPXfQ0ResmfDJvv5RowevBBDEi6QcmretTCt0EpbzHsYMjhWAcTt9EF2iTcbTXLhFjPDow3hnTAg9niPeMA=="; x-acbin="KME?gP5Amb@oprrhKSoa1mA5fI8?LW0qelDCHAtEQToRiSXz6EwgX0febhrAjpGS"; at-acbin=Atza|IwEBIGtkILKM4HAmH5_qulqWo18swOpvwNzPqRqvFv7oUKZ4j6CiroJ5j34pIMVRof1uXs2dRD7nG_phbnDy38gghRubbpr6BXGVMw4pGdQQ9cQsGZZ5dWkMCBKdpAmM1NediVJMUXs9QqLpYPdrtjc4KIT3jM3lhxPrcyoz-Cyg4T6q33V0Iw69PA4v-gW9PwMkOZ0g1RRE7T5ywlU4WJQVr9ljt7HjpdN0U9pESshMHIforA; sess-at-acbin="qrQrmY8M9pFddXIj+nhL6wCj9kiV6c/877c0nI4bpQg="; sst-acbin=Sst1|PQG3zfxfSr5mOKHCmTY4yeKcCVpwoP13z4nsvDZ0t7K_pGStAzu9XTws-E3dma5z3-gh8y8nmSYjyc-jSiwqqDTk1bVaFmkJZgQqtUk3_TcayIoVrXzeeblRtVbPAvRR3VezMUtRavMjJRPpGWNDEyaDmeTL5ClGbUZzwyFOJYMHcYVSx0G48FmAO8nCxb9JxnLeJQuXwRRqms8eDuOZCNCrAT4rrSTitQ6pLs6IFhbT_ysxreAa-wjY9kMZmQZ1KuMfPxX2wromVbbnKxF-Mkby3MSTZm5gE_lK4YUKvOr3j04; session-id-time=2082787201l; sp-cdn=J4F7; ', // Add all relevant cookies here
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
