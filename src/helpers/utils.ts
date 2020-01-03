import { getUserGists } from "./data";
import { GistFileObj, Gist } from "../settings/components/GistList";

export function loadGists(user: string): Promise<Gist[]> {
  return getUserGists(user);
}

export function sendMessage(message) {
  Office.context.ui.messageParent(message);
}

export function getParameterByName(name: string, url?: string) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  console.log(results);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function buildFileList(files: GistFileObj): string {
  var fileList = "";

  for (var file in files) {
    if (files.hasOwnProperty(file)) {
      if (fileList.length > 0) {
        fileList = fileList + ", ";
      }

      fileList = fileList + files[file].filename + " (" + files[file].language + ")";
    }
  }

  return fileList;
}
