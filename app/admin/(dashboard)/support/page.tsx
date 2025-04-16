'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface SupportTicket {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
}

const STATUS_COLORS = {
  OPEN: 'bg-yellow-500/10 text-yellow-500',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-500',
  RESOLVED: 'bg-green-500/10 text-green-500',
};

const STATUS_LABELS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [activeTab, setActiveTab] = useState<'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('OPEN');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/admin/support');
      if (!response.ok) {
        throw new Error('Failed to fetch support tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (id: number, status: SupportTicket['status']) => {
    try {
      const response = await fetch(`/api/admin/support/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }

      // Update the ticket in the local state
      setTickets(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, status } : ticket
      ));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update ticket status');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-500/10 rounded w-1/4" />
          <div className="h-64 bg-blue-500/10 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  const filteredTickets = tickets.filter(ticket => ticket.status === activeTab);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
        <div className="flex space-x-2">
          {(Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === status
                  ? STATUS_COLORS[status]
                  : 'bg-[#111111] text-gray-400 hover:text-white'
              }`}
            >
              {STATUS_LABELS[status]} ({tickets.filter(t => t.status === status).length})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-blue-500/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-500/10">
                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                <th className="text-left p-4 text-gray-400 font-medium">Subject</th>
                <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-blue-500/10">
                  <td className="p-4 text-gray-300">
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="p-4 text-white font-medium">{ticket.name}</td>
                  <td className="p-4 text-gray-300">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-left hover:text-blue-500 transition-colors duration-200"
                    >
                      <div className="max-w-md truncate">{ticket.subject}</div>
                    </button>
                  </td>
                  <td className="p-4 text-blue-500">
                    <a href={`mailto:${ticket.email}`} className="hover:underline">
                      {ticket.email}
                    </a>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="bg-[#111111] hover:bg-[#1a1a1a] text-gray-300 px-3 py-1 rounded-lg text-sm transition-colors duration-200"
                      >
                        View
                      </button>
                      <select
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                        className="bg-[#111111] border border-blue-500/10 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-blue-500/30"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No tickets found in this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-white">{selectedTicket.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedTicket.status]}`}>
                    {STATUS_LABELS[selectedTicket.status]}
                  </span>
                </div>
                <p className="text-blue-500">
                  <a href={`mailto:${selectedTicket.email}`} className="hover:underline">
                    {selectedTicket.email}
                  </a>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {format(new Date(selectedTicket.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Subject</h4>
                <p className="text-white">{selectedTicket.subject}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Message</h4>
                <div className="bg-[#0A0A0A] border border-blue-500/10 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <select
                value={selectedTicket.status}
                onChange={(e) => {
                  const newStatus = e.target.value as SupportTicket['status'];
                  updateTicketStatus(selectedTicket.id, newStatus);
                  setSelectedTicket({ ...selectedTicket, status: newStatus });
                }}
                className="bg-[#111111] border border-blue-500/10 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-blue-500/30"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <button
                onClick={() => setSelectedTicket(null)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 