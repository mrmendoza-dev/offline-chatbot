
import React from "react";
import Main from "./Main";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
export const ApplicationShellContext = React.createContext<any>(null);

function ApplicationShell() {
  const apps: any = [];

  return (
    <ApplicationShellContext.Provider
      value={{
        apps,
      }}
    >
      <div className="ApplicationShell w-screen h-screen">
        <div className="antialiased bg-gray-50 dark:bg-gray-900 h-full">
          <Nav />
          <Sidebar />
          <Main />
        </div>
      </div>
    </ApplicationShellContext.Provider>
  );
}

export default ApplicationShell;
