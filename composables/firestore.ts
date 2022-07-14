import { collection, doc, setDoc } from "@firebase/firestore";
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
    project,
    bigram: projectToBigramObject(project),
    uid: useUser().uid,
  };
  await setDoc(setInto, set);
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
  await setDoc(setInto, set);
  return setInto.id;
};
