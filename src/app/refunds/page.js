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

async function fetchMerchantRefunds(searchParams = {}) {
  try {
    const response = await apiRequest('POST', '/v1/merchant/refunds', {
      post: searchParams
    });
    if (response.StatusCode === "1") {
      return response.Result.refund_transaction_history;
    } else {
      toast.error(response.Result || 'Something went wrong. Please try again later.');
      return [];
    }
  } catch (error) {
    toast.error('An error occurred while fetching the transactions');
    console.error('Error fetching transactions:', error);
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
      data: refunds,
      columns: [
        { title: 'DP Transaction ID', data: 'order_id' },
        { title: 'Refund ID', data: 'refund_id' },
        { title: 'Name', data: 'customer_name' },
        { title: 'Email', data: 'customer_email' },
        { title: 'Phone', data: 'customer_phone' },
        { title: 'Refund Amount', data: 'refund_amount' },
        { title: 'Refund  Request', data: 'refund_amount_request' },
        { title: 'Status', data: 'status' },
        { title: 'Order Created', data: 'created_at', render: formatDate },
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
