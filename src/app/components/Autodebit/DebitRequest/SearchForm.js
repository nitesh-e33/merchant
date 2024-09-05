import DateRangePickerComponent from '../../DateRangePickerComponent';
function SearchForm({ searchName, searchValue, setSearchName, setSearchValue, handleSearch, resetSearch, onDateRangeChange }) {
  return (
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
              <option value="customer_authentication_id">Customer Authentication ID</option>
              <option value="first_name">First Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="txnid">Order ID</option>
              <option value="status">Status</option>
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
    </form>
  );
}
  
export default SearchForm;
  