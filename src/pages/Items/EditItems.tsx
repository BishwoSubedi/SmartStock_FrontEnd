import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import "./EditItem.css";

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
  price: string | number;
  threshold: number;
  sectionId?: string;
  supplierId?: string;
  Section?: {
    id: string;
    sectionName: string;
  };
  Supplier?: {
    id: string;
    supplierName: string;
  };
};

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sections, setSections] = useState<Section[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    price: "",
    threshold: "",
    sectionId: "",
    supplierId: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchItem = async () => {
    if (!id) {
      setError("Invalid item id");
      return;
    }

    try {
      const data = await apiRequest("/items/my-items");
      const currentItem: Item | undefined = data.items?.find(
        (item: Item) => item.id === id
      );

      if (!currentItem) {
        setError("Item not found");
        return;
      }

      setFormData({
        itemName: currentItem.itemName || "",
        quantity: String(currentItem.quantity ?? ""),
        price: String(currentItem.price ?? ""),
        threshold: String(currentItem.threshold ?? ""),
        sectionId: currentItem.sectionId || currentItem.Section?.id || "",
        supplierId: currentItem.supplierId || currentItem.Supplier?.id || "",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load item");
      }
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
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([fetchSections(), fetchSuppliers(), fetchItem()]);

      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleUpdateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      setError("Invalid item id");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await apiRequest(`/items/update/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          itemName: formData.itemName,
          quantity: Number(formData.quantity),
          price: Number(formData.price),
          threshold: Number(formData.threshold),
          sectionId: formData.sectionId,
          supplierId: formData.supplierId,
        }),
      });

      setSuccess("Item updated successfully");

      setTimeout(() => {
        navigate("/items");
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update item");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="edit-item-message">Loading item details...</p>;
  }

  return (
    <div className="edit-item-page">
      <div className="edit-item-header">
        <div>
          <p className="edit-item-tag">Edit Inventory Item</p>
          <h1>Update Item Details</h1>
          <p className="edit-item-subtitle">
            Modify item information, quantity, pricing, supplier, and section.
          </p>
        </div>

        <Link to="/items" className="back-link-btn">
          ← Back to Items
        </Link>
      </div>

      <div className="edit-item-card">
        <form onSubmit={handleUpdateItem} className="edit-item-form">
          <div className="edit-form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              type="text"
              id="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="edit-grid-two">
            <div className="edit-form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                required
              />
            </div>

            <div className="edit-form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="edit-form-group">
            <label htmlFor="threshold">Low Stock Threshold</label>
            <input
              type="number"
              id="threshold"
              value={formData.threshold}
              onChange={handleChange}
              placeholder="Enter threshold"
              min="0"
              required
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="sectionId">Section</label>
            <select
              id="sectionId"
              value={formData.sectionId}
              onChange={handleChange}
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

          <div className="edit-form-group">
            <label htmlFor="supplierId">Supplier</label>
            <select
              id="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
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

          {error && <p className="edit-form-error">{error}</p>}
          {success && <p className="edit-form-success">{success}</p>}

          <button type="submit" className="update-item-btn" disabled={submitting}>
            {submitting ? "Updating..." : "Update Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;