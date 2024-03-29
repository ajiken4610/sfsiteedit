import { doc, getDoc } from "@firebase/firestore";
import { SFProjectData } from "./firestore";

export const useProjectData = (id: string, draft: boolean = true) =>
  useLazyAsyncData(id + (draft ? "-draft" : "-project"), async () => {
    try {
      const snapshot = await getDoc(
        doc(useFirestore(), draft ? "draft" : "project", id)
      );
      return snapshot.data() as SFProjectData;
    } catch (e) {
      console.error(e);
      showToast({
        title: "エラー",
        body: "プロジェクトは存在しないか、アクセスする権限がありません。",
      });
      useRouter().replace({
        path: "/404",
        query: { path: useRoute().fullPath },
      });
    }
  });

export const useOwnersData = () =>
  useAsyncData("owners", async () => {
    const data = (await getOwner()).data();

    return {
      parentRef: parentRefDataToChildRefData(data) as {
        [key: string]: {
          childs: {};
          name: string;
          description: string;
          parent: string;
          icon: string;
        };
      },
      childRef: data,
    };
  });

export const getOwnerName = (
  childRef: { [key: string]: { name: string; parent?: string } },
  ownerId: string,
  offset = 2
) => {
  const owners = childRef;
  try {
    let ret: string[] = [];
    let current = ownerId;
    const maxRec = 5;
    let i = 0;
    while (current && i++ < maxRec) {
      ret.unshift(owners[current].name);
      current = owners[current].parent;
    }
    return ret.slice(offset).join(" ");
  } catch (e) {
    return ownerId;
  }
};
