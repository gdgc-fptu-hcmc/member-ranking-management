import gdg_on_campus from "../assets/gdg-on-campus.png";

function Sidebar() {
  const items = [
    { label: "Home", icon: "home", color: "#4285F4" },
    { label: "Rankings", icon: "leaderboard", color: "#F7AB1A" },
    { label: "Activities", icon: "event", color: "#1A2A56" },
    { label: "Check-ins", icon: "fact_check", color: "#EA4435" },
    {
      label: "Manage",
      icon: "manage_accounts",
      color: "#36A852",
    },
    { label: "Assistant", icon: "auto_awesome", color: "#4285F4" },
  ];
  return (
    <aside className="w-[86px] bg-white border-r min-h-screen flex flex-col items-center py-5 gap-10">
      {/* Logo */}
      <div className="w-16 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
        <img src={gdg_on_campus} alt="GDG" className="h-8 object-contain" />
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-5 w-full items-center">
        {items.map((it) => (
          <button
            key={it.label}
            className="w-full flex flex-col items-center gap-2 text-xs transition"
            style={{ color: it.active ? it.color : undefined }}
            onMouseEnter={(e) => (e.currentTarget.style.color = it.color)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = it.active ? it.color : "#6b7280")
            }
          >
            <span className="material-symbols-rounded text-[22px]">
              {it.icon}
            </span>

            <span className="select-none">{it.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto pb-2 w-full flex flex-col items-center">
        <button className="text-red-500 text-xs flex flex-col items-center gap-2 hover:text-red-600">
          <span className="w-11 h-11 rounded-2xl flex items-center justify-center bg-red-50">
            <span className="material-symbols-rounded text-[22px]">logout</span>
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
