function Navbar() {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">

      <input
        type="text"
        placeholder="Search tasks..."
        className="border rounded px-3 py-1"
      />

      <div>
        👤
      </div>

    </div>
  );
}

export default Navbar;