import { getGist, buildBodyContent } from "../helpers/data";
import { ConfigInterface, getConfig, setConfig } from "../helpers/addin-config";
import { Gist } from "../helpers/GistList";

// const URI = require("urijs");

/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global global, Office, self, window */

var config: ConfigInterface;
var btnEvent;
var settingsDialog;

Office.onReady(() => {
  // If needed, Office.js is ready to be called
});

function afterBody(content, event) {
  if (content) {
    Office.context.mailbox.item.body.setSelectedDataAsync(
      content,
      { coercionType: Office.CoercionType.Html },
      function() {
        event.completed();
      }
    );
  }
}

function insertDefaultGist(event) {
  config = getConfig();

  // Check if the add-in has been configured.
  if (config && config.defaultGistId) {
    // Get the default gist content and insert.
    getGist(config.defaultGistId)
      .then((gist: Gist) => {
        buildBodyContent(gist, (content, error) => {
          if (error) {
            showError(error);
            event.completed();
            return;
          }
          afterBody(content, event);
        });
      })
      .catch(err => {
        showError(err);
        event.completed();
      });
  } else {
    // Save the event object so we can finish up later.
    btnEvent = event;
    // Not configured yet, display settings dialog with
    // warn=1 to display warning.
    var url = "https://localhost:3000/dialog.html?warn=1";
    var dialogOptions = { width: 20, height: 40, displayInIframe: true };

    Office.context.ui.displayDialogAsync(url, dialogOptions, function(result) {
      settingsDialog = result.value;
      // @ts-ignore
      settingsDialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, receiveMessage);
      // @ts-ignore
      settingsDialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, dialogClosed);
    });
  }
}

function showError(error: string) {
  Office.context.mailbox.item.notificationMessages.replaceAsync(
    "github-error",
    {
      type: "errorMessage",
      message: error
    },
    function() {}
  );
}

function receiveMessage(message: Office.NotificationMessageDetails) {
  config = JSON.parse(message.message);
  setConfig(config, function() {
    settingsDialog.close();
    settingsDialog = null;
    btnEvent.completed();
    btnEvent = null;
  });
}

function dialogClosed() {
  settingsDialog = null;
  btnEvent.completed();
  btnEvent = null;
}

function getGlobal() {
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : undefined;
}

const g = getGlobal() as any;

// the add-in command functions need to be available in global scope
g.insertDefaultGist = insertDefaultGist;
