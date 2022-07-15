import { collection, doc, FirestoreError, setDoc } from "@firebase/firestore";
import { SFProject } from "./SFProject";

export class SFProjectData {
  project: SFProject;
  bigram: string[];
  uid: string;
}

export const setProject = async (id: string | null, project: SFProject) => {
  const firestore = useFirestore();
  const setInto = id
    ? doc(firestore, "draft", id)
    : doc(collection(firestore, "draft"));
  const set = {
    project: { ...{ pid: setInto.id }, ...project },
    bigram: projectToBigramObject(project),
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
    bigram: projectToBigramObject(project),
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
