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
              <input v-model="toSearch" @input="inputHandler" type="text"/>
            </div>
            <button @click="toggleCreate" class="left-row clear crate-popup">
              Create Project
              <ion-img alt="plus" src="/svg/plus.svg"/>
            </button>
          </div>
          <div class="grid">
            <list-item :id="item.id.toString()" :image="item.image" :heading="item.name" link-heading="Project" :sub-heading="item.type" :key="index" v-for="(item, index) in projects"/>
          </div>
        </section>
        <project-creation-form :go-profile="goProfile" :update-projects="updateProjects" :project-type="projectTypes" :tags="tags" :toggle-active="toggleCreate" :is-active="isActive"/>
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
import {ProductPlacementType, projectsExploreType} from "@/types";
import ProjectCreationForm from "@/components/ProjectCreationForm.vue";
export default {
  data() {
    return {
      isActive: false
    }
  },
  components: {
    ProjectCreationForm,
    ListItem,
    AppNav,
    IonPage,
    IonContent,
    IonImg,
  },
  setup() {
    const router = useRouter();
    const projects = ref<projectsExploreType[]>([]);
    const toSearch = ref<string>("");
    const projectTypes = ref<string[]>([])
    const tags = ref<string[]>([])

    const updateProjects = (newProjects: projectsExploreType[]) => {
      projects.value = newProjects;
    }
    const fetchProjects = async () => {
      try {
        let endpoint =  url + `get_user_projects/${user_code}`

        if (toSearch.value !== "") {
          endpoint = endpoint + `?search=${toSearch.value}`;
        }
        const response = await axios.get(endpoint);
        projects.value = response.data
      } catch (error) {
        console.error('Error fetching filters: ', error);
        await router.push('/');
      }
    };

    const getProjectVar = async () => {
      try {
        const response = await axios.get( url + `get_tags_and_pt`);
        const {data_tags, data_project_types} = response.data
        projectTypes.value = data_project_types
        tags.value = data_tags
      } catch (_) {
        console.error('Error fetching tags and project type');
      }
    };
    const inputHandler = () => {
      fetchProjects();
    };

    getProjectVar();
    fetchProjects();
    return { router, projects, inputHandler, toSearch, projectTypes, tags, updateProjects };
  },
  methods: {
    toggleCreate() {
      this.isActive = !this.isActive;
    },
    goProfile() {
      this.router.push('/profile')
    },
  }
}
</script>