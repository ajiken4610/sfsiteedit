import type { RouterConfig } from "@nuxt/schema";

// https://router.vuejs.org/api/#routeroptions
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
};
