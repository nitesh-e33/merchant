'use client';
import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { apiRequest } from '../lib/apiHelper';
import { toast } from 'react-toastify';
import TransactionTable from '../components/Transactions/TransactionTable';
import Breadcrumb from '../components/Transactions/Breadcrumb';
import SearchForm from '../components/Transactions/SearchForm';
import FilterForm from '../components/Transactions/FilterForm';

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
  const [dto, setDto] = useState('lifetime');
  const [dateRange, setDateRange] = useState([null, null]);
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
  }, [paymentStatus, paymentMode, dto, dateRange]);

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
        { title: 'Date', data: 'created_at', render: (data) => new Date(data).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' }) },
        { title: 'View', data: null, render: (data, type, row) => `<button class="btn btn-info btn-sm order-details" data-order-id="${row.order_id}">View</button>` },
      ],
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
      [searchName]: searchValue,
      payment_status: paymentStatus,
      payment_method: paymentMode,
      dto,
      start_date: dto === 'custom_range' ? dateRange[0]?.toISOString().split('T')[0] : undefined,
      end_date: dto === 'custom_range' ? dateRange[1]?.toISOString().split('T')[0] : undefined,
    };
    const data = await fetchMerchantTransactions(searchParams);
    setTransactions(data);
  };

  const resetSearch = async () => {
    setSearchName('');
    setSearchValue('');
    setPaymentStatus('');
    setPaymentMode('');
    setDto('lifetime');
    setDateRange([null, null]);
    $('.select2').val('').trigger('change');
    const data = await fetchMerchantTransactions();
    setTransactions(data);
  };

  const handleDateRangeChange = (dtoValue, dateRangeValue) => {
    setDto(dtoValue);
    setDateRange(dateRangeValue);
  };

  return (
    <>
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
    </>
  );
}

export default Page;
