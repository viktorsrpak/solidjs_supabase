import { Router, Route } from "@solidjs/router";
import Home from "./pages/Home";
import { AuthProvider } from "./components/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
    
    <Router root={Layout}>
      <Route path="/" component={Home} />
    
    </Router>
    
    </AuthProvider>
  );
}


function Layout(props) {
  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      <div className="text-4xl text-neutral-500 uppercase">{appName}</div>
      <div className="min-h-[75vh] w-10/12 mx-auto">{props.children}</div>
      <div className="text-center text-xs">
        Sva prava pridržana {new Date().getFullYear()}.
      </div>
    </div>
  );
}

