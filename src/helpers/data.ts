import { Gist } from "./GistList";
let showdown = require("showdown");

export function getUserGists(user: string): Promise<Gist[]> {
  var requestUrl = "https://api.github.com/users/" + user + "/gists";

  return fetch(requestUrl).then(res => res.json());
}

export function getGist(gistId: string | number): Promise<Gist> {
  var requestUrl = "https://api.github.com/gists/" + gistId;
  return fetch(requestUrl).then(res => res.json());
}

export function buildBodyContent(gist: Gist, callback: (content: string, error?: string) => void) {
  // Find the first non-truncated file in the gist
  // and use it.
  for (var filename in gist.files) {
    if (gist.files.hasOwnProperty(filename)) {
      var file = gist.files[filename];
      if (!file.truncated) {
        // We have a winner.
        switch (file.language) {
          case "HTML":
            // Insert as-is.
            callback(file.content);
            console.log(file.content);
            break;
          case "Markdown":
            // Convert Markdown to HTML.
            var converter = new showdown.Converter();
            var html = converter.makeHtml(file.content);
            console.log(html);
            callback(html);
            break;
          default:
            // Insert contents as a <code> block.
            var codeBlock = "<pre><code>";
            codeBlock = codeBlock + file.content;
            codeBlock = codeBlock + "</code></pre>";
            callback(codeBlock);
        }
        return;
      }
    }
  }
  callback(null, "No suitable file found in the gist");
}
