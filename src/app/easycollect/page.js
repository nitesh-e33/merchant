'use client';
import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEdit, faBan, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { apiRequest } from '../lib/apiHelper';
import { toast } from 'react-toastify';
import Breadcrumb from '../components/Transactions/Breadcrumb';
import SearchForm from '../components/EasyCollect/SearchForm';
import AuthorizationDetailsModal from '../components/Autodebit/Authorization/AuthorizationDetailsModal'
import PaymentTable from '../components/Transactions/PaymentTable';
import { formatDateTime } from '../lib/helper';
import Loader from '../components/Loader';

async function fetchEasyCollectData(searchParams = {}) {
  try {
    const response = await apiRequest('POST', '/v1/merchant/easy-collect-list', {
      post: searchParams
    });
    if (response.StatusCode === "1") {
      return response.Result.data;
    } else {
      toast.error(response.Result || 'Something went wrong. Please try again later.');
      return [];
    }
  } catch (error) {
    toast.error('An error occurred while fetching the easy collect data');
    console.error('Error fetching easy collect data:', error);
    return [];
  }
}

function Page() {
  const [easyCollects, setEasyCollects] = useState([]);
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

      const data = await fetchEasyCollectData(searchParams);
      setEasyCollects(data);
    };

    initSelect2();
    fetchData();

    return () => {
      $('.select2').off('change');
    };
  }, [dto]);

  useEffect(() => {
    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().clear().destroy();
    }
    table.DataTable({
      scrollX: true,
      order: [[12, 'desc']],
      data: easyCollects,
      columns: [
        { title: 'DP Transaction ID', data: 'order_id', className: 'whitespace-nowrap' },
        { title: 'Name', data: 'customer_name' },
        { title: 'Email ID', data: 'customer_email' },
        { title: 'Phone No.', data: 'customer_phone', className: 'whitespace-nowrap' },
        { title: 'Product Title', data: 'orders.item_name', className: 'whitespace-nowrap' },
        { title: 'Amount', data: 'amount' },
        { title: 'UDF1', data: 'udf1' },
        { title: 'UDF2', data: 'udf2' },
        { title: 'UDF3', data: 'udf3' },
        { title: 'UDF4', data: 'udf4' },
        { title: 'UDF5', data: 'udf5' },
        { title: 'Link Expiry At', data: 'expiry_date', className: 'whitespace-nowrap' },
        { title: 'Link Created At', data: 'created_at', render: formatDateTime, className: 'whitespace-nowrap' },
        { title: 'Payment Done', data: 'transaction_date', className: 'whitespace-nowrap' },
        
        // Status Column with Color Coding
        {
            title: 'Status',
            data: 'status',
            render: (data) => {
                let color;
                switch(data.toLowerCase()) {
                    case 'paid': color = 'green'; break;
                    case 'unpaid': color = 'red'; break;
                    case 'expired': color = 'orange'; break;
                    case 'open': color = 'blue'; break;
                    default: color = 'black';
                }
                return `<span style="color: ${color}">${data.charAt(0).toUpperCase() + data.slice(1)}</span>`;
            },
            className: 'whitespace-nowrap',
        },

        // QrCode Column with FontAwesome Icon
        {
            title: 'QrCode',
            data: null,
            render: (data, type, row) => {
                if (row.status.toLowerCase() === 'paid') {
                    return `<FontAwesomeIcon icon={faBan} />`;
                }
                return `<button class="btn btn-info btn-sm qr-code-generate" data-dp-link="${row.dp_short_link}">
                            Qr Code
                        </button>`;
            },
            className: 'whitespace-nowrap',
        },

        // Link Copy Column with FontAwesome Icon
        {
            title: 'Link',
            data: 'dp_short_link',
            render: (data) => {
                return `<span class="link-copy-icon" data-toggle="tooltip" data-placement="top" data-link="${data}">
                            <FontAwesomeIcon icon={faCopy} />
                        </span>`;
            },
            className: 'whitespace-nowrap',
        },

        // Edit Column with FontAwesome Icon
        {
            title: 'Edit',
            data: null,
            render: (data, type, row) => {
                if (row.status.toLowerCase() === 'paid') {
                    return `<FontAwesomeIcon icon={faBan} />`;
                }
                return `<span class="link-edit-icon" data-id="${row.id}">
                            <FontAwesomeIcon icon={faEdit} />
                        </span>`;
            },
            className: 'whitespace-nowrap',
        },
        ],
    });

    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
  }, [easyCollects]);

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
    const data = await fetchEasyCollectData(searchParams);
    setEasyCollects(data);
  };

  const resetSearch = async () => {
    setSearchName('');
    setSearchValue('');
    setDto('this_month');
    setDateRange([null, null]);
    $('.select2').val('').trigger('change');
    const data = await fetchEasyCollectData({dto: 'this_month'});
    setEasyCollects(data);
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
          <h1 className="text-xl mt-2">Easy Collect</h1>
        </div>
        <div className="col-sm-6 mt-2">
          <Breadcrumb title="Easy Collect" />
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

      <PaymentTable tableRef={tableRef} title="Easy Collect" />

      <AuthorizationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        easyCollects={authorizationDetails}
      />
    </>
  );
}

export default Page;
