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
import { decryptedData, generateAndCompareDeviceId } from "../lib/helper";

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
      let storedUserId = '';
      const encryptedUser = localStorage.getItem('user');
      if (encryptedUser) {
        const userData = decryptedData(encryptedUser);
        if (userData) {
          storedUserId = userData.user_id || '';
          setUserId(storedUserId);
        } else {
          console.error('Error parsing user data from localStorage');
          return;
        }
      } else {
        toast.error('Please login to your account')
        router.push('/');
        return;
      }

      // Check for cached data
      const cachedProfile = localStorage.getItem('mprofile');
      const cachedEntityList = localStorage.getItem('elist');
      const cachedKycDocs = localStorage.getItem('docs');

      let profileData, entityListData, kycDocsData;

      // Fetch profile if not cached
      if (cachedProfile) {
        profileData = JSON.parse(cachedProfile);
      } else {
        const profileResponse = await apiRequest('GET', '/v1/merchant/profile', { get: { merchant_id: storedUserId } });
        if (profileResponse.StatusCode === '1') {
          profileData = profileResponse.Result || {};
          localStorage.setItem('mprofile', JSON.stringify(profileData)); // Cache the profile data
        } else {
          console.error('Error fetching profile:', profileResponse.Message);
          return;
        }
      }

      // Fetch entity list if not cached
      if (cachedEntityList) {
        entityListData = JSON.parse(cachedEntityList);
      } else {
        const entityListResponse = await apiRequest('GET', '/v1/merchant/entity/list');
        if (entityListResponse.StatusCode === '1') {
          entityListData = entityListResponse.Result || [];
          localStorage.setItem('elist', JSON.stringify(entityListData)); // Cache the entity list
        } else {
          console.error('Error fetching entity list:', entityListResponse.Message);
          return;
        }
      }

      // Fetch KYC documents if not cached and if companyId is available
      const companyId = profileData.company?.company_id;
      if (companyId && cachedKycDocs) {
        kycDocsData = JSON.parse(cachedKycDocs);
      } else if (companyId) {
        const kycDocsResponse = await apiRequest('GET', '/v1/merchant/get-all-kyc-required-document', {
          get: {
            company_id: companyId,
            entity_id: profileData.company.entity_type,
          },
        });
        if (kycDocsResponse.StatusCode === '1') {
          kycDocsData = kycDocsResponse.Result || [];
          localStorage.setItem('docs', JSON.stringify(kycDocsData)); // Cache the KYC docs
        } else {
          console.error('Error fetching KYC documents:', kycDocsResponse.Message);
          return;
        }
      }

      // Set all the data into state once
      const companyData = profileData.company || {};
      const bankData = profileData.bank_account?.[0] || {};
      const services = companyData.credentials?.mapped_services || [];

      setUserData(profileData);
      setCompanyData(companyData);
      setCompanyId(companyData.company_id || '');
      setBankData(bankData);
      setBankId(bankData.id || '');
      setEntityList(entityListData);
      setKycRequiredDocsList(kycDocsData);
      setServices(services);

      // Set the active tab based on the fetched data
      const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0;
      if (!profileData) {
        setActiveTab('user');
      } else if (isEmptyObject(companyData)) {
        setActiveTab('company');
      } else if (isEmptyObject(bankData)) {
        setActiveTab('bank');
      } else if (services.length === 0) {
        setActiveTab('document');
      } else {
        setActiveTab('service');
      }

      setLoading(false);
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