'use client';
import React, { useState, useEffect } from "react";
import UserProfileForm from "../components/MyAccount/UserProfileForm";
import CompanyProfileForm from "../components/MyAccount/CompanyProfileForm";
import BankProfileForm from "../components/MyAccount/BankProfileForm";
import DocumentTypeForm from "../components/MyAccount/DocumentType";
import ServiceTab from "../components/MyAccount/ServiceTab";
import { apiRequest } from "../lib/apiHelper";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { generateAndCompareDeviceId } from "../lib/helper";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("user");
  const [userId, setUserId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [bankId, setBankId] = useState('');
  const [companyData, setCompanyData] = useState({});
  const [entityList, setEntityList] = useState([]);
  const [kycRequiredDocsList, setKycRequiredDocsList] = useState([]);
  const [bankData, setBankData] = useState({});
  const [services, setServices] = useState([]);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('error')) {
      toast.error('Your Profile is Under Verification.');
    }
    generateAndCompareDeviceId(router);
  }, [searchParams, router]);

  useEffect(() => {
    const fetchMerchantProfile = async () => {
      const storedUser = localStorage.getItem('user');
      let storedUserId = '';

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          storedUserId = userData.user_id || '';
          setUserId(storedUserId);
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e);
          setError('Error retrieving user data');
          setLoading(false); // Set loading to false
          return;
        }
      }

      try {
        const response = await apiRequest('GET', '/v1/merchant/profile', { get: { merchant_id: storedUserId } });

        if (response.StatusCode === '1') {
          const user = response.Result || {};
          setUserData(user);
          const companyData = user.company || {};
          const companyId = companyData.company_id || '';
          const bankData = user.bank_account?.[0] || {};
          const bankId = bankData.id || '';
          const entityList = await apiRequest('GET', '/v1/merchant/entity/list');
          const kycRequiredDocsList = companyId ? await apiRequest('GET', '/v1/merchant/get-all-kyc-required-document', {
            get: {
              company_id: companyId,
              entity_id: companyData.entity_type,
            },
          }) : [];
          const services = companyData.credentials?.mapped_services || [];

          setCompanyData(companyData);
          setCompanyId(companyId);
          setBankData(bankData);
          setBankId(bankId);
          setEntityList(entityList.Result || []);
          setKycRequiredDocsList(kycRequiredDocsList.Result || []);
          setServices(services);

          // Set initial active tab based on the data availability
          if (!user) {
            setActiveTab('user');
          } else if (user && !companyData) {
            setActiveTab('company');
          } else if (user && companyData && !bankData) {
            setActiveTab('bank');
          } else if (user && companyData && bankData && !services.length) {
            setActiveTab('document');
          } else {
            setActiveTab('service');
          }
        } else if (response.StatusCode === '0') {
          setError(response.Message || 'An error occurred');
          toast.error(response.Message || 'An error occurred');
        } else {
          toast.error(response.Result || 'An unknown error occurred');
          setError(response.Result || 'An unknown error occurred');
        }
      } catch (error) {
        setError('An error occurred while fetching the profile');
        console.error('Error fetching merchant profile:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false when fetching is complete
      }
    };

    fetchMerchantProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  const handleTabClick = (tab) => {
    // Control tab navigation based on data availability
    if (tab === "company" && !userId) return;
    if (tab === "bank" && (!userId || !companyId)) return;
    if (tab === "document" && (!userId || !companyId || !bankId)) return;
    if (tab === "service" && (!userId || !companyId || !bankId || !services.length)) return;
    setActiveTab(tab);
  };

  return (
    <>
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1 className="mt-2 text-xl">Merchant Profile</h1>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card card-primary card-outline card-outline-tabs">
            <div className="card-header p-0 border-bottom-0">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "user" ? "active" : ""}`}
                    onClick={() => handleTabClick("user")}
                    role="tab"
                  >
                    User Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "company" ? "active" : ""}`}
                    onClick={() => handleTabClick("company")}
                    role="tab"
                  >
                    Company Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "bank" ? "active" : ""}`}
                    onClick={() => handleTabClick("bank")}
                    role="tab"
                  >
                    Bank Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "document" ? "active" : ""}`}
                    onClick={() => handleTabClick("document")}
                    role="tab"
                  >
                    Document Type
                  </a>
                </li>
                {services.length > 0 && (
                  <li className="nav-item">
                    <a
                      className={`nav-link ${activeTab === "service" ? "active" : ""}`}
                      onClick={() => handleTabClick("service")}
                      role="tab"
                    >
                      Service(s)
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content">
                <div
                  className={`tab-pane fade ${activeTab === "user" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <UserProfileForm userData={userData} />
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "company" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <CompanyProfileForm
                    userId={userId}
                    companyId={companyId}
                    bankId={bankId}
                    companyData={companyData}
                    entityList={entityList}
                  />
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "bank" ? "show active" : ""}`}
                  role="tabpanel"
                >
                 <BankProfileForm
                    userId={userId}
                    companyId={companyId}
                    bankId={bankId}
                    bankData={bankData}
                  />
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "document" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <DocumentTypeForm
                    companyId={companyId}
                    kycRequiredDocsList={kycRequiredDocsList}
                  />
                </div>
                {services.length > 0 && (
                  <div
                    className={`tab-pane fade ${activeTab === "service" ? "show active" : ""}`}
                    role="tabpanel"
                  >
                    <ServiceTab services={services} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;