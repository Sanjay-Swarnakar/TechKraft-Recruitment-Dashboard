import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const ITEMS_PER_PAGE = 5;

  // ---------------- FETCH ----------------
  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/candidates/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCandidates(data);
    } catch {
      toast.error("Failed to load");
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchData();
  }, []);

  // ---------------- INPUT ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- OPEN ADD ----------------
  const openAdd = () => {
    setForm({ name: "", email: "", phone: "", skills: "", experience: "" });
    setEditId(null);
    setShowModal(true);
  };

  // ---------------- OPEN EDIT ----------------
  const openEdit = (c) => {
    setForm(c);
    setEditId(c.id);
    setShowModal(true);
  };

  // ---------------- SAVE (ADD / EDIT) ----------------
  const handleSave = async () => {
    try {
      const url = editId
        ? `http://127.0.0.1:8000/candidates/${editId}`
        : "http://127.0.0.1:8000/candidates/";

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          experience: Number(form.experience),
        }),
      });

      if (res.ok) {
        toast.success(editId ? "Updated" : "Added");
        setShowModal(false);
        fetchData();
      } else {
        toast.error("Failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;

    await fetch(`http://127.0.0.1:8000/candidates/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Deleted");
    fetchData();
  };

  // ---------------- SEARCH ----------------
  const filtered = candidates.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- PAGINATION ----------------
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h1 className="text-xl font-bold mb-8">ATS SaaS</h1>

        <ul className="space-y-4 text-gray-700">
          <li className="font-semibold">Dashboard</li>
          <li>Candidates</li>
          <li
            className="cursor-pointer text-red-500"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>

          <div className="flex gap-3">
            <input
              placeholder="Search..."
              className="border px-3 py-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={openAdd}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              + Add
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            Total: {candidates.length}
          </div>
          <div className="bg-white p-4 rounded shadow">
            Active: {candidates.length}
          </div>
          <div className="bg-white p-4 rounded shadow text-green-600">
            System Live
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th>ID</th><th>Name</th><th>Email</th>
                <th>Phone</th><th>Skills</th><th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((c) => (
                <tr key={c.id} className="border-t">
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.skills}</td>

                  <td className="space-x-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border ${page === i + 1 ? "bg-purple-600 text-white" : ""
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 w-96 rounded">

            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit" : "Add"} Candidate
            </h2>

            {Object.keys(form).map((key) => (
              <input
                key={key}
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={key}
                className="w-full border p-2 mb-2"
              />
            ))}

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-purple-600 text-white px-3 py-1"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}