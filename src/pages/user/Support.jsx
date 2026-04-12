// src/pages/user/Support.jsx
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/user/Sidebar'
import { getSupportTickets, createSupportTicket, replyToTicket } from '../../services/api'

const Support = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openTicketId, setOpenTicketId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState([])
  const [fetching, setFetching] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    mobile_number: '',
    category: '',
    message: ''
  })

  // ✅ Fetch tickets on component mount
  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setFetching(true)
      const response = await getSupportTickets()
      console.log('Tickets Response:', response)
      
      if (response.success && response.data) {
        setTickets(response.data)
      } else if (response.data) {
        setTickets(response.data)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleTicketChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value })
  }

  const handleSubmitTicket = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!newTicket.subject || !newTicket.mobile_number || !newTicket.category || !newTicket.message) {
      alert('Please fill all fields')
      return
    }
    
    if (newTicket.mobile_number.length !== 10) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await createSupportTicket(newTicket)
      console.log('Create Ticket Response:', response)
      
      if (response.status === 200 || response.success) {
        alert('✅ Ticket created successfully!')
        
        // Reset form
        setNewTicket({
          subject: '',
          mobile_number: '',
          category: '',
          message: ''
        })
        
        // Refresh tickets list
        await fetchTickets()
      } else {
        alert(response.message || '❌ Failed to create ticket')
      }
    } catch (error) {
      console.error('Create ticket error:', error)
      alert(error.message || '❌ Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply message')
      return
    }
    
    setReplying(true)
    
    try {
      const response = await replyToTicket(ticketId, replyText)
      console.log('Reply Response:', response)
      
      if (response.status === 200 || response.success) {
        alert('✅ Reply sent successfully!')
        setReplyText('')
        setOpenTicketId(null)
        // Refresh tickets to get updated replies
        await fetchTickets()
      } else {
        alert(response.message || '❌ Failed to send reply')
      }
    } catch (error) {
      console.error('Reply error:', error)
      alert(error.message || '❌ Failed to send reply')
    } finally {
      setReplying(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-600'
      case 'resolved':
      case 'completed':
        return 'bg-green-100 text-green-600'
      case 'closed':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-yellow-100 text-yellow-600'
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 ml-0 md:ml-64">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-2xl text-gray-600"
          >
            ☰
          </button>
          <h4 className="font-semibold text-lg">Support Tickets 🎫</h4>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Create Ticket Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h5 className="font-semibold text-lg mb-4">Create New Ticket</h5>
            
            <form onSubmit={handleSubmitTicket}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="subject"
                  value={newTicket.subject}
                  onChange={handleTicketChange}
                  placeholder="Subject"
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0]"
                  required
                />
                <input
                  type="tel"
                  name="mobile_number"
                  value={newTicket.mobile_number}
                  onChange={handleTicketChange}
                  placeholder="Mobile Number"
                  maxLength="10"
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0b86d0]"
                  required
                />
                <select
                  name="category"
                  value={newTicket.category}
                  onChange={handleTicketChange}
                  className="border border-gray-200 rounded-lg px-4 py-2 md:col-span-2 focus:outline-none focus:border-[#0b86d0]"
                  required
                >
                  <option value="">Select Category</option>
                  <option>Order Issue</option>
                  <option>Payment Issue</option>
                  <option>Technical Issue</option>
                  <option>Service Related</option>
                  <option>Other</option>
                </select>
                <textarea
                  name="message"
                  value={newTicket.message}
                  onChange={handleTicketChange}
                  placeholder="Describe your issue..."
                  rows="4"
                  className="border border-gray-200 rounded-lg px-4 py-2 md:col-span-2 focus:outline-none focus:border-[#0b86d0]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>

          {/* Tickets List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h5 className="font-semibold text-lg mb-4">My Tickets</h5>
            
            {fetching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">🎫</div>
                <p className="text-gray-500">No tickets found</p>
                <p className="text-sm text-gray-400">Create a new ticket to get support</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition">
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
                      <div>
                        <h6 className="font-semibold text-gray-800">{ticket.subject}</h6>
                        <p className="text-sm text-gray-500 mt-1">
                          Ticket ID: #{ticket._id?.slice(-6)} • {formatDate(ticket.created_at)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Category: {ticket.category}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status || 'Pending'}
                        </span>
                        <button
                          onClick={() => setOpenTicketId(openTicketId === ticket._id ? null : ticket._id)}
                          className="text-[#0b86d0] text-sm hover:underline"
                        >
                          {openTicketId === ticket._id ? 'Hide' : 'View Details'}
                        </button>
                      </div>
                    </div>

                    {openTicketId === ticket._id && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50">
                        {/* Issue Description */}
                        <div className="mb-4">
                          <h6 className="font-medium text-sm text-gray-700 mb-2">Issue Description:</h6>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="text-gray-600 text-sm">{ticket.description}</p>
                          </div>
                        </div>
                        
                        {/* Replies Section */}
                        {ticket.replies && ticket.replies.length > 0 && (
                          <div className="mb-4">
                            <h6 className="font-medium text-sm text-gray-700 mb-2">Conversation:</h6>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {ticket.replies.map((reply, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-lg ${
                                    reply.user_type === 'user' 
                                      ? 'bg-blue-50 ml-0 mr-4' 
                                      : 'bg-gray-100 ml-4 mr-0'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm">
                                      {reply.user_type === 'user' ? 'You' : 'Support Team'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {formatDate(reply.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm">{reply.comment}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Reply Form */}
                        <div className="mt-4">
                          <h6 className="font-medium text-sm text-gray-700 mb-2">Add Reply:</h6>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#0b86d0]"
                            />
                            <button
                              onClick={() => handleReply(ticket._id)}
                              disabled={replying}
                              className="bg-gradient-to-r from-[#0b86d0] to-[#00c853] text-white px-4 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
                            >
                              {replying ? 'Sending...' : 'Send'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support