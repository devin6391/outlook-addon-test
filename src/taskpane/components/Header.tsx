import * as React from "react";

export interface HeaderProps {}

export default class Header extends React.Component<HeaderProps> {
  render() {
    return (
      <div id="not-configured">
        <div className="centered ms-font-xxl ms-u-textAlignCenter">Welcome!</div>
        <div className="ms-font-xl" id="settings-prompt">
          Please choose the <strong>Settings</strong> icon at the bottom of this window to configure this add-in.
        </div>
      </div>
    );
  }
}
