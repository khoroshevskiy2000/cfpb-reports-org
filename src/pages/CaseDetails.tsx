import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Loader2, Download } from 'lucide-react';
import { supabase, Case } from '../lib/supabase';

function CaseDetails() {
  const { caseNumber } = useParams<{ caseNumber: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCase() {
      if (!caseNumber) {
        setError('No case number provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('cases')
          .select('*')
          .eq('case_number', caseNumber)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('Case not found');
        } else {
          setCaseData(data);
        }
      } catch (err) {
        setError('Failed to fetch case details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCase();
  }, [caseNumber]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'on hold':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'received':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatAmount = (amount: string) => {
    const numericValue = parseFloat(amount);
    if (isNaN(numericValue)) {
      return amount;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericValue);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <header className="bg-white py-4 shadow-md">
          <div className="container mx-auto px-4">
            <img src="/logo_237x50.c7c2ba6c929f copy.png" alt="CFPB Logo" className="h-12" />
          </div>
        </header>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-red-600 mb-4">
                <Shield className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Case Not Found</h2>
              <p className="text-gray-600 mb-6">
                {error || 'The case number you entered does not exist in our system.'}
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <img src="/logo_237x50.c7c2ba6c929f copy.png" alt="CFPB Logo" className="h-12" />
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
              <h1 className="text-3xl font-bold text-white mb-2">Case Details</h1>
              <p className="text-green-100">Case Number: {caseData.case_number}</p>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                    caseData.status
                  )}`}
                >
                  Status: {caseData.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{caseData.full_name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      ID Number
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{caseData.id_number}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-lg font-semibold text-gray-900">{caseData.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{caseData.phone_number}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Date of Birth
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(caseData.date_of_birth)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Country
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{caseData.country}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Total Retrieved Amount
                    </label>
                    <p className="text-2xl font-bold text-green-600">
                      {formatAmount(caseData.total_retrieved_amount)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Transaction ID
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {caseData.transaction_id || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Platform
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {caseData.platform || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Payment Required
                    </label>
                    <p className="text-2xl font-bold text-orange-600">
                      {caseData.payment_required}
                    </p>
                  </div>
                </div>
              </div>

              {caseData.pdf_file_url && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Case Documents
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">PDF Document Available</p>
                        <p className="text-sm font-medium text-gray-900">{caseData.pdf_file_name}</p>
                        {caseData.pdf_uploaded_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded: {formatDate(caseData.pdf_uploaded_at)}
                          </p>
                        )}
                      </div>
                      <a
                        href={caseData.pdf_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={caseData.pdf_file_name || 'document.pdf'}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseDetails;
