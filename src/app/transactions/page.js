'use client';
import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { apiRequest } from '../lib/apiHelper';
import { toast } from 'react-toastify';
import TransactionTable from '../components/Transactions/TransactionTable';
import Breadcrumb from '../components/Transactions/Breadcrumb';
import SearchForm from '../components/Transactions/SearchForm';
import FilterForm from '../components/Transactions/FilterForm';
import TransactionDetailsModal from '../components/Transactions/TransactionDetailsModal';
import Loader from '../components/Loader';

async function fetchMerchantTransactions(searchParams = {}) {
  try {
    const response = await apiRequest('POST', '/v1/merchant/transactions', {
      post: searchParams
    });
    if (response.StatusCode === "1") {
      return response.Result.transaction_history;
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
  const [transactions, setTransactions] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [dto, setDto] = useState('this_month');
  const [dateRange, setDateRange] = useState([null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    const initSelect2 = () => {
      $('.select2').select2();

      $('.select2').on('change', function () {
        const name = $(this).attr('name');
        const value = $(this).val();
        if (name === 'searchName') {
          setSearchName(value);
        } else if (name === 'paymentStatus') {
          setPaymentStatus(value);
        } else if (name === 'paymentMode') {
          setPaymentMode(value);
        }
      });
    };

    const fetchData = async () => {
      if (dto === 'custom_range' && (!dateRange || !dateRange[0] || !dateRange[1])) {
        return;
      }
      const searchParams = {
        payment_status: paymentStatus,
        payment_method: paymentMode,
        dto,
        ...(dto === 'custom_range' && dateRange && dateRange[0] && dateRange[1] && {
          start_date: dateRange[0].toISOString().split('T')[0],
          end_date: dateRange[1].toISOString().split('T')[0],
        }),
        [searchName]: searchValue,
      };
      const data = await fetchMerchantTransactions(searchParams);
      setTransactions(data);
    };

    initSelect2();
    fetchData();

    return () => {
      $('.select2').off('change');
    };
  }, [paymentStatus, paymentMode, dto]);

  const formatDate = (data) => {
    const date = new Date(data);
    const day = date.toLocaleString('en-IN', { day: '2-digit', timeZone: 'Asia/Kolkata' });
    const month = date.toLocaleString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' });
    const year = date.toLocaleString('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' });
    const time = date.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
    return `${month}-${day}-${year} ${time}`;
  };

  useEffect(() => {
    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().clear().destroy();
    }
    table.DataTable({
      scrollX: true,
      order: [[0, 'desc']],
      data: transactions,
      columns: [
        { title: 'DP Transaction ID', data: 'dp_trans_id' },
        { title: 'Customer Name', data: 'customer_name' },
        { title: 'Phone', data: 'customer_phone' },
        { title: 'Email', data: 'customer_email' },
        { title: 'Amount', data: 'amount' },
        { title: 'Payment Status', data: 'payment_status' },
        { title: 'Payment Mode', data: 'payment_method' },
        { title: 'Reference ID', data: 'reference_id' },
        { title: 'Date', data: 'created_at', render: formatDate },
        { title: 'View', data: null, render: (data, type, row) => `<button class="btn btn-info btn-sm order-details" data-order-id="${row.order_id}">View</button>` },
      ],
    });

    table.off('click', '.order-details');
    table.on('click', '.order-details', async function () {
      setIsLoading(true);
      const orderId = $(this).data('order-id');
      try {
        const response = await apiRequest('POST', '/v1/merchant/transactions-details', {
          post: { order_id: orderId }
        });
        if (response.StatusCode === "1") {
          setTransactionDetails(response.Result);
          setIsModalOpen(true);
        } else {
          toast.error(response.Result || 'Failed to fetch transaction details.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching transaction details.');
        console.error('Error fetching transaction details:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
  }, [transactions]);

  const handleSearch = async () => {
    if (!searchName || !searchValue) {
      toast.error('Please select a search criteria and enter a search value.');
      return;
    }
    const searchParams = {
      payment_status: paymentStatus,
      payment_method: paymentMode,
      dto,
      ...(dto === 'custom_range' && dateRange && dateRange[0] && dateRange[1] && {
        start_date: dateRange[0].toISOString().split('T')[0],
        end_date: dateRange[1].toISOString().split('T')[0],
      }),
      ...(searchName && searchValue && { [searchName]: searchValue }),
    };
    const data = await fetchMerchantTransactions(searchParams);
    setTransactions(data);
  };

  const resetSearch = async () => {
    setSearchName('');
    setSearchValue('');
    setPaymentStatus('');
    setPaymentMode('');
    setDto('this_month');
    setDateRange([null, null]);
    $('.select2').val('').trigger('change');
    const data = await fetchMerchantTransactions({
      dto: 'this_month',
      payment_status: '',
      payment_method: '',
    });
    setTransactions(data);
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
          <h1 className="text-xl mt-2">Transactions</h1>
        </div>
        <div className="col-sm-6 mt-2">
          <Breadcrumb />
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

      <div className="row">
        <FilterForm
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      <TransactionTable tableRef={tableRef} />

      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={transactionDetails}
      />
    </>
  );
}

export default Page;
