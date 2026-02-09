import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/SideBar";
import TopBrandBar from "../components/TopBrandBar";
import gems from "../assets/Star 1 1.png";
import ManualGemsModal from "../components/ManualGemsModal";
import { api } from "../api/axios.js";

const rolePill = (role) => {
  if (role === "Admin") return "bg-red-500 text-white";
  if (role === "Btc") return "bg-blue-500 text-white";
  return "bg-green-500 text-white";
};

const statusPill = (status) => {
  if (status === "Active") return "text-green-600";
  return "text-red-500";
};

const defaultAvatar = (name) =>
  `https://ui-avatars.com/api/?background=E5E7EB&color=111827&name=${encodeURIComponent(
    name || "User",
  )}`;

export default function Member_Management() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  // data từ API
  const [members, setMembers] = useState([]);

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // load users
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/v1/users"); // GET all users
        const mapped = (res.data?.users || []).map((u) => {
          const roleStr =
            Array.isArray(u.roles) && u.roles.length > 0
              ? u.roles[0] // lấy role đầu tiên
              : "Member";

          return {
            id: u.id,
            name: u.username,
            email: u.email,
            role: roleStr, // giờ là string
            status: u.is_active ? "Active" : "Deactive",
            gems: Number(u.total_gems || 0),
            joined: Number(u.regular_session_count || 0),
            avatar: u.avatar || defaultAvatar(u.username),
          };
        });
        setMembers(mapped);
      } catch (e) {
        console.log("Load users error:", e);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.status.toLowerCase().includes(q),
    );
  }, [query, members]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleAdjusted = ({ userId, newTotalGems }) => {
    if (typeof newTotalGems !== "number") return;
    setMembers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, gems: newTotalGems } : u)),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <TopBrandBar />

        <main className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Member Management
              </h1>
              <div className="mt-2 flex gap-1">
                <span className="w-10 h-1 bg-red-500 rounded" />
                <span className="w-6 h-1 bg-blue-500 rounded" />
                <span className="w-8 h-1 bg-green-500 rounded" />
              </div>
            </div>

            <button className="px-5 py-3 rounded-full bg-blue-600 text-white font-medium flex items-center gap-2 shadow-sm hover:bg-blue-700">
              <span className="text-xl leading-none">+</span>
              Invite a new member
            </button>
          </div>

          <section className="mt-8 bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="text-green-600 font-semibold">Dashboard</div>

              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search member"
                  className="w-[260px] pl-10 pr-3 py-2 rounded-full border bg-white outline-none focus:ring-2 focus:ring-blue-200"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="text-left text-[#1A2A56] border-b">
                    <th className="py-3 font-semibold">Member</th>
                    <th className="py-3 font-semibold text-center">Role</th>
                    <th className="py-3 font-semibold text-center">Status</th>
                    <th className="py-3 font-semibold text-center">Gems</th>
                    <th className="py-3 font-semibold text-center">
                      Activities joined
                    </th>
                    <th className="py-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((m) => (
                    <tr key={m.id} className="border-b last:border-b-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="leading-tight">
                            <div className="font-semibold text-gray-800">
                              {m.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {m.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-center">
                        <span
                          className={[
                            "inline-flex px-10 py-1.5 rounded-full text-xs font-semibold",
                            rolePill(m.role),
                          ].join(" ")}
                        >
                          {m.role}
                        </span>
                      </td>

                      <td className="py-4 text-center">
                        <span
                          className={["font-medium", statusPill(m.status)].join(
                            " ",
                          )}
                        >
                          {m.status}
                        </span>
                      </td>

                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2 font-semibold text-gray-800">
                          {m.gems}
                          <img src={gems} alt="" className="w-9" />
                        </div>
                      </td>

                      <td className="py-4 text-gray-800 font-medium text-center">
                        {m.joined}
                      </td>

                      <td className="py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedUser(m);
                            setOpenModal(true);
                          }}
                          className="px-4 py-2 rounded-full bg-amber-400 text-white font-semibold text-sm hover:bg-amber-500"
                        >
                          Manual gems
                        </button>
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                className="w-8 h-8 rounded border bg-white hover:bg-gray-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="prev"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={[
                    "w-8 h-8 rounded border",
                    p === safePage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-50",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}

              <button
                className="w-8 h-8 rounded border bg-white hover:bg-gray-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="next"
              >
                ›
              </button>
            </div>
          </section>
        </main>
      </div>

      <ManualGemsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        user={selectedUser}
        onAdjusted={handleAdjusted}
      />
    </div>
  );
}
