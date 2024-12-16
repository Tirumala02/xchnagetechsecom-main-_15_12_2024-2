// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { backendUrl, currency } from '../App';

// const TicketManagement = ({token}) => {
//     const [tickets, setTickets] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Fetch tickets from the backend
//     useEffect(() => {
//         const fetchTickets = async () => {
//             try {
//                 const response = await axios.get(backendUrl+'/api/admin/tickets');
//                 setTickets(response.data.tickets);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching tickets:', error);
//                 setLoading(false);
//             }
//         };

//         fetchTickets();
//     }, );

//     // Update ticket status
//     const updateStatus = async (ticketId, status) => {
//         try {
//             const response = await axios.put(backendUrl+'/api/admin/tickets-update', {
//                 ticketId,
//                 status,     
//             },{ headers: { token } });

//             if (response.data.success) {
//                 // Update the status in the UI without reloading
//                 setTickets(tickets.map(ticket => 
//                     ticket._id === ticketId ? { ...ticket, status } : ticket
//                 ));
//                 alert('Ticket status updated successfully');
//             }
//         } catch (error) {
//             console.error('Error updating status:', error);
//             alert('Failed to update ticket status');
//         }
//     };

//     const handleDelete = async (publicId,ticketId) => {
//         try {
//             const response = await axios.post(backendUrl+'/api/admin/tickets-delete', { publicId,ticketId },{ headers: { token } });
//             if (response.data.success) {
//                 alert('File deleted successfully.');
//                 // Optionally, refresh the list of tickets
//             } else {
//                 alert('Failed to delete file: ' + response.data.message);
//             }
//         } catch (error) {
//             alert('Error: ' + error.message);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }
    

//     return (
//         <div>
//             <h1>Ticket Management</h1>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Ticket ID</th>
//                         <th>User Name</th>
//                         <th>Email</th>
//                         <th>Message</th>
//                         <th>Document</th>
//                         <th>Status</th>
//                         <th>Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {tickets.map(ticket => (
//                         <tr key={ticket._id}>
//                             <td>{ticket._id}</td>
//                             <td>{ticket.name}</td>
//                             <td>{ticket.email}</td>
//                             <td>{ticket.message}</td>
//                             <td><a href={ticket.document.url} target="_blank" rel="noopener noreferrer">View Document</a></td>
//                             <td>{ticket.status}</td>
//                             <td>
//                                 <select
//                                     value={ticket.status}
//                                     onChange={(e) => updateStatus(ticket._id, e.target.value)}
//                                 >
//                                     <option value="pending">Pending</option>
//                                     <option value="resolved">Resolved</option>
//                                 </select>
//                             </td>
//                             <td>
//                             <button onClick={() => handleDelete(ticket.document.publicId,ticket._id)}>Delete</button>
//                         </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default TicketManagement;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl, currency } from '../App';
import Loader from '../components/Loader';

const TicketManagement = ({ token }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteWarning, setDeleteWarning] = useState(null);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/admin/tickets`);
        setTickets(response.data.tickets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
        toast.error('Failed to fetch tickets');
      }
    };

    fetchTickets();
  }, );

  const updateStatus = async (ticketId, status) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/admin/tickets-update`,
        { ticketId, status },
        { headers: { token } }
      );

      if (response.data.success) {
        setTickets(tickets.map(ticket =>
          ticket._id === ticketId ? { ...ticket, status } : ticket
        ));
        toast.success('Ticket status updated successfully');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update ticket status');
    }
  };

  const handleDelete = async (publicId, ticketId) => {
    if (dontAskAgain) {
      performDelete(publicId, ticketId);
    } else {
      setDeleteWarning({ publicId, ticketId });
    }
  };

  const performDelete = async (publicId, ticketId) => {
    setIsDeleting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/tickets-delete`,
        { publicId, ticketId },
        { headers: { token } }
      );
      if (response.data.success) {
        setTickets(tickets.filter(ticket => ticket._id !== ticketId));
        toast.success('Ticket deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        Ticket Management
      </motion.h1>

      <div className="flex justify-end mb-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-x-2"
        >
          {['all', 'pending', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              } transition-colors duration-200`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{ticket.name}</h2>
                <p className="text-gray-600 mb-2">{ticket.email}</p>
                <p className="text-gray-700 mb-4">{ticket.message}</p>
                <div className="flex justify-between items-center mb-4">
                  <a
                    href={ticket.document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    View Document
                  </a>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ticket.status === 'resolved'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <select
                    value={ticket.status}
                    onChange={(e) => updateStatus(ticket._id, e.target.value)}
                    className="block w-32 bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => handleDelete(ticket.document.publicId, ticket._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {deleteWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this ticket?</p>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="dontAskAgain"
                checked={dontAskAgain}
                onChange={(e) => setDontAskAgain(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="dontAskAgain">Don't ask me again for this session</label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteWarning(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  performDelete(deleteWarning.publicId, deleteWarning.ticketId);
                  setDeleteWarning(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {isDeleting && <Loader />}
    </div>
  );
};

export default TicketManagement;

