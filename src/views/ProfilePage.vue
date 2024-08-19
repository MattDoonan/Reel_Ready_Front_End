<template>
  <ion-page>
    <ion-content>
      <main>
        <section class="profile">

        </section>
        <section class="projects">
          <h3 class="text-black">
            Projects
          </h3>
          <div class="project-search">
            <div class="input-search">
              <ion-img alt="search icon" src="/svg/search-icon.svg"/>
              <input type="text"/>
            </div>
            <div class="left-row">
              <div class="dropdown">
                <button @click="toggleRestrict" class="left-row">
                  Create Project
                  <ion-img alt="plus" src="/svg/plus.svg"/>
                </button>
              </div>
            </div>
          </div>
          <div class="grid">
            <list-item :id="item.id.toString()" :image="item.image" :heading="item.name" link-heading="Project" :sub-heading="item.type" :key="index" v-for="(item, index) in projects"/>
          </div>
        </section>
      </main>
    </ion-content>
    <app-nav/>
  </ion-page>
</template>

<script lang="ts">

import {IonPage, IonContent, IonImg, IonNav} from '@ionic/vue';
import {useRouter} from "vue-router";
import AppNav from "@/components/AppNav.vue";
import ListItem from "@/components/ListItem.vue";
import {ref} from 'vue'
import axios from "axios";
import {url, user_code} from "@/base_information";
export default {
  components: {
    ListItem,
    AppNav,
    IonPage,
    IonContent,
    IonImg,
  },
  setup() {
    const router = useRouter();
    const projects = ref();
    const fetchProjects = async () => {
      try {
        const response = await axios.get(url + `get_user_projects/${user_code}`);
        projects.value = response.data
      } catch (error) {
        console.error('Error fetching filters: ', error);
        await router.push('/');
      }
    }
    fetchProjects();
    return { router, projects };
  },

}
</script>