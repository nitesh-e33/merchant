'use client';
import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { apiRequest } from '../lib/apiHelper';
import { toast } from 'react-toastify';
import Breadcrumb from '../components/Transactions/Breadcrumb';
import SearchForm from '../components/EasyCollect/SearchForm';
import PaymentTable from '../components/Transactions/PaymentTable';
import { formatDateTime, copyToClipboard, generateAndCompareDeviceId, handleApiRequest } from '../lib/helper';
import Loader from '../components/Loader';
import QrCodeModal from '../components/EasyCollect/QrCodeModal'
import LinkGenerationForm from '../components/EasyCollect/LinkGenerationForm';
import { useRouter } from 'next/navigation';

async function fetchEasyCollectData(searchParams = {}) {
  const cacheKey = 'easyCollectData';
  const cacheExpiryTime = 60 * 60 * 1000;
  return handleApiRequest('/v1/merchant/easy-collect-list', searchParams, cacheKey, cacheExpiryTime).then(response => {
    return response.data;
  });
}

function Page() {
  const [easyCollects, setEasyCollects] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dto, setDto] = useState('this_month');
  const [dateRange, setDateRange] = useState([null, null]);
  const tableRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeContent, setQrCodeContent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
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
  }, [router, dto]);

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
                return '<i class="fas fa-ban"></i>';
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
            render: function (data, type, row) {
              return `
                <span class="link-copy-icon cursor-pointer" data-toggle="tooltip" data-placement="top" data-link="${data}">
                  <i class="far fa-copy hover:text-blue-500 transition-colors duration-300"></i>
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
                return '<i class="fas fa-ban"></i>';
              }
              return `
                <span class="link-edit-icon cursor-pointer" data-id="${row.id}">
                  <i class="fas fa-edit hover:text-blue-500 transition-colors duration-300"></i>
                </span>`;
            },
            className: 'whitespace-nowrap',
        },
        ],
        drawCallback: function() {
          // Bind the click event to the copy icons
          $('.link-copy-icon').off('click').on('click', function() {
            const link = $(this).data('link');
            copyToClipboard(link);
          });
        }
    });

    table.off('click', '.qr-code-generate');
    table.on('click', '.qr-code-generate', async function () {
      setIsLoading(true);
      const dpLink = $(this).data('dp-link');
      if (!dpLink) { return; }
      try {
        const response = await fetch(`/api/generate-qr-code?url=${encodeURIComponent(dpLink)}`);
        const result = await response.json();

        if (result.qrCodeDataUrl) {
          setIsLoading(false);
          setQrCodeContent(`<img src="${result.qrCodeDataUrl}" alt="QR Code" />`);
          setIsModalOpen(true);
        } else {
          toast.error('Failed to generate QR code');
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
        toast.error('Error generating QR code');
      } finally {
        setIsLoading(false);
      }
    });

    // Event listener for Edit action
    table.off('click', '.link-edit-icon');
    table.on('click', '.link-edit-icon', async function () {
      setIsLoading(true);
      const id = $(this).data('id');
      if (!id) { return; }
      try {
        const response = await apiRequest('POST', `/v1/merchant/get-easy-collect-link/${id}`);
        if (response.StatusCode === "1") {
          const record = response.Result;
          setIsLoading(false);
          openLinkGenerationForm(record);
        } else {
          toast.error('Failed to fetch the record for editing');
        }
      } catch (error) {
        console.error('Error fetching record for editing:', error);
        toast.error('An error occurred while fetching the record');
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
  }, [easyCollects]);

  const openLinkGenerationForm = (data) => {
    setEditData(data);
    setIsEditModalOpen(true);
  };

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

  const handleModalClose = async () => {
    setIsEditModalOpen(false);
    const data = await fetchEasyCollectData();
    setEasyCollects(data);
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
          handleModalClose={handleModalClose}
        />
      </div>

      <PaymentTable tableRef={tableRef} title="Easy Collect" />

      {/* QrCode Modal */}
      <QrCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        qrCodeContent={qrCodeContent}
      />

      <LinkGenerationForm
        open={isEditModalOpen}
        onClose={handleModalClose}
        initialData={editData}
      />
    </>
  );
}

export default Page;
