export default defineNuxtRouteMiddleware(async (to, from) => {
  const logined = await isLogined();
  console.log("Navigate you to", to.path, "\nLoggined:", logined);
  if (logined && to.path === "/login") {
    return navigateTo("/logout");
  } else if (to.path === "/logout") {
    await useAuth().signOut();
    showToast({ title: "ログアウト", body: "ログアウト" });
    return navigateTo("/login");
  } else if (!(logined || to.meta.notRequireAuth)) {
    return navigateTo("/login");
  }
});
