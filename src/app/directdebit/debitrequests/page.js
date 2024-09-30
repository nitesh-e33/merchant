'use client';
import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { apiRequest } from '../../lib/apiHelper';
import { toast } from 'react-toastify';
import Breadcrumb from '../../components/Transactions/Breadcrumb';
import SearchForm from '../../components/Autodebit/DebitRequest/SearchForm';
import DebitRequestModal from '../../components/Autodebit/DebitRequest/DebitRequestModal'
import PaymentTable from '../../components/Transactions/PaymentTable';
import { formatDateTime, generateAndCompareDeviceId, handleApiRequest, initSelect2, fetchDataHelper, encryptData, decryptedData } from '../../lib/helper';
import Loader from '../../components/Loader';
import { useRouter } from 'next/navigation';

async function fetchMerchantDebitRequestData(searchParams = {}) {
  const cacheKey = 'requestData';
  const cacheExpiryTime = 60 * 60 * 1000; // 1 hour in ms
  return handleApiRequest('/v1/merchant/get-auto-debit-requests', searchParams, cacheKey, cacheExpiryTime).then(response => {
    return response.data;
  });
}

function Page() {
  const [debitRequests, setDebitRequests] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debitRequestDetails, setDebitRequestDetails] = useState(null);
  const [dto, setDto] = useState('this_month');
  const [dateRange, setDateRange] = useState([null, null]);
  const tableRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    generateAndCompareDeviceId(router);
    initSelect2(setSearchName);

    const fetchData = async () => {
      const data = await fetchDataHelper(dto, dateRange, searchName, searchValue, fetchMerchantDebitRequestData);
      setDebitRequests(data);
    };

    fetchData();

    return () => {
      $('.select2').off('change');
    };
  }, [router, dto]);

  useEffect(() => {
    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().clear().destroy();
    }
    table.DataTable({
      scrollX: true,
      order: [[7, 'asc']],
      data: debitRequests,
      columns: [
        { title: 'DP Transaction ID', data: 'txnid', className: 'whitespace-nowrap' },
        { title: 'First Name', data: 'first_name', className: 'whitespace-nowrap' },
        { title: 'Email', data: 'email' },
        { title: 'Phone', data: 'phone' },
        { title: 'Amount', data: 'amount' },
        { title: 'Request State', data: 'request_state', className: 'whitespace-nowrap' },
        { title: 'Created At', data: 'created_at', render: formatDateTime, className: 'whitespace-nowrap' },
        { title: 'Extra Details', data: null, render: (data, type, row) => `<button class="btn btn-info btn-sm request-details" data-request-id="${row.id}">View</button>`, className: 'whitespace-nowrap' },
      ],
    });

    table.off('click', '.request-details');
    table.on('click', '.request-details', async function () {
      setIsLoading(true);
      const requestId = $(this).data('request-id');
      const cacheKey = `debitRequestData_${requestId}`;
      const cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds

      // Retrieve and decrypt the cached data
      const cachedEncryptedData = localStorage.getItem(cacheKey);
      if (cachedEncryptedData) {
        const decryptedCachedData = decryptedData(cachedEncryptedData);
        const { data, timestamp } = decryptedCachedData;
        const currentTime = new Date().getTime();

        if (currentTime - timestamp < cacheExpiry) {
          setDebitRequestDetails(data);
          setIsModalOpen(true);
          setIsLoading(false);
          return;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
      try {
        const response = await apiRequest('POST', '/v1/merchant/get-auto-debit-requests-details', {
          post: { request_id: requestId }
        });
        if (response.StatusCode === "1") {
          setDebitRequestDetails(response.Result);
          setIsModalOpen(true);
          // Encrypt and store the data in localStorage
          const encryptedData = encryptData({
            data: response.Result,
            timestamp: new Date().getTime()
          });
          localStorage.setItem(cacheKey, encryptedData);
        } else {
          toast.error(response.Result || 'Failed to fetch debit request details.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching debit request details.');
        console.error('Error fetching debit request details:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
  }, [debitRequests]);

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
    const data = await fetchMerchantDebitRequestData(searchParams);
    setDebitRequests(data);
  };

  const resetSearch = async () => {
    setSearchName('');
    setSearchValue('');
    setDto('this_month');
    setDateRange([null, null]);
    $('.select2').val('').trigger('change');
    const data = await fetchMerchantDebitRequestData({dto: 'this_month'});
    setDebitRequests(data);
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
          <h1 className="text-xl mt-2">Auto Debit Requests</h1>
        </div>
        <div className="col-sm-6 mt-2">
          <Breadcrumb title="Auto Debit Requests" />
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

      <PaymentTable tableRef={tableRef} title="Auto Debit Requests" />

      <DebitRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        debitRequest={debitRequestDetails}
      />
    </>
  );
}

export default Page;
