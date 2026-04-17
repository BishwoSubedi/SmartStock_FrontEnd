import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import "./Sections.css";

type Section = {
  id: string;
  sectionName: string;
  description: string;
  createdAt: string;
};

function Sections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionName, setSectionName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionName, setEditSectionName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchSections = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const query = searchValue
        ? `/sections/my-sections?search=${encodeURIComponent(searchValue)}`
        : "/sections/my-sections";

      const data = await apiRequest(query);
      setSections(data.sections || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load sections");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleCreateSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      await apiRequest("/sections/create", {
        method: "POST",
        body: JSON.stringify({
          sectionName,
          description,
        }),
      });

      setSuccess("Section created successfully");
      setSectionName("");
      setDescription("");
      await fetchSections(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create section");
      }
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSections(search);
  };

  const startEditing = (section: Section) => {
    setEditingSectionId(section.id);
    setEditSectionName(section.sectionName);
    setEditDescription(section.description || "");
    setError("");
    setSuccess("");
  };

  const cancelEditing = () => {
    setEditingSectionId(null);
    setEditSectionName("");
    setEditDescription("");
  };

  const handleUpdateSection = async (id: string) => {
    try {
      setError("");
      setSuccess("");

      await apiRequest(`/sections/update/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          sectionName: editSectionName,
          description: editDescription,
        }),
      });

      setSuccess("Section updated successfully");
      cancelEditing();
      await fetchSections(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update section");
      }
    }
  };

  const handleDeleteSection = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this section?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await apiRequest(`/sections/delete/${id}`, {
        method: "DELETE",
      });

      setSuccess("Section deleted successfully");
      await fetchSections(search);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete section");
      }
    }
  };

  return (
    <div className="sections-page">
      <div className="sections-header">
        <div>
          <p className="sections-tag">Sections Management</p>
          <h1>Manage Your Sections</h1>
          <p className="sections-subtitle">
            Create, search, update, and organize inventory sections for your
            business.
          </p>
        </div>
      </div>

      <div className="sections-grid">
        <div className="sections-card form-card">
          <h2>Create Section</h2>

          <form onSubmit={handleCreateSection} className="section-form">
            <div className="form-group">
              <label htmlFor="sectionName">Section Name</label>
              <input
                type="text"
                id="sectionName"
                placeholder="Enter section name"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Enter section description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <button type="submit" className="primary-btn">
              Create Section
            </button>
          </form>
        </div>

        <div className="sections-card list-card">
          <div className="list-top">
            <h2>All Sections</h2>

            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search sections..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>

          {loading ? (
            <p className="empty-message">Loading sections...</p>
          ) : sections.length === 0 ? (
            <p className="empty-message">No sections found.</p>
          ) : (
            <div className="section-list">
              {sections.map((section) => (
                <div key={section.id} className="section-item">
                  {editingSectionId === section.id ? (
                    <div className="edit-section-box">
                      <input
                        type="text"
                        value={editSectionName}
                        onChange={(e) => setEditSectionName(e.target.value)}
                        className="edit-input"
                      />

                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="edit-input"
                      />

                      <div className="section-actions">
                        <button
                          type="button"
                          className="save-btn"
                          onClick={() => handleUpdateSection(section.id)}
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
                      <div className="section-content">
                        <h3>{section.sectionName}</h3>
                        <p>{section.description || "No description provided."}</p>
                        <span className="section-date">
                          {new Date(section.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="section-actions">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => startEditing(section)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDeleteSection(section.id)}
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

export default Sections;