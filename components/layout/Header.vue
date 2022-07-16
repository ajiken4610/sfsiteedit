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
        template(v-if="useIsLoggedIn()")
          li.nav-item
            NuxtLink.nav-link(to="/new") New project &gt;&gt;&gt;
          li.nav-item
            NuxtLink.nav-link(to="/new-owner") New Owner &gt;&gt;&gt;
        template(v-else)
          li.nav-item
            NuxtLink.nav-link(to="/login") Login &gt;&gt;&gt;
</template>
