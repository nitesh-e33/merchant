'use client'
import React, { useState } from "react";
import UserProfileForm from "../components/MyAccount/UserProfileForm";
import CompanyProfileForm from "../components/MyAccount/CompanyProfileForm";

const Page = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [userId, setUserId] = useState();
  const [companyId, setCompanyId] = useState();
  const [bankId, setBankId] = useState();
  const [companyData, setCompanyData] = useState();
  const [entityList, setEntityList] = useState();

  const handleTabClick = (tab:any) => {
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
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content">
                <div
                  className={`tab-pane fade ${activeTab === "user" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <UserProfileForm />
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
              </div>
            </div>
            {/* /.card */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;