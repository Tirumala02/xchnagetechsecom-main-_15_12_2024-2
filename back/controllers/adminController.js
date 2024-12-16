import { v2 as cloudinary } from 'cloudinary';
import adminModel from "../models/adminModel.js";
import ticketRequest from "../models/ticketModel.js";
import ExcelJS from 'exceljs';


const ValueChangerPost = async (req, res) => {
  try {
    const { formFields } = req.body;

    if (!formFields || !Array.isArray(formFields)) {
      return res.status(400).json({ success: false, message: "Invalid form fields" });
    }

    // Build the update object
    const updatedData = {};
    formFields.forEach(({ name, value }) => {
      updatedData[`${name}.value`] = value; // Update only the value field of each property
    });

    // Update the admin document
    const updatedEntry = await adminModel.findOneAndUpdate(
      {}, // Target the first/default document
      { $set: updatedData },
      { upsert: true, new: true } // Create document if none exists
    );

    res.json({ success: true, data: updatedEntry });
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).json({ success: false, message: "Failed to update the values. Please try again." });
  }
};



const ValueChangerGet = async (req, res) => {
    try {
      // Fetch the first/default admin document
      const values = await adminModel.findOne({});
      if (!values) {
        return res.json({ success: false, message: "No data found" });
      }
      res.json({ success: true, values });
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ success: false, message: "Failed to fetch values. Please try again." });
    }
  };
  

const Tickets=async (req, res) => {
    try {
        const tickets = await ticketRequest.find().populate('userId', 'name email').exec();
        res.json({ success: true, tickets });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const TicketsUpdate=async (req, res) => {
    try {
        const { ticketId, status } = req.body;
        
        // Validate status
        if (!['pending', 'resolved'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // Update the status of the ticket
        const ticket = await ticketRequest.findByIdAndUpdate(ticketId, { status }, { new: true });
        res.json({ success: true, message: 'Ticket status updated', ticket });
    } catch (error) {
        console.error("Error updating ticket status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const TicketsDownload=async (req, res) => {
  try {
      const tickets = await ticketRequest.find().populate('userId', 'name email').exec();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Tickets');
      
      // Define columns
      worksheet.columns = [
          { header: 'Ticket ID', key: 'ticketId', width: 20 },
          { header: 'User Name', key: 'userName', width: 30 },
          { header: 'User Email', key: 'userEmail', width: 30 },
          { header: 'Message', key: 'message', width: 50 },
          { header: 'Document', key: 'document', width: 50 },
          { header: 'Status', key: 'status', width: 20 },
          { header: 'Created At', key: 'createdAt', width: 30 },
      ];

      // Add rows
      tickets.forEach(ticket => {
          worksheet.addRow({
              ticketId: ticket._id,
              userName: ticket.name,
              userEmail: ticket.email,
              message: ticket.message || 'No message',
              document: ticket.document,
              status: ticket.status,
              createdAt: ticket.createdAt.toISOString(),
          });
      });

      // Write to buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Send as file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=tickets.xlsx');
      res.send(buffer);

  } catch (error) {
      console.error("Error downloading tickets:", error);
      res.status(500).json({ success: false, message: error.message });
  }
}


const TicketsDelete = async (req, res) => {
  try {
    const { publicId, ticketId } = req.body; // Receive publicId and ticketId from the request body

    if (!publicId || !ticketId) {
      return res.status(400).json({ success: false, message: 'Missing publicId or ticketId' });
    }

    // Step 1: Call Cloudinary destroy
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

    if (result.result !== 'ok') {
      throw new Error('Failed to delete file from Cloudinary.');
    }

    // Step 2: Delete the corresponding document from MongoDB
    const ticket = await ticketRequest.findByIdAndDelete(ticketId); // This deletes the entire ticket document

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Send a success response
    return res.status(200).json({ success: true, message: 'Ticket and file deleted successfully.' });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export{ValueChangerPost,ValueChangerGet ,Tickets, TicketsUpdate, TicketsDownload,TicketsDelete}