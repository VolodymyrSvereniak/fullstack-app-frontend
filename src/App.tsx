import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/Navbar";
import ModalForm from "./components/ModalForm";
import TableList from "./components/TableList";
import axios from "axios";
import type { Client, Mode } from "./types/types";

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<Mode>("add");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clientData, setClientData] = useState<Client | null>(null);
  const [tableData, setTableData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API = import.meta.env.VITE_API_URL;

  const fetchClients = async (): Promise<void> => {
    try {
      const response = await axios.get<Client[]>(
        API ? `${API}/api/clients` : "http://localhost:3000/api/clients"
      );
      setTableData(response.data);
      setIsLoading(false);
    } catch (err: unknown) {
      console.error(`Error fetching clients: ${err}`);
    }
  };

  useEffect(() => {
    void fetchClients();

    if (tableData.length > 0) {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleOpen = (mode: Mode, client?: Client | null): void => {
    setClientData(client ?? null);
    setModalMode(mode);
    setIsOpen(true);
  };

  const handleSubmit = async (
    newClientData: Omit<Client, "id">
  ): Promise<void> => {
    if (modalMode === "add") {
      try {
        const response = await axios.post<Client>(
          API ? `${API}/api/clients` : "http://localhost:3000/api/clients",
          newClientData
        );
        setTableData((prevData) => [...prevData, response.data]);
      } catch (err: unknown) {
        console.error(`Error adding client: ${err}`);
      }
    } else {
      if (!clientData?.id) {
        console.error("No client selected for update");
        return;
      }
      try {
        const response = await axios.put<Client>(
          API
            ? `${API}/api/clients/${clientData.id}`
            : `http://localhost:3000/api/clients/${clientData.id}`,
          newClientData
        );
        setTableData((prevData) =>
          prevData.map((client) =>
            client.id === clientData.id ? response.data : client
          )
        );
      } catch (err: unknown) {
        console.error(`Error updating client: ${err}`);
      }
    }
  };

  const handleStartLoadingBackend = (): void => {
    setIsLoading(true);
  };

  return (
    <>
      <NavBar onOpen={() => handleOpen("add")} onSearch={setSearchTerm} />
      {tableData.length > 0 ? (
        <TableList
          setTableData={setTableData}
          tableData={tableData}
          handleOpen={handleOpen}
          searchTerm={searchTerm}
        />
      ) : (
        <div className="grid place-items-center gap-5">
          <p>
            The backend is temporarily offline. Please wake it up to load the
            data.
          </p>
          {!isLoading && (
            <a
              className="btn bg-blue-800 hover:bg-blue-700"
              href="https://fullstack-app-backend-7sy6.onrender.com"
              target="_blank"
              onClick={handleStartLoadingBackend}
            >
              Activate backend
            </a>
          )}
          {isLoading && (
            <>
              <p>Please wait...</p>
              <span className="loading loading-spinner loading-lg"></span>
            </>
          )}
        </div>
      )}
      <ModalForm
        isOpen={isOpen}
        OnSubmit={handleSubmit}
        onClose={() => setIsOpen(false)}
        mode={modalMode}
        clientData={clientData}
      />
    </>
  );
}

export default App;
