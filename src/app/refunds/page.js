'use client';
import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { apiRequest } from '../lib/apiHelper';
import { toast } from 'react-toastify';
import Breadcrumb from '../components/Transactions/Breadcrumb';
import SearchForm from '../components/Refunds/SearchForm';
import RefundDetailModal from '../components/Refunds/RefundDetailsModal'
import PaymentTable from '../components/Transactions/PaymentTable';
import Loader from '../components/Loader';
import { formatDate, generateAndCompareDeviceId } from '../lib/helper';
import { useRouter } from 'next/navigation';

async function fetchMerchantRefunds(searchParams = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(searchParams).filter(([key, value]) => key.trim() !== '' && value.trim() !== '')
  );
  const isRefundData = Object.keys(filteredParams).length === 0;
  if (isRefundData) {
    const cachedData = localStorage.getItem('refundData');
    const cachedTime = localStorage.getItem('refundData_timestamp');
    const halfHour = 30 * 60 * 1000; // 30 minutes in milliseconds
    if (cachedData && cachedTime && (Date.now() - cachedTime < halfHour)) {
      return JSON.parse(cachedData);
    }
  }
  try {
    const response = await apiRequest('POST', '/v1/merchant/refunds', {
      post: searchParams
    });
    if (response.StatusCode === "1") {
      const resultData = response.Result.refund_transaction_history;
      if (isRefundData) {
        localStorage.setItem('refundData', JSON.stringify(resultData));
        localStorage.setItem('refundData_timestamp', Date.now());
      }
      return resultData;
    } else {
      toast.error(response.Result || 'Something went wrong. Please try again later.');
      return [];
    }
  } catch (error) {
    toast.error('An error occurred while fetching the refund transactions');
    console.error('Error fetching refund transactions:', error);
    return [];
  }
}

function Page() {
  const [refunds, setRefunds] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refundDetails, setRefundDetails] = useState(null);
  const tableRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    generateAndCompareDeviceId(router);

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
        const searchParams = {
          [searchName]: searchValue,
        };
        const data = await fetchMerchantRefunds(searchParams);
        setRefunds(data);
    };

    initSelect2();
    fetchData();

    return () => {
      $('.select2').off('change');
    };
  }, []);

  useEffect(() => {
    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().clear().destroy();
    }
    table.DataTable({
      scrollX: true,
      order: [[0, 'desc']],
      data: refunds,
      columns: [
        { title: 'DP Transaction ID', data: 'order_id', className: 'whitespace-nowrap' },
        { title: 'Refund ID', data: 'refund_id' },
        { title: 'Name', data: 'customer_name' },
        { title: 'Email', data: 'customer_email' },
        { title: 'Phone', data: 'customer_phone' },
        { title: 'Refund Amount', data: 'refund_amount', className: 'whitespace-nowrap' },
        { title: 'Refund  Request', data: 'refund_amount_request', className: 'whitespace-nowrap' },
        { title: 'Status', data: 'status' },
        { title: 'Order Created', data: 'created_at', render: formatDate, className: 'whitespace-nowrap' },
        { title: 'View', data: null, render: (data, type, row) => `<button class="btn btn-info btn-sm refund-details" data-order-id="${row.order_id}">View</button>` },
      ],
    });

    table.off('click', '.refund-details');
    table.on('click', '.refund-details', async function () {
      setIsLoading(true);
      const orderId = $(this).data('order-id');
      const cacheKey = `refundData_${orderId}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const currentTime = new Date().getTime();

        if (currentTime - timestamp < cacheExpiry) {
          setRefundDetails(data);
          setIsModalOpen(true);
          setIsLoading(false);
          return;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
      try {
        const response = await apiRequest('POST', '/v1/merchant/refund-details', {
          post: { order_id: orderId }
        });
        if (response.StatusCode === "1") {
          setRefundDetails(response.Result);
          setIsModalOpen(true);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: response.Result,
              timestamp: new Date().getTime()
            })
          );
        } else {
          toast.error(response.Result || 'Failed to fetch refund details.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching refund details.');
        console.error('Error fetching refund details:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
  }, [refunds]);

  const handleSearch = async () => {
    if (!searchName || !searchValue) {
      toast.error('Please select a search criteria and enter a search value.');
      return;
    }
    const searchParams = {
        [searchName]: searchValue,
    };
    const data = await fetchMerchantRefunds(searchParams);
    setRefunds(data);
  };

  const resetSearch = async () => {
    setSearchName('');
    setSearchValue('');
    $('.select2').val('').trigger('change');
    const data = await fetchMerchantRefunds();
    setRefunds(data);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1 className="text-xl mt-2">Refund Transaction</h1>
        </div>
        <div className="col-sm-6 mt-2">
          <Breadcrumb title="Refund List"/>
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
        />
      </div>

      <PaymentTable tableRef={tableRef} title="Refund Transaction List" />

      <RefundDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refund={refundDetails}
      />
    </>
  );
}

export default Page;
