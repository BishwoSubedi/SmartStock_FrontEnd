import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import "./Items.css";

type Section = {
  id: string;
  sectionName: string;
};

type Supplier = {
  id: string;
  supplierName: string;
};

type Item = {
  id: string;
  itemName: string;
  quantity: number;
  price: string;
  threshold: number;
  lowStockEmailSent?: boolean;
  createdAt: string;
  Section?: {
    id: string;
    sectionName: string;
  };
  Supplier?: {
    id: string;
    supplierName: string;
    email?: string;
    phone?: string;
  };
};

function Items() {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [threshold, setThreshold] = useState<number | "">("");
  const [sectionId, setSectionId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [removeStockItemId, setRemoveStockItemId] = useState<string | null>(null);
  const [removedQuantity, setRemovedQuantity] = useState<number | "">("");
  const [removingStock, setRemovingStock] = useState(false);

  const [addStockItemId, setAddStockItemId] = useState<string | null>(null);
  const [addedQuantity, setAddedQuantity] = useState<number | "">("");
  const [addingStock, setAddingStock] = useState(false);

  const fetchItems = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const query = searchValue
        ? `/items/my-items?search=${encodeURIComponent(searchValue)}`
        : "/items/my-items";

      const data = await apiRequest(query);
      setItems(data.items || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load items");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const data = await apiRequest("/sections/my-sections");
      setSections(data.sections || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await apiRequest("/suppliers/my-suppliers");
      setSuppliers(data.suppliers || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSections();
    fetchSuppliers();
  }, []);

  const resetForm = () => {
    setItemName("");
    setQuantity("");
    setPrice("");
    setThreshold("");
    setSectionId("");
    setSupplierId("");
  };

  const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      await apiRequest("/items/create", {
        method: "POST",
        body: JSON.stringify({
          itemName,
          quantity: quantity === "" ? 0 : Number(quantity),
          price: price === "" ? 0 : Number(price),
          threshold: threshold === "" ? 5 : Number(threshold),
          sectionId,
          supplierId,
        }),
      });

      setSuccess("Item created successfully");
      resetForm();
      await fetchItems(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create item");
      }
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchItems(search);
  };

  const handleDeleteItem = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await apiRequest(`/items/delete/${id}`, {
        method: "DELETE",
      });

      setSuccess("Item deleted successfully");
      await fetchItems(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete item");
      }
    }
  };

  const openRemoveStockBox = (id: string) => {
    setRemoveStockItemId(id);
    setAddStockItemId(null);
    setRemovedQuantity("");
    setError("");
    setSuccess("");
  };

  const closeRemoveStockBox = () => {
    setRemoveStockItemId(null);
    setRemovedQuantity("");
  };

  const handleRemoveStock = async (id: string) => {
    try {
      setRemovingStock(true);
      setError("");
      setSuccess("");

      await apiRequest(`/items/remove-stock/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          removedQuantity: removedQuantity === "" ? 0 : Number(removedQuantity),
        }),
      });

      setSuccess("Stock removed successfully");
      closeRemoveStockBox();
      await fetchItems(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to remove stock");
      }
    } finally {
      setRemovingStock(false);
    }
  };

  const openAddStockBox = (id: string) => {
    setAddStockItemId(id);
    setRemoveStockItemId(null);
    setAddedQuantity("");
    setError("");
    setSuccess("");
  };

  const closeAddStockBox = () => {
    setAddStockItemId(null);
    setAddedQuantity("");
  };

  const handleAddStock = async (id: string) => {
    try {
      setAddingStock(true);
      setError("");
      setSuccess("");

      await apiRequest(`/items/add-stock/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          addedQuantity: addedQuantity === "" ? 0 : Number(addedQuantity),
        }),
      });

      setSuccess("Stock added successfully");
      closeAddStockBox();
      await fetchItems(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add stock");
      }
    } finally {
      setAddingStock(false);
    }
  };

  return (
    <div className="items-page">
      <div className="items-header">
        <div>
          <p className="items-tag">Items Management</p>
          <h1>Manage Your Inventory Items</h1>
          <p className="items-subtitle">
            Add, track, search, edit, restock, remove stock, and manage inventory
            items linked to sections and suppliers.
          </p>
        </div>
      </div>

      <div className="items-grid">
        <div className="items-card form-card">
          <h2>Create Item</h2>

          <form onSubmit={handleCreateItem} className="item-form">
            <div className="form-group">
              <label htmlFor="itemName">Item Name</label>
              <input
                type="text"
                id="itemName"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="form-group two-cols">
              <div>
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="threshold">Low Stock Threshold</label>
              <input
                type="number"
                id="threshold"
                placeholder="Enter threshold"
                value={threshold}
                onChange={(e) =>
                  setThreshold(e.target.value === "" ? "" : Number(e.target.value))
                }
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sectionId">Section</label>
              <select
                id="sectionId"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                required
              >
                <option value="">Select section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.sectionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="supplierId">Supplier</label>
              <select
                id="supplierId"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <button type="submit" className="primary-btn">
              Create Item
            </button>
          </form>
        </div>

        <div className="items-card list-card">
          <div className="list-top">
            <h2>All Items</h2>

            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>

          {loading ? (
            <p className="empty-message">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="empty-message">No items found.</p>
          ) : (
            <div className="item-list">
              {items.map((item) => (
                <div key={item.id} className="item-card-row">
                  <div className="item-main">
                    <div className="item-title-row">
                      <h3>{item.itemName}</h3>
                      {item.quantity <= item.threshold && (
                        <span className="low-stock-badge">Low Stock</span>
                      )}
                    </div>

                    <div className="item-meta-grid">
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Price:</strong> £{item.price}
                      </p>
                      <p>
                        <strong>Threshold:</strong> {item.threshold}
                      </p>
                      <p>
                        <strong>Section:</strong> {item.Section?.sectionName || "N/A"}
                      </p>
                      <p>
                        <strong>Supplier:</strong> {item.Supplier?.supplierName || "N/A"}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {removeStockItemId === item.id && (
                      <div className="remove-stock-box">
                        <h4>Remove Stock</h4>
                        <div className="remove-stock-row">
                          <input
                            type="number"
                            min="1"
                            placeholder="Enter removed quantity"
                            value={removedQuantity}
                            onChange={(e) =>
                              setRemovedQuantity(
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                          />
                          <button
                            type="button"
                            className="confirm-remove-btn"
                            onClick={() => handleRemoveStock(item.id)}
                            disabled={removingStock}
                          >
                            {removingStock ? "Removing..." : "Confirm"}
                          </button>
                          <button
                            className="cancel-remove-btn"
                            onClick={closeRemoveStockBox}
                            type="button"
                            disabled={removingStock}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {addStockItemId === item.id && (
                      <div className="add-stock-box">
                        <h4>Add Stock</h4>
                        <div className="add-stock-row">
                          <input
                            type="number"
                            min="1"
                            placeholder="Enter added quantity"
                            value={addedQuantity}
                            onChange={(e) =>
                              setAddedQuantity(
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                          />
                          <button
                            type="button"
                            className="confirm-add-btn"
                            onClick={() => handleAddStock(item.id)}
                            disabled={addingStock}
                          >
                            {addingStock ? "Adding..." : "Confirm"}
                          </button>
                          <button
                            className="cancel-add-btn"
                            onClick={closeAddStockBox}
                            type="button"
                            disabled={addingStock}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      className="add-stock-btn"
                      onClick={() => openAddStockBox(item.id)}
                    >
                      Add Stock
                    </button>

                    <button
                      type="button"
                      className="remove-stock-btn"
                      onClick={() => openRemoveStockBox(item.id)}
                    >
                      Remove Stock
                    </button>

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => navigate(`/items/edit/${item.id}`)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Items;