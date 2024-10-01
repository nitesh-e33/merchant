'use client';
import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { apiRequest } from '../../lib/apiHelper';
import { toast } from 'react-toastify';
import Breadcrumb from '../../components/Transactions/Breadcrumb';
import SearchForm from '../../components/Autodebit/Authorization/SearchForm';
import AuthorizationDetailsModal from '../../components/Autodebit/Authorization/AuthorizationDetailsModal'
import PaymentTable from '../../components/Transactions/PaymentTable';
import Loader from '../../components/Loader';
import { useRouter } from 'next/navigation';
import { generateAndCompareDeviceId, handleApiRequest, initSelect2, fetchDataHelper, encryptData, decryptedData } from '../../lib/helper';

async function fetchMerchantAuthorizationsData(searchParams = {}) {
  const cacheKey = 'authorizationData';
  const cacheExpiryTime = 60 * 60 * 1000;
  return handleApiRequest('/v1/merchant/auto-debit-authorizations-list', searchParams, cacheKey, cacheExpiryTime).then(response => {
    return response.data;
  });
}

function Page() {
  const [authorizations, setAuthorizations] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorizationDetails, setAuthorizationDetails] = useState(null);
  const [dto, setDto] = useState('this_month');
  const [dateRange, setDateRange] = useState([null, null]);
  const tableRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    generateAndCompareDeviceId(router);
    initSelect2(setSearchName);
    const fetchData = async () => {
      const data = await fetchDataHelper(dto, dateRange, searchName, searchValue, fetchMerchantAuthorizationsData);
      setAuthorizations(data);
    };

    fetchData();

    return () => {
      $('.select2').off('change');
    };
  }, [router, dto, dateRange, searchName, searchValue]);

  useEffect(() => {
    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().clear().destroy();
    }
    table.DataTable({
      scrollX: true,
      order: [[0, 'desc']],
      data: authorizations,
      columns: [
        { title: 'ID', data: 'id' },
        { title: 'Customer Authorization ID', data: 'customer_authentication_id' },
        { title: 'First Name', data: 'transaction_merchant_details.customer_name' },
        { title: 'Email', data: 'transaction_merchant_details.customer_email' },
        { title: 'Phone', data: 'transaction_merchant_details.customer_phone' },
        { title: 'Status', data: 'status' },
        { title: 'Extra Details', data: null, render: (data, type, row) => `<button class="btn btn-info btn-sm authorization-details" data-mandate-id="${row.id}">View</button>`, className: 'whitespace-nowrap'},
      ],
    });

    table.off('click', '.authorization-details');
    table.on('click', '.authorization-details', async function () {
      setIsLoading(true);
      const eMandateId = $(this).data('mandate-id');
      const cacheKey = `authorizationData_${eMandateId}`;
      const cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds

      // Retrieve and decrypt the cached data
      const cachedEncryptedData = localStorage.getItem(cacheKey);
      if (cachedEncryptedData) {
        const decryptedCachedData = decryptedData(cachedEncryptedData);
        const { data, timestamp } = decryptedCachedData;
        const currentTime = new Date().getTime();

        if (currentTime - timestamp < cacheExpiry) {
          setAuthorizationDetails(data);
          setIsModalOpen(true);
          setIsLoading(false);
          return;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
      try {
        const response = await apiRequest('POST', '/v1/merchant/get-auto-debit-auth-details', {
          post: { eMandate_id: eMandateId }
        });
        if (response.StatusCode === "1") {
          setAuthorizationDetails(response.Result);
          setIsModalOpen(true);
          // Encrypt and store the data in localStorage
          const encryptedData = encryptData({
            data: response.Result,
            timestamp: new Date().getTime()
          });
          localStorage.setItem(cacheKey, encryptedData);
        } else {
          toast.error(response.Result || 'Failed to fetch authorization details.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching authorization details.');
        console.error('Error fetching authorization details:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
  }, [authorizations]);

  const handleSearch = async () => {
    if (!searchName || !searchValue) {
      toast.error('Please select a search criteria and enter a search value.');
      return;
    }
    const searchParams = {
      dto,
      ...(dto === 'custom_range' && dateRange && dateRange[0] && dateRange[1] && {
        start_date: dateRange[0].toISOString().split('T')[0],
        end_date: dateRange[1].toISOString().split('T')[0],
      }),
      ...(searchName && searchValue && { [searchName]: searchValue }),
    };
    const data = await fetchMerchantAuthorizationsData(searchParams);
    setAuthorizations(data);
  };

  const resetSearch = async () => {
    setSearchName('');
    setSearchValue('');
    setDto('this_month');
    setDateRange([null, null]);
    $('.select2').val('').trigger('change');
    const data = await fetchMerchantAuthorizationsData({dto: 'this_month'});
    setAuthorizations(data);
  };

  const handleDateRangeChange = (dtoValue, dateRangeValue) => {
    setDto(dtoValue);
    setDateRange(dateRangeValue);
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1 className="text-xl mt-2">Auto Debit Authorization</h1>
        </div>
        <div className="col-sm-6 mt-2">
          <Breadcrumb title="Auto Debit Authorization" />
        </div>
      </div>

      <div className="row">
        <SearchForm
          searchName={searchName}
          searchValue={searchValue}
          setSearchName={setSearchName}
          setSearchValue={setSearchValue}
          handleSearch={handleSearch}
          resetSearch={resetSearch}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      <PaymentTable tableRef={tableRef} title="Auto Debit Authorization" />

      <AuthorizationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        authorizations={authorizationDetails}
      />
    </>
  );
}

export default Page;
