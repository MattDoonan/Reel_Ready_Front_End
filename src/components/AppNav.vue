<template>
  <ion-footer>
    <ion-toolbar>
      <nav class="center-all">
        <div class="space-apart-row">

          <!-- Navigate to Explore page -->
          <button @click="() => router.push('/explore')" class="left-row clear">
            <ion-img :src="page.path.includes('explore') ? '/nav/search-red.svg' : '/nav/search-black.svg'"/>
            <span :class="page.path.includes('explore') ? 'text-red' : 'text-black'">
            Explore
          </span>
          </button>

          <!-- Navigate to Profile page -->
          <button @click="() => router.push('/profile')" class="left-row clear">
            <ion-img :src="page.path.includes('profile') ? '/nav/user-red.svg' : '/nav/user-black.svg'"/>
            <span :class="page.path.includes('profile') ? 'text-red' : 'text-black'">
            Profile
          </span>
          </button>
        </div>
      </nav>
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
/**
 * FooterNavigation component renders a footer with navigation buttons to
 * the Explore and Profile pages. It tracks the current route to highlight
 * the active page with appropriate icons and text color.
 *
 * @component
 * @example
 * <FooterNavigation />
 */

import { IonNav, IonImg, IonNavLink,IonFooter, IonToolbar } from '@ionic/vue';
import {useRouter, useRoute} from "vue-router";
import {ref, watch} from "vue";

export default {
  components: {
    IonNav,
    IonImg,
    IonNavLink,
    IonFooter,
    IonToolbar,
  },
  setup() {
    // Initialize the router and route hooks
    const router = useRouter();
    const route = useRoute();

    // Reactive reference for tracking the current route
    const page = ref(route);

    // Watch for changes in the route and update the page reference
    watch(route, (newRoute) => {
      page.value = newRoute;
    });

    // Return router and page for use in the template
    return { router, page };
  },
}
</script>