import PDFDocument from 'pdfkit-table';
import fs from 'fs';
import { format } from 'date-fns';
import numberToWords from 'number-to-words';
import axios from 'axios';

// Function to fetch HSN Code from the Python API
async function fetchHSNFromPython(query) {
    console.log("fetchHSNFromPython: " + query)
    try {
        const response = await axios.post('https://xchange-hsn-code.onrender.com/get-hsn-code', {
            query: query
        });
        console.log("response.data");
        console.log(response.data);
        return response.data.hsn_code;
    } catch (error) {
        console.error('Error fetching HSN code:', error);
        return "not_found";
    }
}

const getHSNCodeByCategory = async (categories, hsnData) => {
    if (!Array.isArray(categories) || categories.length === 0) {
        return "N/A";
    }

    const lastCategory = categories[categories.length - 2] || categories[categories.length - 1];
    console.log("lastCategory")
    console.log(lastCategory)
    if (!lastCategory) {
        return "N/A";
    }
    const tableCells = hsnData.info.flatMap(info =>
        info.tables.flatMap(table => table.tableCells)
    );

    for (const row of tableCells) {
        const descriptionCell = row.find(cell =>
            cell.text && cell.text.trim().toLowerCase() === lastCategory.toLowerCase()
        );
        if (descriptionCell) {
            const hsnField = row[1];
            return hsnField?.text || "N/A";
        }
    }

    try {
        const pythonHSNCode = await fetchHSNFromPython(lastCategory);
        return pythonHSNCode !== "not_found" ? pythonHSNCode : "N/A";
    } catch (error) {
        console.error("Error resolving Python HSN Code:", error);
        return "N/A";
    }
};

const iGenerateQuotationPDF = async (order, address, gstDetails) => {
    console.log("PDF GeN gstDetails")
    console.log(gstDetails)
    return new Promise(async (resolve, reject) => {
        try {
            const hsnData = JSON.parse(fs.readFileSync('./utils/HSN_SAC.json', 'utf-8'));
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.font('Helvetica').fillColor('black');

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            doc.on('pageAdded', () => {
                doc.font('Helvetica').fontSize(12).fillColor('black');
            });

            doc.image('utils/logo.png', 50, 30, { width: 80 });
            doc.fontSize(18).text('QUOTATION', { align: 'center', underline: true }).moveDown();
            doc.fontSize(12)
                .text('XCHANGETECHS STAR ALLIANCE LLP', { align: 'center' })
                .text('GSTIN: 29AAAFX1191P2ZJ    PAN: AAAFX1191P', { align: 'center' })
                .text('LUT ARN: AD2903240527422', { align: 'center' })
                .text('# 459, 2nd Floor, KIRAN Towers, Koramangala, HSR Layout 5th Sector, Bengaluru, Karnataka, 560034', { align: 'center' })
                .text('Email: accounts.payable@xchangetechs.com', { align: 'center' })
                .moveDown(2);

            const currentDate = new Date();
            const expiryDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            doc.fontSize(12)
                .text(`Quotation #: ${order.orderId}`, 50)
                .text(`Quotation Date: ${format(currentDate, 'dd MMM yyyy')}`, 50)
                .text(`Due Date: ${format(expiryDate, 'dd MMM yyyy')}`, 50)
                .moveDown(2);

            doc.fontSize(12).text('Billing Address Details:', { underline: true });
            doc.text(gstDetails.billingAddress, 50)
                .text(`${gstDetails.legalName}, ${gstDetails.isSEZ ? 'SEZ Unit' : ''}`)
                .text(`GSTIN: ${gstDetails.gstNumber}`)
                .moveDown(1.5);

            doc.text('Shipping Address:', { underline: true });
            doc.text(`${address.street}, ${address.city}, ${address.state}, ${address.zipcode}`, 50)
                .text(`${address.country}`)
                .moveDown(2);
            const tableRows = await Promise.all(order.items.map(async (item) => {
                const hsnCode = await getHSNCodeByCategory(item.category, hsnData);
                const gstAmount = (((item.iprice || item.price) - item.price) * item.quantity).toFixed(2);
                const totalWithGST = ((item.iprice || item.price) * item.quantity).toFixed(2);
                // const limitedTitle = Array.isArray(item.title) ? item.title[0] : item.title;
                const limitedTitle = Array.isArray(item.title) ? item.title[0] : item.title;

                // Measure the row height, including the title
                const rowHeight = doc.heightOfString(limitedTitle, { font: "Helvetica", size: 10 }) + 10; // Add padding
                const currentY = doc.y; // Get the current position on the page
                const pageHeight = doc.page.height - doc.page.margins.bottom;

                // Check if the current row fits on the page
                if (currentY + rowHeight > pageHeight) {
                    doc.addPage(); // Add a new page only when the row doesn't fit
                }
                return [
                    item.title,
                    hsnCode,
                    item.quantity,
                    item.price.toFixed(2),
                    gstAmount,
                    totalWithGST,
                ];
            }));

            if (order.deliveryCharge) {
                tableRows.push([
                    'Delivery Charges', '', 1,
                    order.deliveryCharge.toFixed(2),
                    '0.00',
                    order.deliveryCharge.toFixed(2)
                ]);
            }

            // Create the table
            const table = {
                title: 'Order Details',
                headers: ['Item Name', 'HSN Code', 'Quantity', 'Unit Price', 'GST Amount', 'Amount with GST'],
                rows: tableRows,
            };

            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: (row, i) => {
                    doc.font("Helvetica").fontSize(10);

                    // Automatically add a page after every 30 rows
                    if (i % 30 === 0 && i !== 0) doc.addPage();
                },
                columnWidths: [200, 70, 50, 70, 70, 90], // Adjust column widths (Item Name given more space)
            });


            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: (row, i) => {
                    doc.font("Helvetica").fontSize(10);
                    if (i % 30 === 0 && i !== 0) doc.addPage();
                },
            });

            const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (order.deliveryCharge || 0);
            const itotalAmount = order.items.reduce((sum, item) => sum + (item.iprice || item.price) * item.quantity, 0) + (order.deliveryCharge || 0);
            const gstTotal = itotalAmount - totalAmount;

            doc.text(`Sub Total : ${totalAmount.toFixed(2)}/-`, 50);
            doc.text(`GST       : ${gstTotal.toFixed(2)}/-`, 50);
            doc.text(`Total     : ${itotalAmount.toFixed(2)}/-`, 50).moveDown();

            const totalInWords = `Total (in words): ${numberToWords.toWords(itotalAmount).toUpperCase()} RUPEES ONLY.`;
            doc.text(totalInWords, 50).moveDown();
            doc.text(`Total Items / Qty: ${order.items.length} / ${order.items.reduce((sum, item) => sum + item.quantity, 0)}`).moveDown(2);


            doc.text('Bank Details:', { underline: true }).moveDown();
            doc.text('Bank: ICICI Bank').text('Account #: 428405001856').text('IFSC Code: ICIC0004284').text('Branch: B NARAYANAPURA').moveDown();

            doc.text('Notes:', { underline: true }).text('Looking forward to your business!').moveDown();
            doc.text('Terms and Conditions:', { underline: true })
                .text('1. Prices Quoted are in INR.')
                .text('2. Payment terms: Immediate.')
                .text('3. Packing and Delivery Charges: As applicable at actuals.')
                .text('4. Proposal validity: Quote valid till 7 days from issue date.')
                .moveDown(2);

            doc.text('This is a computer-generated quotation and does not require a physical signature.');
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export default iGenerateQuotationPDF;
