import { BiGram } from "./Utils";

export function toStrict(self: SFProject): StrictSFProject {
  return { ...DefaultSFProject, ...self };
}

export function toBigramArray(self: StrictSFProject) {
  return BiGram.createBiGramArrayFromTexts(
    [self.title, self.description, self.owner, ...self.tags],
    " 　"
  );
}

export function toBigramObject(self: StrictSFProject) {
  return BiGram.createBiGramObjectFromTexts(
    [self.title, self.description, self.owner, ...self.tags],
    " 　"
  );
}

export class SFProject {
  title?: string;
  description?: string;
  owner?: string;
  type?: "none" | "youtube" | "drive" | "github" | "gist" | "iframe";
  id?: string;
  thumbnail?: string;
  ratio?: string;
  tags?: string[];
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
  type: "none" | "youtube" | "drive" | "github" | "gist" | "iframe";
  id: string;
  thumbnail: string;
  ratio: string;
  tags: string[];
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
}
