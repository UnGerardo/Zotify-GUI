const { createRoot } = require("react-dom/client");

function NavBar() {
  return <h2>NavBar</h2>;
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<NavBar />);