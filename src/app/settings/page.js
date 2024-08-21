'use client'
import React, { useState } from 'react'

function Page() {
  const [activeTab, setActiveTab] = useState("token");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1 className="mt-2 text-xl">Setting</h1>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card card-primary card-outline card-outline-tabs">
            <div className="card-header p-0 border-bottom-0">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "token" ? "active" : ""}`}
                    onClick={() => handleTabClick("token")}
                    role="tab"
                  >
                    Token Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "webhook" ? "active" : ""}`}
                    onClick={() => handleTabClick("webhook")}
                    role="tab"
                  >
                    Webhook Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "changePassword" ? "active" : ""}`}
                    onClick={() => handleTabClick("changePassword")}
                    role="tab"
                  >
                    Change Password
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content">
                <div
                  className={`tab-pane fade ${activeTab === "token" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  Token Setting
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "webhook" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  Webhook Setting
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "changePassword" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  Change Password
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
