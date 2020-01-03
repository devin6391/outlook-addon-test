import * as React from "react";
import { getParameterByName, loadGists } from "../../helpers/utils";
import GistList, { Gist } from "./GistList";
import debounce from "lodash-es/debounce";

export interface AppProps {}

export interface AppState {
  gists: Gist[];
  error: any;
  warn: any;
  user: any;
  gistId: number | string;
  gistSelected: boolean;
}

function sendMessage(message) {
  Office.context.ui.messageParent(message);
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      gists: [],
      error: null,
      warn: null,
      user: null,
      gistId: 0,
      gistSelected: false
    };
  }

  userInputRef: React.RefObject<HTMLInputElement> = React.createRef();

  onGistSelected = () => {
    this.setState({ gistSelected: true });
  };

  onGithubUserChange = () => {
    console.log("debounced fn called");
    this.setState({ gists: [] });
    const ghUser = this.userInputRef.current.value;
    if (ghUser.length > 0) {
      this.loadGists(ghUser);
    }
  };

  onGithubUserChangeDebounced = debounce(this.onGithubUserChange, 100);

  onDoneClick = () => {
    const settings = {
      gitHubUserName: "",
      defaultGistId: ""
    };

    settings.gitHubUserName = this.userInputRef.current.value;
    var selectedGist = document.querySelectorAll(".ms-ListItem.is-selected");
    if (selectedGist.length) {
      settings.defaultGistId = (selectedGist[0] as HTMLInputElement).value;
      sendMessage(JSON.stringify(settings));
    }
  };

  loadGists = user => {
    loadGists(user)
      .then(gists => {
        this.setState({ gists });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  componentDidMount() {
    const warn = getParameterByName("warn");
    if (warn) {
      this.setState({ warn });
    } else {
      const user = getParameterByName("devin6391");
      const gistId = getParameterByName("defaultGistId");
      this.setState({ user, gistId });
      this.loadGists(user);
    }
  }

  render() {
    return (
      <div className="ms-font-m ms-fontColor-neutralPrimary">
        {!this.state.gistSelected && (
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
        )}
        <div className="ms-font-xxl">Settings</div>
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-TextField">
              <label className="ms-Label">GitHub Username</label>
              <input
                className="ms-TextField-field"
                id="github-user"
                type="text"
                defaultValue=""
                placeholder="Please enter your GitHub username"
                onChange={this.onGithubUserChangeDebounced}
                ref={this.userInputRef}
              />
            </div>
          </div>

          {this.state.error ? (
            <div className="error-display ms-Grid-row">
              <div className="ms-font-l ms-fontWeight-semibold">An error occurred:</div>
              <pre>
                <code id="error-text">{JSON.stringify(this.state.error, null, 2)}</code>
              </pre>
            </div>
          ) : (
            <div className="gist-list-container ms-Grid-row">
              <div className="list-title ms-font-xl ms-fontWeight-regular">Choose Default Gist</div>
              <form>
                <GistList gists={this.state.gists} gistClickFn={this.onGistSelected} />
              </form>
            </div>
          )}
        </div>
        <div className="ms-Dialog-actions">
          <div className="ms-Dialog-actionsRight">
            <button
              className="ms-Dialog-action ms-Button ms-Button--primary"
              id="settings-done"
              disabled={!this.state.gistSelected}
              onClick={this.onDoneClick}
            >
              <span className="ms-Button-label">Done</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
