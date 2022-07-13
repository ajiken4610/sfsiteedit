export default defineNuxtRouteMiddleware((to, from) => {
  if (!to.meta.notRequireAuth) {
    return navigateTo("/login");
  }
});
