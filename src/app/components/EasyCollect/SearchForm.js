import { useState } from 'react';
import { Drawer, Button } from 'rsuite';
import DateRangePickerComponent from '../DateRangePickerComponent';
import LinkGenerationForm from './LinkGenerationForm';

function SearchForm({ searchName, searchValue, setSearchName, setSearchValue, handleSearch, resetSearch, onDateRangeChange, handleModalClose }) {
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const onClose = async () => {
    setOpen(false);
    await handleModalClose();
  };

  return (
    <>
      <form id="searchForm" onSubmit={(e) => e.preventDefault()} className="col-md-12">
        <div className="row align-items-center">
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="search">Search By:</label>
              <select
                className="form-control select2"
                name="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="order_id">DP Transaction ID</option>
                <option value="status">Status</option>
                <option value="customer_name">Name</option>
                <option value="customer_phone">Phone</option>
                <option value="customer_email">Email</option>
                <option value="reference_id">Reference Id</option>
              </select>
            </div>
          </div>
          <div className="col-3">
            <label htmlFor="searchValue"></label>
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control searchValue"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <span className="input-group-append">
                <button type="button" className="btn btn-info btn-flat" onClick={handleSearch}>Go!</button>
              </span>
            </div>
          </div>
          <div className="col-1 mt-4">
            <button className="btn btn-danger btn-sm" onClick={resetSearch}>Reset</button>
          </div>

          <div className="col-1 mt-3">
            <DateRangePickerComponent
              onShortcutClick={onDateRangeChange}
              onChange={onDateRangeChange}
            />
          </div>
        </div>

        <button type="button" className="btn btn-info btn-sm mb-3" onClick={handleOpenModal}>
          Create Link
        </button>
      </form>

      <LinkGenerationForm open={open} onClose={onClose} />
    </>
  );
}

export default SearchForm;
