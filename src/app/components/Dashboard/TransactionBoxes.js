const TransactionBoxes = ({ txnStatusData, successRate, failureRate }) => {
    const totalTransactions = txnStatusData.reduce((sum, item) => sum + item.total, 0);
    const successTransactions = txnStatusData.filter((item) => item.txn_status === 'success').reduce((sum, item) => sum + item.total, 0);
    const failedTransactions = txnStatusData.filter((item) => item.txn_status === 'failed').reduce((sum, item) => sum + item.total, 0);
    const otherTransactions = txnStatusData.filter((item) => !['success', 'failed'].includes(item.txn_status)).reduce((sum, item) => sum + item.total, 0);
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Total Transactions */}
        <div className="small-box bg-totaltxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Total Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">{totalTransactions}</h3>
            <p className="txn_amount">
              Total Amount: {txnStatusData.reduce((sum, item) => sum + item.total_txn_amount, 0)} /-
            </p>
          </div>
        </div>
  
        {/* Success Transactions */}
        <div className="small-box bg-successtxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Success Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">{successTransactions}</h3>
            <p className="text-center text-sm">Success Rate: {successRate.toFixed(2)}%</p>
            <p className="txn_amount">
              Success Amount: {txnStatusData.filter((item) => item.txn_status === 'success').reduce((sum, item) => sum + item.total_txn_amount, 0)} /-
            </p>
          </div>
        </div>
  
        {/* Failed Transactions */}
        <div className="small-box bg-failedtxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Failed Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">{failedTransactions}</h3>
            <p className="text-center text-sm">Failure Rate: {failureRate.toFixed(2)}%</p>
            <p className="txn_amount">
              Failed Amount: {txnStatusData.filter((item) => item.txn_status === 'failed').reduce((sum, item) => sum + item.total_txn_amount, 0)} /-
            </p>
          </div>
        </div>
  
        {/* Other Transactions */}
        <div className="small-box bg-othertxn fixed-box">
          <div className="inner text-center text-white h-32">
            <h5 className="primary-title font-weight-bold">Other Transactions</h5>
            <h3 className="total-txn text-center text-2xl mt-2">{otherTransactions}</h3>
            <p className="text-center text-sm">Other Rate: {100 - (successRate + failureRate).toFixed(2)}%</p>
            <p className="txn_amount">
              Other Amount: {txnStatusData.filter((item) => !['success', 'failed'].includes(item.txn_status)).reduce((sum, item) => sum + item.total_txn_amount, 0)} /-
            </p>
          </div>
        </div>
      </div>
    );
};
  
export default TransactionBoxes;
  