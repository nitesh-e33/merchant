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

async function fetchMerchantAuthorizationsData(searchParams = {}) {
  try {
    const response = await apiRequest('POST', '/v1/merchant/auto-debit-authorizations-list', {
      post: searchParams
    });
    if (response.StatusCode === "1") {
      return response.Result.data;
    } else {
      toast.error(response.Result || 'Something went wrong. Please try again later.');
      return [];
    }
  } catch (error) {
    toast.error('An error occurred while fetching the authorizations');
    console.error('Error fetching authorizations:', error);
    return [];
  }
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

  useEffect(() => {
    const initSelect2 = () => {
      $('.select2').select2();

      $('.select2').on('change', function () {
        const name = $(this).attr('name');
        const value = $(this).val();
        if (name === 'searchName') {
          setSearchName(value);
        }
      });
    };

    const fetchData = async () => {
      if (dto === 'custom_range' && (!dateRange || !dateRange[0] || !dateRange[1])) {
        return;
      }
      const searchParams = {
        dto,
        ...(dto === 'custom_range' && dateRange && dateRange[0] && dateRange[1] && {
          start_date: dateRange[0].toISOString().split('T')[0],
          end_date: dateRange[1].toISOString().split('T')[0],
        }),
        [searchName]: searchValue,
      };

      const data = await fetchMerchantAuthorizationsData(searchParams);
      setAuthorizations(data);
    };

    initSelect2();
    fetchData();

    return () => {
      $('.select2').off('change');
    };
  }, [dto]);

  const formatDate = (data) => {
    const date = new Date(data);
    const day = date.toLocaleString('en-IN', { day: '2-digit', timeZone: 'Asia/Kolkata' });
    const month = date.toLocaleString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' });
    const year = date.toLocaleString('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' });
    return `${day}-${month}-${year}`;
  };

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
        { title: 'Extra Details', data: null, render: (data, type, row) => `<button class="btn btn-info btn-sm authorization-details" data-mandate-id="${row.id}">View</button>` },
      ],
    });

    table.off('click', '.authorization-details');
    table.on('click', '.authorization-details', async function () {
      setIsLoading(true);
      const eMandateId = $(this).data('mandate-id');
      const cacheKey = `authorizationData_${eMandateId}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
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
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: response.Result,
              timestamp: new Date().getTime()
            })
          );
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
