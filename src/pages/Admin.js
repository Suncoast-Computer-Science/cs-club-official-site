import Header from "../components/Header";
import AddCompetitionPanel from "../components/AddCompetitionPanel";
const Admin = () => {
  return (
    <>
      <Header />
      <div className="container-fluid bg-light text-dark p-2">
        <div className="container bg-light p-4">
          <h1 className="display-4">Admin Panel</h1>
          <h4>Make, edit, and see results for your competitions</h4>
        </div>
      </div>
      <div className="container">
        <AddCompetitionPanel />
      </div>
    </>
  );
};

export default Admin;
