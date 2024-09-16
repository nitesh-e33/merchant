'use client';
import React, { useEffect, useState } from 'react';
import TokenSetting from '../components/Settings/TokenSetting';
import WebhookSetting from '../components/Settings/WebhookSetting'
import ChangePassword from '../components/Settings/ChangePassword'
import useFetchSettings from '../lib/useFetchSettings';
import { useRouter } from 'next/navigation';
import { generateAndCompareDeviceId } from '../lib/helper';

function Page() {
  const [activeTab, setActiveTab] = useState('token');
  const { credentials, webhookList, loading } = useFetchSettings();
  const router = useRouter();

  useEffect(() => {
    generateAndCompareDeviceId(router);
  }, [router]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

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
                    className={`nav-link ${activeTab === 'token' ? 'active' : ''}`}
                    onClick={() => handleTabClick('token')}
                    role="tab"
                  >
                    Token Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'webhook' ? 'active' : ''}`}
                    onClick={() => handleTabClick('webhook')}
                    role="tab"
                  >
                    Webhook Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'changePassword' ? 'active' : ''}`}
                    onClick={() => handleTabClick('changePassword')}
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
                  className={`tab-pane fade ${activeTab === 'token' ? 'show active' : ''}`}
                  role="tabpanel"
                >
                  {credentials && <TokenSetting credentials={credentials} />}
                </div>
                <div
                  className={`tab-pane fade ${activeTab === 'webhook' ? 'show active' : ''}`}
                  role="tabpanel"
                >
                  {<WebhookSetting webhookList={webhookList} />}
                </div>
                <div
                  className={`tab-pane fade ${activeTab === 'changePassword' ? 'show active' : ''}`}
                  role="tabpanel"
                >
                  <ChangePassword />
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
