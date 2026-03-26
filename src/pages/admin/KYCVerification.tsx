import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';

export default function KYCVerification() {
  const [kycRequests, setKycRequests] = useState([
    { id: 1, user: 'John Doe', email: 'john@example.com', date: 'Oct 24, 2025', status: 'Pending', documents: ['ID Front', 'ID Back', 'Selfie'] },
    { id: 2, user: 'Sarah Smith', email: 'sarah@example.com', date: 'Oct 23, 2025', status: 'Approved', documents: ['Passport', 'Selfie'] },
    { id: 3, user: 'Mike Johnson', email: 'mike@example.com', date: 'Oct 22, 2025', status: 'Rejected', documents: ['ID Front', 'Selfie'] },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (request: any) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleApprove = (id: number) => {
    const updatedRequests = kycRequests.map(r => 
      r.id === id ? { ...r, status: 'Approved' } : r
    );
    setKycRequests(updatedRequests);
    setIsModalOpen(false);
  };

  const handleReject = (id: number) => {
    const updatedRequests = kycRequests.map(r => 
      r.id === id ? { ...r, status: 'Rejected' } : r
    );
    setKycRequests(updatedRequests);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">KYC Verification</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-nexus-navy border border-white/10 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            Filter Status
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-nexus-dark/50 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Submission Date</th>
              <th className="px-6 py-4 font-medium">Documents</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {kycRequests.map((request) => (
              <tr key={request.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-white">{request.user}</td>
                <td className="px-6 py-4 text-slate-400">{request.email}</td>
                <td className="px-6 py-4 text-slate-400">{request.date}</td>
                <td className="px-6 py-4 text-slate-400">{request.documents.length} Files</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 
                    request.status === 'Pending' ? 'bg-purple-500/10 text-purple-400' : 
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleView(request)}
                      className="p-1.5 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors" 
                      title="View Documents"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {request.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(request.id)}
                          className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors" 
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleReject(request.id)}
                          className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors" 
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Document Viewer Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-nexus-navy border border-white/10 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">KYC Documents</h3>
                <p className="text-sm text-slate-400">Reviewing submission for <span className="text-white font-bold">{selectedRequest.user}</span></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {selectedRequest.documents.map((doc: string, index: number) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm font-medium text-slate-300">{doc}</p>
                  <div className="aspect-video bg-black/50 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                    <FileText className="w-12 h-12 text-slate-600 group-hover:text-slate-500 transition-colors" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-4 py-2 bg-white text-nexus-dark font-bold rounded-lg text-sm">View Full Size</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
              <button 
                onClick={() => handleReject(selectedRequest.id)}
                className="px-4 py-2 bg-red-500/10 text-red-400 font-bold rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Reject Application
              </button>
              <button 
                onClick={() => handleApprove(selectedRequest.id)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Approve Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
