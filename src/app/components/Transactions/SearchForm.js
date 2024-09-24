function SearchForm({ searchName, searchValue, setSearchName, setSearchValue, handleSearch, resetSearch, dateRangePickerRef }) {
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
                <option value="dp_trans_id">Droompay Transaction ID</option>
                <option value="reference_id">Reference ID</option>
                <option value="customer_id">Customer ID</option>
                <option value="refund_id">Refund ID</option>
                <option value="customer_name">Customer Name</option>
                <option value="customer_email">Customer Email</option>
                <option value="customer_phone">Customer Phone</option>
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
          <div className="col-2 mt-4">
            <button className="btn btn-danger btn-sm"
              onClick={() => {
                resetSearch();
                // Trigger reset in DateRangePickerComponent
                if (dateRangePickerRef.current) {
                  dateRangePickerRef.current.reset();
                }
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    );
  }
  
  export default SearchForm;
  