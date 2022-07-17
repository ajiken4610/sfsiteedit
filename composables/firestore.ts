import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
} from "@firebase/firestore";
import routeGlobal from "~~/middleware/route.global";
import { Owner, SFProject } from "./SFProject";

export class SFProjectData {
  project: SFProject;
  uid: string;
}

export const setProject = async (id: string | null, project: SFProject) => {
  const firestore = useFirestore();
  const setInto = id
    ? doc(firestore, "draft", id)
    : doc(collection(firestore, "draft"));
  const set = {
    project: { ...{ pid: setInto.id }, ...project },
    uid: useUser().uid,
  };
  try {
    await setDoc(setInto, set);
    showToast({ title: "保存完了", body: "企画は正常に保存されました。" });
  } catch (e) {
    console.error(e);
    showToast({
      title: "エラー",
      body: "企画データの保存に失敗しました。",
    });
  }
  return setInto.id;
};

export const submitProject = async (id: string | null, project: SFProject) => {
  const firestore = useFirestore();
  const setInto = id
    ? doc(firestore, "project", id)
    : doc(collection(firestore, "project"));
  const set = {
    project,
    uid: useUser().uid,
  };
  try {
    await setDoc(setInto, set);
    showToast({ title: "提出完了", body: "企画は正常に提出されました。" });
  } catch (e) {
    console.error(e);
    showToast({
      title: "エラー",
      body: "企画データの提出に失敗しました。",
    });
  }
  return setInto.id;
};

const ownerDoc = doc(useFirestore(), "owner", "root");

export const newOwner = async () => {
  const id = Math.random().toString().substring(2);
  const data = {};
  data[id] = {};
  try {
    await setDoc(ownerDoc, data, { merge: true });
  } catch (e) {
    console.error(e);
    showToast({
      title: "エラー",
      body: "新しい所属の作成に失敗しました。",
    });
  }
  return id;
};

export const setOwner = async (id: string, saveData: Owner) => {
  const data = {};
  if (!id) id = Math.random().toString().substring(2);
  data[id] = { ...saveData, edited: arrayUnion(useUser().email) };
  try {
    await setDoc(ownerDoc, data, { merge: true });
    showToast({
      title: "保存完了",
      body: "所属データの保存が完了しました。",
    });
  } catch (e) {
    console.error(e);
    showToast({
      title: "エラー",
      body: "所属の保存に失敗しました。",
    });
  }
  return id;
};

export const setOwners = async (data: { [key: string]: Owner }) => {
  try {
    await setDoc(ownerDoc, data, { merge: true });
    showToast({
      title: "保存完了",
      body: "所属データの保存が完了しました。",
    });
    return true;
  } catch (e) {
    console.error(e);
    showToast({
      title: "エラー",
      body: "所属の保存に失敗しました。",
    });
  }
  return false;
};

export const getOwner = async () => {
  try {
    const data = getDoc(ownerDoc);

    return data;
  } catch (e) {
    console.error(e);
    showToast({
      title: "エラー",
      body: "所属データの取得に失敗しました。",
    });
  }
};

export const parentRefDataToChildRefData = (data: {
  [key: string]: { parent: string };
}) => {
  const copy = { ...data };
  interface Ret {
    childs?: { [key: string]: Ret };
    parent?: string;
  }
  const ret: Ret = {};
  const solved: { [key: string]: string[] } = {};
  let solvedCount = 1;
  while (solvedCount) {
    solvedCount = 0;
    for (const key in copy) {
      const current = copy[key];
      const parentName = current.parent;
      if (!parentName) {
        ret[key] = current;
        solved[key] = [];
        delete copy[key];
        solvedCount++;
      } else if (parentName in solved) {
        let parent = ret;
        for (const route of solved[parentName]) {
          parent = parent[route].childs;
        }
        parent = parent[parentName];
        solved[key] = [...solved[parentName], parentName];
        if (parent.childs) {
          parent.childs[key] = current;
        } else {
          const childs = {};
          childs[key] = current;
          parent.childs = childs;
        }
        delete copy[key];
        solvedCount++;
      }
    }
  }
  return ret;
};
