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
    return navigateTo({ path: "/editor/" + docId });
  }
});
