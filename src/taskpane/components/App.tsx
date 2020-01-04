import * as React from "react";
import Header from "./Header";
import Progress from "./Progress";
import Footer from "./Footer";
import { getConfig, ConfigInterface, setConfig } from "../../helpers/addin-config";
import { loadGists } from "../../helpers/utils";
import GistList, { Gist } from "../../helpers/GistList";
import { getGist, buildBodyContent } from "../../helpers/data";
/* global Button, Header, HeroList, HeroListItem, Progress */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  gists: Gist[];
  error: any;
  configured: boolean;
  gistSelected: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      gists: [],
      error: null,
      configured: false,
      gistSelected: false
    };
  }

  config: ConfigInterface;
  settingsDialog: any;

  componentDidMount() {
    this.config = getConfig();
    if (this.config && this.config.gitHubUserName) {
      this.loadGists(this.config.gitHubUserName);
    } else {
    }
  }

  loadGists = user => {
    loadGists(user)
      .then(gists => {
        this.setState({ gists, error: null, configured: true });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onGistSelected = () => {
    this.setState({ gistSelected: true });
  };

  showError = error => {
    this.setState({
      configured: true,
      gists: [],
      error: error
    });
  };

  receiveMessage = (message: Office.NotificationMessageDetails) => {
    this.config = JSON.parse(message.message);
    setConfig(this.config, function() {
      this.settingsDialog.close();
      this.settingsDialog = null;
      loadGists(this.config.gitHubUserName);
    });
  };

  dialogClosed = () => {
    this.settingsDialog = null;
  };

  afterBody = content => {
    if (content) {
      Office.context.mailbox.item.body.setSelectedDataAsync(
        content,
        { coercionType: Office.CoercionType.Html },
        function(result) {
          if (result.status === Office.AsyncResultStatus.Failed) {
            this.showError("Could not insert gist: " + result.error.message);
          }
        }
      );
    }
  };

  onClickInsertButton = () => {
    const gistId = (document.querySelectorAll(".ms-ListItem.is-selected")[0] as HTMLInputElement).value;
    getGist(gistId)
      .then((gist: Gist) => {
        buildBodyContent(gist, (content, error) => {
          if (error) {
            this.showError(error);
            return;
          }
          this.afterBody(content);
        });
      })
      .catch(err => {
        this.showError(err);
      });
  };

  onSettingsClick = () => {
    let url = "https://localhost:3000/dialog.html";
    if (this.config) {
      url = url + "?gitHubUserName=" + this.config.gitHubUserName + "&defaultGistId=" + this.config.defaultGistId;
    }
    const dialogOptions = { width: 20, height: 40, displayInIframe: true };

    Office.context.ui.displayDialogAsync(url, dialogOptions, function(result) {
      this.settingsDialog = result.value;
      this.settingsDialog.addEventHandler(
        // @ts-ignore
        Microsoft.Office.WebExtension.EventType.DialogMessageReceived,
        this.receiveMessage
      );
      this.settingsDialog.addEventHandler(
        // @ts-ignore
        Microsoft.Office.WebExtension.EventType.DialogEventReceived,
        this.dialogClosed
      );
    });
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div className="ms-landing-page__main">
        <section className="ms-landing-page__content ms-font-m ms-fontColor-neutralPrimary">
          {!this.state.configured && <Header />}
          {this.state.gists.length > 0 && (
            <div id="gist-list-container">
              <form>
                <GistList gists={this.state.gists} gistClickFn={this.onGistSelected} />
              </form>
            </div>
          )}
          {this.state.error && (
            <div
              id="error-display"
              className="ms-u-borderBase ms-fontColor-error ms-font-m ms-bgColor-error ms-borderColor-error"
            >
              {this.state.error}
            </div>
          )}
        </section>
        <button
          className="ms-Button ms-Button--primary"
          id="insert-button"
          disabled={!this.state.gistSelected}
          onClick={this.onClickInsertButton}
        >
          <span className="ms-Button-label">Insert</span>
        </button>
        <Footer onSettingsClick={this.onSettingsClick} />
      </div>
    );
  }
}
