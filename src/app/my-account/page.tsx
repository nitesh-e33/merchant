'use client'
import React, { useState, useEffect } from "react";
import UserProfileForm from "../components/MyAccount/UserProfileForm";
import CompanyProfileForm from "../components/MyAccount/CompanyProfileForm";
import { apiRequest } from "../lib/apiHelper";
import { toast } from "react-toastify";

const Page: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("user");
  const [userId, setUserId] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');
  const [bankId, setBankId] = useState<string>('');
  const [companyData, setCompanyData] = useState<any>({});
  const [entityList, setEntityList] = useState<any[]>([]);
  const [kycRequiredDocsList, setKycRequiredDocsList] = useState<any[]>([]);
  const [bankData, setBankData] = useState<any>({});
  const [services, setServices] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

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
        const response = await apiRequest('GET', '/v1/merchant/profile', {merchant_id:storedUserId});

        if (response.StatusCode === '1') {
          const user = response.Result || {};
          setUserData(user);
          const companyData = user.company || {};
          const companyId = companyData.company_id || '';
          const bankData = user.bank_account?.[0] || {};
          const bankId = bankData.id || '';
          const entityList = await apiRequest('GET', '/v1/merchant/entity/list');
          const kycRequiredDocsList = companyId ? await apiRequest('GET', '/v1/merchant/get-all-kyc-required-document', {
            company_id: companyId,
            entity_id: companyData.entity_type,
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
  const handleTabClick = (tab: string) => {
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
                  Morbi turpis dolor, vulputate vitae felis non, tincidunt
                  congue mauris. Phasellus volutpat augue id mi placerat mollis.
                  Vivamus faucibus eu massa eget condimentum. Fusce nec
                  hendrerit sem, ac tristique nulla. Integer vestibulum orci
                  odio. Cras nec augue ipsum. Suspendisse ut velit condimentum,
                  mattis urna a, malesuada nunc. Curabitur eleifend facilisis
                  velit finibus tristique. Nam vulputate, eros non luctus
                  efficitur, ipsum odio volutpat massa, sit amet sollicitudin
                  est libero sed ipsum. Nulla lacinia, ex vitae gravida
                  fermentum, lectus ipsum gravida arcu, id fermentum metus arcu
                  vel metus. Curabitur eget sem eu risus tincidunt eleifend ac
                  ornare magna.
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "document" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  Pellentesque vestibulum commodo nibh nec blandit. Maecenas
                  neque magna, iaculis tempus turpis ac, ornare sodales tellus.
                  Mauris eget blandit dolor. Quisque tincidunt venenatis
                  vulputate. Morbi euismod molestie tristique. Vestibulum
                  consectetur dolor a vestibulum pharetra. Donec interdum
                  placerat urna nec pharetra. Etiam eget dapibus orci, eget
                  aliquet urna. Nunc at consequat diam. Nunc et felis ut nisl
                  commodo dignissim. In hac habitasse platea dictumst. Praesent
                  imperdiet accumsan ex sit amet facilisis.
                </div>
                {services.length > 0 && (
                  <div
                    className={`tab-pane fade ${activeTab === "service" ? "show active" : ""}`}
                    role="tabpanel"
                  >
                    Integer imperdiet finibus ipsum, quis rutrum enim iaculis
                    eu. Quisque at eros metus. Fusce aliquam est nec massa
                    aliquet, eget eleifend neque scelerisque. Sed eu facilisis
                    odio. Sed sagittis mi vitae ex maximus facilisis. Vestibulum
                    dictum consectetur quam, nec lacinia urna venenatis
                    tincidunt. Nam vel semper odio. Pellentesque a est in dui
                    fermentum malesuada nec vel eros. Nulla ac justo ornare,
                    suscipit nulla sed, blandit tellus. Aenean purus libero,
                    ultricies sed faucibus nec, mollis at odio. Nulla facilisi.
                    Donec vulputate sem a nibh sollicitudin, quis tincidunt
                    eros placerat. Integer ut aliquam sem. Nam aliquet urna
                    mattis, mollis ligula quis, vehicula dui.
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