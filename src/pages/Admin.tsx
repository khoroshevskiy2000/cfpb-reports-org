import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAdmin } from '../context/AdminContext';
import { Plus, Edit2, Trash2, X, Save, LogOut, Upload, Search, Mail } from 'lucide-react';

interface Case {
  id: string;
  case_number: string;
  status: string;
  full_name: string;
  id_number: string;
  email: string;
  phone_number: string;
  date_of_birth: string | null;
  country: string;
  total_retrieved_amount: string;
  transaction_id: string | null;
  platform: string | null;
  payment_required: number;
  pdf_file_name: string | null;
  pdf_file_url: string | null;
  pdf_uploaded_at: string | null;
}

interface CaseForm {
  case_number: string;
  status: string;
  full_name: string;
  id_number: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  country: string;
  total_retrieved_amount: string;
  transaction_id: string;
  platform: string;
  payment_required: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const emptyForm: CaseForm = {
  case_number: '',
  status: 'Pending',
  full_name: '',
  id_number: '',
  email: '',
  phone_number: '',
  date_of_birth: '',
  country: '',
  total_retrieved_amount: '0',
  transaction_id: '',
  platform: '',
  payment_required: '0',
};

function Admin() {
  const navigate = useNavigate();
  const { logout } = useAdmin();
  const [cases, setCases] = useState<Case[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [formData, setFormData] = useState<CaseForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'cases' | 'submissions'>('cases');
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    fetchCases();
    fetchContactSubmissions();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (err) {
      setError('Failed to fetch cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactSubmissions(data || []);
    } catch (err) {
      console.error('Failed to fetch contact submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      setContactSubmissions(contactSubmissions.map(sub =>
        sub.id === id ? { ...sub, is_read: true } : sub
      ));
    } catch (err) {
      console.error('Failed to mark submission as read:', err);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContactSubmissions(contactSubmissions.filter(sub => sub.id !== id));
    } catch (err) {
      alert('Failed to delete submission');
      console.error(err);
    }
  };

  const handleOpenModal = (caseData?: Case) => {
    if (caseData) {
      setEditingCase(caseData);
      setFormData({
        case_number: caseData.case_number,
        status: caseData.status,
        full_name: caseData.full_name,
        id_number: caseData.id_number,
        email: caseData.email,
        phone_number: caseData.phone_number,
        date_of_birth: caseData.date_of_birth || '',
        country: caseData.country,
        total_retrieved_amount: caseData.total_retrieved_amount,
        transaction_id: caseData.transaction_id || '',
        platform: caseData.platform || '',
        payment_required: caseData.payment_required.toString(),
      });
    } else {
      setEditingCase(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCase(null);
    setFormData(emptyForm);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const caseData = {
        case_number: formData.case_number,
        status: formData.status,
        full_name: formData.full_name,
        id_number: formData.id_number,
        email: formData.email,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth || null,
        country: formData.country,
        total_retrieved_amount: formData.total_retrieved_amount || '',
        transaction_id: formData.transaction_id || null,
        platform: formData.platform || null,
        payment_required: formData.payment_required || '',
      };

      if (editingCase) {
        const { error } = await supabase
          .from('cases')
          .update(caseData)
          .eq('id', editingCase.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cases')
          .insert([caseData]);

        if (error) throw error;
      }

      await fetchCases();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save case');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case?')) return;

    try {
      const caseToDelete = cases.find(c => c.id === id);

      if (caseToDelete?.pdf_file_url) {
        const fileName = caseToDelete.pdf_file_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('case-pdfs')
            .remove([fileName]);
        }
      }

      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCases();
    } catch (err) {
      setError('Failed to delete case');
      console.error(err);
    }
  };

  const handlePdfUpload = async (caseId: string, file: File) => {
    try {
      setUploadingPdf(caseId);
      setError('');

      const fileExt = file.name.split('.').pop();
      const fileName = `${caseId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('case-pdfs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('case-pdfs')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('cases')
        .update({
          pdf_file_name: file.name,
          pdf_file_url: publicUrl,
          pdf_uploaded_at: new Date().toISOString(),
        })
        .eq('id', caseId);

      if (updateError) throw updateError;

      await fetchCases();
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF');
      console.error(err);
    } finally {
      setUploadingPdf(null);
    }
  };

  const statusOptions = ['Active', 'Blocked', 'Pending', 'On Hold', 'Received'];

  const filteredCases = cases.filter(caseItem =>
    searchQuery === '' ||
    caseItem.case_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.phone_number.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{activeTab === 'cases' ? 'Case Management' : 'Contact Submissions'}</h1>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by case number, name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-2 border-gray-300 focus:border-green-600 focus:outline-none pl-10 pr-4 py-3 rounded-lg text-gray-700 w-96"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Case
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'cases'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cases
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Mail className="w-5 h-5" />
            ОБРАЩЕНИЯ
            {contactSubmissions.filter(sub => !sub.is_read).length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {contactSubmissions.filter(sub => !sub.is_read).length}
              </span>
            )}
          </button>
        </div>

        {error && !isModalOpen && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {activeTab === 'cases' ? (
          loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading cases...</p>
            </div>
          ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Case Number</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Retrieved Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PDF</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        {searchQuery ? 'No cases match your search.' : 'No cases found. Add your first case to get started.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{caseItem.case_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            caseItem.status === 'Active' ? 'bg-green-100 text-green-800' :
                            caseItem.status === 'Blocked' ? 'bg-red-100 text-red-800' :
                            caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{caseItem.full_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{caseItem.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{caseItem.total_retrieved_amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {caseItem.pdf_file_name ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-600 font-medium">Uploaded</span>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handlePdfUpload(caseItem.id, file);
                                }}
                                disabled={uploadingPdf === caseItem.id}
                              />
                              <span className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                                <Upload className="w-4 h-4" />
                                {uploadingPdf === caseItem.id ? 'Uploading...' : 'Upload'}
                              </span>
                            </label>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenModal(caseItem)}
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(caseItem.id)}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )
        ) : (
          loadingSubmissions ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {contactSubmissions.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  No contact submissions yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {contactSubmissions.map((submission) => (
                    <div key={submission.id} className={`p-6 hover:bg-gray-50 ${!submission.is_read ? 'bg-blue-50' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
                            {!submission.is_read && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                NEW
                              </span>
                            )}
                            <span className="text-sm text-gray-500">
                              {new Date(submission.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            <strong>Email:</strong> {submission.email}
                          </div>
                          {submission.phone && (
                            <div className="text-sm text-gray-600 mb-1">
                              <strong>Phone:</strong> {submission.phone}
                            </div>
                          )}
                          <div className="text-sm text-gray-600 mb-3">
                            <strong>Subject:</strong> {submission.subject}
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {!submission.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(submission.id)}
                              className="text-green-600 hover:text-green-800 transition px-3 py-1 rounded bg-green-100 hover:bg-green-200 text-sm font-medium"
                              title="Mark as read"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSubmission(submission.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingCase ? 'Edit Case' : 'Add New Case'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="case_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Case Number *
                  </label>
                  <input
                    type="text"
                    id="case_number"
                    name="case_number"
                    required
                    value={formData.case_number}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="id_number" className="block text-sm font-medium text-gray-700 mb-1">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    id="id_number"
                    name="id_number"
                    required
                    value={formData.id_number}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="total_retrieved_amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Retrieved Amount
                  </label>
                  <input
                    type="text"
                    id="total_retrieved_amount"
                    name="total_retrieved_amount"
                    value={formData.total_retrieved_amount}
                    onChange={handleInputChange}
                    placeholder="e.g., $1,234.56 or 1000 USD"
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="payment_required" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Required
                  </label>
                  <input
                    type="text"
                    id="payment_required"
                    name="payment_required"
                    value={formData.payment_required}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    id="transaction_id"
                    name="transaction_id"
                    value={formData.transaction_id}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <input
                    type="text"
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 focus:border-green-600 focus:outline-none px-4 py-2 rounded-lg text-gray-700"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingCase ? 'Update Case' : 'Create Case'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
