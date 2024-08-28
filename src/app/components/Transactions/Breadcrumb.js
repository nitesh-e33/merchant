function Breadcrumb() {
    return (
      <ol className="breadcrumb float-sm-right">
        <li className="breadcrumb-item"><a href="/">Home</a></li>
        <li className="breadcrumb-item active"><a href="/dashboard">Dashboard</a></li>
        <li className="breadcrumb-item active">Transaction List</li>
      </ol>
    );
  }
  
  export default Breadcrumb;
  