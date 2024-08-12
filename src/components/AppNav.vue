<template>
  <ion-footer>
    <ion-toolbar>
      <nav class="center-all">
        <div class="space-apart-row">
          <button @click="() => router.push('/explore')" class="left-row clear">
            <ion-img :src="page.path.includes('explore') ? '/nav/search-red.svg' : '/nav/search-black.svg'"/>
            <span :class="page.path.includes('explore') ? 'text-red' : 'text-black'">
            Explore
          </span>
          </button>
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
    const router = useRouter();
    const route = useRoute();
    const page = ref(route);

    watch(route, (newRoute) => {
      page.value = newRoute;
    });

    return { router, page };
  },
}
</script>