<template lang="pug">
nav.navbar.navbar-expand-lg.navbar-dark.bg-dark.shadow-lg
  .container-fluid
    NuxtLink.navbar-brand(to="/") SF Site Edit
    button.navbar-toggler(
      type="button",
      data-bs-toggle="collapse",
      data-bs-target="#navbarSupportedContent",
      aria-controls="navbarSupportedContent",
      aria-expanded="false",
      aria-label="Toggle navigation"
    )
      span.navbar-toggler-icon
    #navbarSupportedContent.collapse.navbar-collapse
      ul.navbar-nav.me-auto.mb-2.mb-lg-0
        li.nav-item
          NuxtLink.nav-link(v-if="useIsLoggedIn()", to="/new") New project &gt;&gt;&gt;
          NuxtLink.nav-link(v-else, to="/login") Login &gt;&gt;&gt;
</template>
