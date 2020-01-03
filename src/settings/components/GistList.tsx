import * as React from "react";
import { buildFileList } from "../../helpers/utils";

export interface GistFileObj {
  [key: string]: GistFile;
}

export interface GistFile {
  filename: string;
  language: string;
  truncated: boolean;
  content: string;
}

export interface Gist {
  updated_at: string;
  id: number | string;
  description: string;
  files: GistFileObj;
}

export interface GistListProps {
  gists: Gist[];
  gistClickFn: () => void;
}

export default function GistList(props: GistListProps) {
  const { gists, gistClickFn } = props;

  const onListItemClick = (gistId: number | string) => {
    const allListItems = document.getElementsByClassName("ms-ListItem");
    [].slice.call(allListItems).forEach((listItemInput: HTMLInputElement) => {
      listItemInput.classList.remove("is-selected");
      listItemInput.removeAttribute("checked");
      if (listItemInput.value === gistId) {
        listItemInput.classList.add("is-selected");
        listItemInput.setAttribute("checked", "checked");
      }
      gistClickFn();
    });
  };

  return (
    <div id="gist-list">
      {gists.map(gist => (
        <GistListItem key={gist.id} gist={gist} gistClickFn={onListItemClick} />
      ))}
    </div>
  );
}

export interface GistListItemProps {
  gist: Gist;
  gistClickFn: (gistId: number | string) => void;
}

export function GistListItem(props: GistListItemProps) {
  const { gist, gistClickFn } = props;
  const updated = new Date(gist.updated_at);

  return (
    <div onClick={() => gistClickFn(gist.id)}>
      <input className="ms-ListItem is-selectable" type="radio" name="gists" defaultValue={"" + gist.id} />
      <span className="ms-ListItem-primaryText">{gist.description}</span>
      <span className="ms-ListItem-secondaryText">{buildFileList(gist.files)}</span>
      <span className="ms-ListItem-tertiaryText">{" - Last updated " + updated.toLocaleString()}</span>
    </div>
  );
}
