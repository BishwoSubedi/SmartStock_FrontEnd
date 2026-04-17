import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import "./Supplier.css";

type Supplier = {
  id: string;
  supplierName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierName, setSupplierName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [editSupplierName, setEditSupplierName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const fetchSuppliers = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const query = searchValue
        ? `/suppliers/my-suppliers?search=${encodeURIComponent(searchValue)}`
        : "/suppliers/my-suppliers";

      const data = await apiRequest(query);
      setSuppliers(data.suppliers || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load suppliers");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const resetCreateForm = () => {
    setSupplierName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  const handleCreateSupplier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      await apiRequest("/suppliers/create", {
        method: "POST",
        body: JSON.stringify({
          supplierName,
          email,
          phone,
          address,
        }),
      });

      setSuccess("Supplier created successfully");
      resetCreateForm();
      await fetchSuppliers(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create supplier");
      }
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSuppliers(search);
  };

  const startEditing = (supplier: Supplier) => {
    setEditingSupplierId(supplier.id);
    setEditSupplierName(supplier.supplierName || "");
    setEditEmail(supplier.email || "");
    setEditPhone(supplier.phone || "");
    setEditAddress(supplier.address || "");
    setError("");
    setSuccess("");
  };

  const cancelEditing = () => {
    setEditingSupplierId(null);
    setEditSupplierName("");
    setEditEmail("");
    setEditPhone("");
    setEditAddress("");
  };

  const handleUpdateSupplier = async (id: string) => {
    try {
      setError("");
      setSuccess("");

      await apiRequest(`/suppliers/update/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          supplierName: editSupplierName,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
        }),
      });

      setSuccess("Supplier updated successfully");
      cancelEditing();
      await fetchSuppliers(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update supplier");
      }
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await apiRequest(`/suppliers/delete/${id}`, {
        method: "DELETE",
      });

      setSuccess("Supplier deleted successfully");
      await fetchSuppliers(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete supplier");
      }
    }
  };

  return (
    <div className="suppliers-page">
      <div className="suppliers-header">
        <div>
          <p className="suppliers-tag">Suppliers Management</p>
          <h1>Manage Your Suppliers</h1>
          <p className="suppliers-subtitle">
            Create, search, update, and organize supplier information for your business.
          </p>
        </div>
      </div>

      <div className="suppliers-grid">
        <div className="suppliers-card form-card">
          <h2>Create Supplier</h2>

          <form onSubmit={handleCreateSupplier} className="supplier-form">
            <div className="form-group">
              <label htmlFor="supplierName">Supplier Name</label>
              <input
                type="text"
                id="supplierName"
                placeholder="Enter supplier name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="supplierEmail">Email</label>
              <input
                type="email"
                id="supplierEmail"
                placeholder="Enter supplier email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="supplierPhone">Phone</label>
              <input
                type="text"
                id="supplierPhone"
                placeholder="Enter supplier phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="supplierAddress">Address</label>
              <textarea
                id="supplierAddress"
                placeholder="Enter supplier address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
              />
            </div>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <button type="submit" className="primary-btn">
              Create Supplier
            </button>
          </form>
        </div>

        <div className="suppliers-card list-card">
          <div className="list-top">
            <h2>All Suppliers</h2>

            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>

          {loading ? (
            <p className="empty-message">Loading suppliers...</p>
          ) : suppliers.length === 0 ? (
            <p className="empty-message">No suppliers found.</p>
          ) : (
            <div className="supplier-list">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="supplier-item">
                  {editingSupplierId === supplier.id ? (
                    <div className="edit-supplier-box">
                      <input
                        type="text"
                        value={editSupplierName}
                        onChange={(e) => setEditSupplierName(e.target.value)}
                        className="edit-input"
                        placeholder="Supplier name"
                      />

                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="edit-input"
                        placeholder="Email"
                      />

                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="edit-input"
                        placeholder="Phone"
                      />

                      <textarea
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        rows={3}
                        className="edit-input"
                        placeholder="Address"
                      />

                      <div className="supplier-actions">
                        <button
                          type="button"
                          className="save-btn"
                          onClick={() => handleUpdateSupplier(supplier.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="supplier-content">
                        <h3>{supplier.supplierName}</h3>
                        <p><strong>Email:</strong> {supplier.email || "N/A"}</p>
                        <p><strong>Phone:</strong> {supplier.phone || "N/A"}</p>
                        <p><strong>Address:</strong> {supplier.address || "N/A"}</p>
                        <span className="supplier-date">
                          {new Date(supplier.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="supplier-actions">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => startEditing(supplier)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDeleteSupplier(supplier.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Suppliers;