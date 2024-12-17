import PDFDocument from 'pdfkit-table';
import fs from 'fs';
import { format } from 'date-fns';
import numberToWords from 'number-to-words';
import axios from 'axios';

function convertToRupeeFormat(number) {
    const [integerPart, decimalPart] = number.toString().split('.');
    const integerInWords = numberToWords.toWords(Number(integerPart));
    const decimalInWords = decimalPart
        ? decimalPart.split('').map(digit => numberToWords.toWords(Number(digit))).join(' ')
        : null;
    let result = `${integerInWords} rupees`;
    if (decimalInWords) {
        result += ` and ${decimalInWords} paise`;
    }
    return result;
}

async function fetchHSNFromPython(query) {
    try {
        const response = await axios.post('https://xchange-hsn-code.onrender.com/get-hsn-code', {
            query: query
        });
        return response.data.hsn_code || "N/A";
    } catch (error) {
        console.error('Error fetching HSN code:', error);
        return "N/A";
    }
}

const getHSNCodeByCategory = async (categories, hsnData) => {
    const lastCategory = categories?.[categories.length - 2] || categories?.[categories.length - 1];
    if (!lastCategory) return "N/A";

    const tableCells = hsnData.info.flatMap(info =>
        info.tables.flatMap(table => table.tableCells)
    );

    for (const row of tableCells) {
        const descriptionCell = row.find(cell => cell.text?.trim().toLowerCase() === lastCategory.toLowerCase());
        if (descriptionCell) {
            const hsnField = row[1];
            return hsnField?.text || "N/A";
        }
    }

    return await fetchHSNFromPython(lastCategory);
};

const generateQuotationPDF = async (order, address, gstDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hsnData = JSON.parse(fs.readFileSync('./utils/HSN_SAC.json', 'utf-8'));
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            // Header Function for Reusability
            const generateHeader = () => {
                doc.image('utils/logo.png', 50, 30, { width: 80 });
                doc.fontSize(18).text('QUOTATION', { align: 'center', underline: true }).moveDown();
                doc.fontSize(12)
                    .text('XCHANGETECHS STAR ALLIANCE LLP', { align: 'center' })
                    .text('GSTIN: 29AAAFX1191P2ZJ    PAN: AAAFX1191P', { align: 'center' })
                    .text('# 459, 2nd Floor, KIRAN Towers, Koramangala, HSR Layout 5th Sector, Bengaluru, Karnataka, 560034', { align: 'center' })
                    .text('Email: accounts.payable@xchangetechs.com', { align: 'center' })
                    .moveDown(2);
            };

            const generateFooter = () => {
                doc.text('Bank Details:', { underline: true }).moveDown();
                doc.text('Bank: ICICI Bank').text('Account #: 428405001856').text('IFSC Code: ICIC0004284').text('Branch: B NARAYANAPURA').moveDown();
                doc.text('Notes:', { underline: true }).text('Looking forward to your business!').moveDown();
                doc.text('Terms and Conditions:', { underline: true })
                    .fontSize(10)
                    .text('1. Prices Quoted are in INR.')
                    .text('2. Payment terms: Immediate.')
                    .text('3. Packing and Delivery Charges: As applicable at actuals.')
                    .text('4. Proposal validity: Quote valid till 7 days from issue date.')
                    .moveDown(2);
                doc.text('This is a computer-generated quotation and does not require a physical signature.');
            };

            // Page Setup
            generateHeader();

            const currentDate = new Date();
            const expiryDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            doc.fontSize(12)
                .text(`Quotation #: ${order.orderId}`, 50)
                .text(`Quotation Date: ${format(currentDate, 'dd MMM yyyy')}`, 50)
                .text(`Due Date: ${format(expiryDate, 'dd MMM yyyy')}`, 50)
                .moveDown(2);

            doc.text('Billing Address:', { underline: true })
                .text(`${gstDetails.billingAddress}`)
                .text(`GSTIN: ${gstDetails.gstNumber}`)
                .moveDown(1.5);

            doc.text('Shipping Address:', { underline: true })
                .text(`${address.street}, ${address.city}, ${address.state}, ${address.zipcode}`)
                .text(`${address.country}`)
                .moveDown(2);

            // Table Header and Rows
            const tableRows = await Promise.all(order.items.map(async (item) => {
                const hsnCode = await getHSNCodeByCategory(item.category, hsnData);
                const gstAmount = ((item.iprice || item.price) - item.price).toFixed(2);
                const totalWithGST = ((item.iprice || item.price) * item.quantity).toFixed(2);

                return [
                    item.title?.[0] || 'Unknown Item',
                    hsnCode,
                    item.quantity,
                    item.price.toFixed(2),
                    gstAmount,
                    totalWithGST,
                ];
            }));

            const table = {
                title: 'Order Details',
                headers: ['Item Name', 'HSN Code', 'Quantity', 'Unit Price', 'GST Amount', 'Amount with GST'],
                rows: tableRows,
            };

            // Table Rendering with Page Breaks
            let currentYPosition = doc.y;
            doc.table(table, {
                prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
                prepareRow: (row, i) => {
                    doc.font('Helvetica').fontSize(10);
                    if (doc.y > doc.page.height - 100) {
                        doc.addPage();
                        generateHeader();
                        currentYPosition = doc.y; // Reset Y position after new page
                    }
                },
                columnSpacing: 10,
                width: 500,
            });

            // Total Amount
            const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (order.deliveryCharge || 0);
            const totalInWords = `Total (in words): ${convertToRupeeFormat(totalAmount).toUpperCase()}.`;
            doc.text(`Total: ${totalAmount.toFixed(2)}/-`, 50).moveDown();
            doc.text(totalInWords).moveDown();

            // Footer
            generateFooter();

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export default generateQuotationPDF;
