import LeadsList from "./components/LeadsList";

function App() {
  const handleLeadSelect = () => {
    // Handle lead selection if needed
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Mini Seller Console
            </h1>
            <p className="mt-2 text-gray-600">
              Triage leads and convert them into opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div>
              <LeadsList onLeadSelect={handleLeadSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
