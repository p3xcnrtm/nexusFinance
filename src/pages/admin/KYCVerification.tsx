import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';

export default function KYCVerification() {
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKycRequests();
  }, []);

  const fetchKycRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/kyc');
      if (res.ok) {
        const data = await res.json();
        setKycRequests(data);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to fetch KYC requests');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (request: any) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/kyc/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        const updatedRequests = kycRequests.map(r => 
          r.id === id ? { ...r, status: 'Approved' } : r
        );
        setKycRequests(updatedRequests);
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to approve KYC');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/kyc/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        const updatedRequests = kycRequests.map(r => 
          r.id === id ? { ...r, status: 'Rejected' } : r
        );
        setKycRequests(updatedRequests);
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to reject KYC');
      }
    } catch (err: any) {
      alert(err.message);
    }
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

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-nexus-navy/50 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-nexus-dark/50 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Document Type</th>
              <th className="px-6 py-4 font-medium">Submission Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading KYC requests...</td>
              </tr>
            ) : kycRequests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No KYC requests found.</td>
              </tr>
            ) : kycRequests.map((request) => (
              <tr key={request.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-white">
                  <div>{request.userName}</div>
                  <div className="text-xs text-slate-500">{request.userEmail}</div>
                </td>
                <td className="px-6 py-4 text-slate-400">{request.documentType}</td>
                <td className="px-6 py-4 text-slate-400">{new Date(request.createdAt).toLocaleDateString()}</td>
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
                <p className="text-sm text-slate-400">Reviewing submission for <span className="text-white font-bold">{selectedRequest.userName}</span></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {['frontImage', 'backImage', 'selfieImage'].map((docKey, index) => {
                const docUrl = selectedRequest[docKey];
                if (!docUrl) return null;
                return (
                  <div key={index} className="space-y-2">
                    <p className="text-sm font-medium text-slate-300 capitalize">{docKey.replace('Image', ' Image')}</p>
                    <div className="aspect-video bg-black/50 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                      <img src={docUrl} alt={docKey} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a href={docUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-nexus-dark font-bold rounded-lg text-sm">View Full Size</a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedRequest.status === 'Pending' && (
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
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
