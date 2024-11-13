// Admin: Update order status
const AdminOrderUpdate = ({ orderId }) => {
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
  
    const handleStatusChange = async () => {
      try {
        await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status });
        setMessage('Order status updated successfully');
      } catch (error) {
        setMessage('Error updating status');
      }
    };
  
    return (
      <div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={handleStatusChange}>Update Status</button>
        {message && <p>{message}</p>}
      </div>
    );
  };
  