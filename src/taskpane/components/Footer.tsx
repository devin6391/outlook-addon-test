import * as React from "react";

export interface FooterProps {
  onSettingsClick: () => void;
}

export default function Footer(props: FooterProps) {
  return (
    <footer className="ms-landing-page__footer ms-bgColor-themePrimary">
      <div className="ms-landing-page__footer--left">
        <img src="../../assets/logo-filled.png" />
        <h1 className="ms-font-xl ms-fontWeight-semilight ms-fontColor-white">Git the gist</h1>
      </div>
      <div
        id="settings-icon"
        className="ms-landing-page__footer--right"
        aria-label="Settings"
        onClick={props.onSettingsClick}
      >
        <i className="ms-Icon enlarge ms-Icon--Settings ms-fontColor-white"></i>
      </div>
    </footer>
  );
}
