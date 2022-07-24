import { getName } from "domutils";
import { BiGram } from "./Utils";

export function toStrictProject(self: SFProject): StrictSFProject {
  return { ...DefaultSFProject, ...self };
}

export function projectToBigramArray(self: SFProject) {
  let texts: string[] = [];
  for (const prop of ["title", "description", "owner"]) {
    if (self[prop]) texts.push(self[prop]);
  }
  if (self.tags) texts = texts.concat(self.tags);
  return BiGram.createBiGramArrayFromTexts(texts, " 　");
}

export function projectToBigramObject(self: SFProject) {
  let texts: string[] = [];
  for (const prop of ["title", "description", "owner"]) {
    if (self[prop]) texts.push(self[prop]);
  }
  if (self.tags) texts = texts.concat(self.tags);
  return BiGram.createBiGramObjectFromTexts(texts, " 　");
}

export class SFProject {
  title?: string;
  description?: string;
  owner?: string;
  type?:
    | "none"
    | "youtube"
    | "drive"
    | "drive-raw"
    | "github"
    | "gist"
    | "iframe";
  id?: string;
  thumbnail?: string;
  ratio?: string;
  tags?: string[];
  pid?: string;
  static toString(self: SFProject) {
    return encodeURIComponent(JSON.stringify(self));
  }
  static fromString(self: string) {
    return JSON.parse(decodeURIComponent(self));
  }
}

export class StrictSFProject {}

export interface StrictSFProject extends SFProject {
  title: string;
  description: string;
  owner: string;
  type:
    | "none"
    | "youtube"
    | "drive"
    | "drive-raw"
    | "github"
    | "gist"
    | "iframe";
  id: string;
  thumbnail: string;
  ratio: string;
  tags: string[];
  pid: string;
}

export class DefaultSFProject {
  static title = "No title";
  static description = "";
  static owner = "No Owner";
  static type: "none" = "none";
  static id = "";
  static thumbnail = "";
  static ratio = "";
  static tags = [];
  static pid = "";
}

export class Owner {
  name: string;
  description: string;
  parent: string | null;
}
