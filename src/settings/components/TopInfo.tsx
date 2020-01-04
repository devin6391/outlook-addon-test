import * as React from "react";

export default function TopInfo() {
  return (
    <div className="not-configured-warning ms-MessageBar ms-MessageBar--warning">
      <div className="ms-MessageBar-content">
        <div className="ms-MessageBar-icon">
          <i className="ms-Icon ms-Icon--Info"></i>
        </div>
        <div className="ms-MessageBar-text">
          {"Oops! It looks like you haven't configured <strong>Git the gist</strong> yet."}
          <br />
          Please configure your GitHub username and select a default gist, then try that action again!
        </div>
      </div>
    </div>
  );
}
