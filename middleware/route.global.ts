export default defineNuxtRouteMiddleware(async (to, from) => {
  const LoggedIn = await isLoggedIn();
  //console.log("Navigate you to", to.path, "\nLoggedIn:", LoggedIn);
  if (LoggedIn && to.path === "/login") {
    return navigateTo("/logout");
  } else if (to.path === "/logout") {
    await useAuth().signOut();
    showToast({ title: "ログアウト", body: "ログアウトしました。" });
    return navigateTo("/login");
  } else if (!(LoggedIn || to.meta.notRequireAuth)) {
    showToast({
      title: "ログインしてください",
      body: to.fullPath + "にアクセスするにはログインする必要があります。",
    });
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  } else if (to.path === "/new") {
    const docId = await setProject(null, {});
    showToast({ title: "新規企画", body: "新しい企画が作成されました。" });
    return navigateTo({ path: "/editor/" + docId });
  } else if (to.path === "/new-owner") {
    const ownerId = await newOwner();
    showToast({ title: "新規組織", body: "新しい組織が作成されました。" });
    return navigateTo({ path: "/owner-editor/" + ownerId });
  }
});
