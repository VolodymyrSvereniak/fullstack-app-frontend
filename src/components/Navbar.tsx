interface NavbarProps {
  onOpen: () => void;
  onSearch: (value: string) => void;
}

export default function NavBar({ onOpen, onSearch }: NavbarProps) {
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onSearch(event.target.value);
  };

  return (
    <>
      <div className="navbar bg-base-100 p-4">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">Clients</a>
        </div>
        <div className="navbar-center">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearchChange}
              className="input input-bordered w-48 md:w-auto"
            />
          </div>
        </div>
        <div className="navbar-end">
          <button className="btn btn-primary" onClick={onOpen}>
            Add Client
          </button>
        </div>
      </div>
    </>
  );
}
