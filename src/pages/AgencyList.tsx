import React, { useEffect, useState } from 'react';
import { Plus, Check, X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { Agency } from '../types';
import { apiRequest } from '../lib/apiHelper';

const AgencyList: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    licenseType: '',
    licenseExpirationDate: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    companyName: '',
    registeredAgentName: '',
    phoneNumber: '',
    emailAddress: '',
  });
  const [rejectionFormData, setRejectionFormData] = useState({
    rejectionReasons: '',
    otherReasons: '',
    notify: true,
  });

  const fetchAgencies = async () => {
    try {
      const response = await apiRequest<Agency[]>({
        url: '/api/agencies',
        method: 'GET',
        params: { page: 1, limit: 10 },
        requireAuth: true,
      });

      if (response.data) {
        setAgencies(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch agencies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAgency) {
        await apiRequest<Agency[]>({
          url: `/api/agencies/${editingAgency.id}`,
          method: 'PUT',
          data: formData,
          requireAuth: true,
        });
        toast.success('Agency updated successfully');
      } else {
        await apiRequest<Agency[]>({
          url: '/api/agencies',
          method: 'POST',
          data: formData,
          requireAuth: true,
        });
        toast.success('Agency added successfully');
      }

      setShowAddModal(false);
      setEditingAgency(null);
      setFormData({
        licenseNumber: '',
        licenseType: '',
        licenseExpirationDate: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        companyName: '',
        registeredAgentName: '',
        phoneNumber: '',
        emailAddress: '',
      });
      fetchAgencies();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleStatusChange = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await apiRequest<Agency[]>({
        url: `api/agencies/${id}/status`,
        method: 'PUT',
        data: {
          status: status,
          notify: rejectionFormData.notify,
          rejectionReasons: `${rejectionFormData.rejectionReasons}, ${rejectionFormData.otherReasons}`,
        },
        requireAuth: true,
      });
      toast.success(`Agency ${status} successfully`);
      fetchAgencies();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this agency? All data related to agency will be deleted permanently.')) return;

    try {
      await apiRequest<Agency[]>({
        url: `/api/agencies/${id}`,
        method: 'DELETE',
        requireAuth: true,
      });
      toast.success('Agency deleted successfully');
      fetchAgencies();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setFormData({
      licenseNumber: agency.licenseNumber,
      licenseType: agency.licenseType,
      licenseExpirationDate: agency.licenseExpirationDate,
      address: agency.address,
      city: agency.city,
      state: agency.state,
      country: agency.country,
      zip: agency.zip,
      companyName: agency.companyName,
      registeredAgentName: agency.registeredAgentName,
      phoneNumber: agency.phoneNumber,
      emailAddress: agency.emailAddress,
    });
    setShowAddModal(true);
  };

  const handleReject = (agency: Agency) => {
    setEditingAgency(agency);
    setShowRejectModal(true);
  };

  const handleSubmitRejectReason = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAgency?.id) {
      await handleStatusChange(editingAgency.id, 'rejected');
      setShowRejectModal(false);
      setRejectionFormData({
        notify: false,
        rejectionReasons: '',
        otherReasons: '',
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Agencies</h1>
            <button
              onClick={() => {
                setEditingAgency(null);
                setFormData({
                  licenseNumber: '',
                  licenseType: '',
                  licenseExpirationDate: '',
                  address: '',
                  city: '',
                  state: '',
                  country: '',
                  zip: '',
                  companyName: '',
                  registeredAgentName: '',
                  phoneNumber: '',
                  emailAddress: '',
                });
                setShowAddModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Agency
            </button>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {agencies.map((agency) => (
                  <li key={agency.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{agency.companyName}</h3>
                        <p className="text-sm text-gray-500">{agency.emailAddress}</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            agency.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : agency.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {agency.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {agency.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(agency.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleReject(agency)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(agency)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(agency.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        readOnly={!!editingAgency}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        License Number
                      </label>
                      <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.licenseNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, licenseNumber: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        License Type
                      </label>
                      <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.licenseType}
                        onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        License Expiration Date
                      </label>
                      <input
                        type="date"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.licenseExpirationDate}
                        onChange={(e) =>
                          setFormData({ ...formData, licenseExpirationDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                      <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
                      <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">State</label>
                      <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
                      <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Zip Code</label>
                      <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Registered Agent Name
                      </label>
                      <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.registeredAgentName}
                        onChange={(e) =>
                          setFormData({ ...formData, registeredAgentName: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingAgency ? 'Update' : 'Add'} Agency
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitRejectReason}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="mb-1">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Rejection Reason
                      </label>

                      {[
                        'Incorrect license number',
                        'Invalid or Incorrect email address',
                        'Invalid Phone Number',
                        'Incorrect or Incomplete address',
                        'Duplicate entry',
                        'Expired license',
                        'Other',
                      ].map((reason) => {
                        const selectedReasons =
                          rejectionFormData.rejectionReasons?.split(',') || [];
                        const isChecked = selectedReasons.includes(reason);

                        return (
                          <div key={reason} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={isChecked}
                              onChange={() => {
                                const updatedReasons = isChecked
                                  ? selectedReasons.filter((r) => r !== reason)
                                  : [...selectedReasons, reason];

                                setRejectionFormData({
                                  ...rejectionFormData,
                                  rejectionReasons: updatedReasons.join(','),
                                });
                              }}
                            />
                            <label>{reason}</label>
                          </div>
                        );
                      })}

                      {rejectionFormData.rejectionReasons?.includes('Other') && (
                        <textarea
                          required
                          placeholder="Please specify the reason"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                          value={rejectionFormData.otherReasons || ''}
                          onChange={(e) =>
                            setRejectionFormData({
                              ...rejectionFormData,
                              otherReasons: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Notify Agency
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rejectionFormData.notify}
                          onChange={(e) =>
                            setRejectionFormData({ ...rejectionFormData, notify: e.target.checked })
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyList;
