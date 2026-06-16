import Sidebar from "../Sidebar/Sidebar";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />

      <main
        style={{
          marginLeft: "250px",
          padding: "20px"
        }}
      >
        {children}
      </main>
    </>
  );
}