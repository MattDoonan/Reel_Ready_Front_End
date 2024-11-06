<template>
  <!-- Main page structure containing a list projects relating to a user -->
  <ion-page>
    <ion-content>
      <main>
        <!-- User profile section, would be built for the full version -->
        <section class="profile">

        </section>
        <!-- Projects section where users can search and create new projects -->
        <section class="projects">
          <h3 class="text-black">
            Projects
          </h3>
          <!-- Project search functionality -->
          <div class="project-search">
            <div class="input-search">
              <ion-img alt="search icon" src="/svg/search-icon.svg"/>
              <input v-model="toSearch" @input="inputHandler" type="text"/>
            </div>
            <!-- Button to toggle the project creation form -->
            <button @click="toggleCreate(1)" class="left-row text-white crate-popup">
              Create Project
              <ion-img alt="plus" src="/svg/plus-white.svg"/>
            </button>
          </div>
          <!-- Grid of projects fetched from API -->
          <div class="grid">
            <list-item :id="item.id.toString()" :image="item.image" :heading="item.name" link-heading="Project" :sub-heading="item.type" :key="index" v-for="(item, index) in projects"/>
          </div>
        </section>
        <!-- Project creation form, triggered when user clicks the "Create Project" button -->
        <project-creation-form :go-profile="goProfile" :update-projects="updateProjects" :project-type="projectTypes" :tags="tags" :toggle-active="toggleCreate" :is-active="isActive"/>
        <!-- Message shown when a project is added successfully -->
        <ItemAdded :toggle-active="toggleCreate" text="Project added successfully" :is-active="isActive"/>
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
import ItemAdded from "@/components/ItemAdded.vue";
export default {
  data() {
    return {
      // Tracks the state of the project creation form (whether it's active or not)
      isActive: 0
    }
  },
  components: {
    ItemAdded,
    ProjectCreationForm,
    ListItem,
    AppNav,
    IonPage,
    IonContent,
    IonImg,
  },
  setup() {
    const router = useRouter();
    // Projects data reference
    const projects = ref<projectsExploreType[]>([]);
    // Search term for filtering projects
    const toSearch = ref<string>("");

    // Project types and tags data
    const projectTypes = ref<string[]>([])
    const tags = ref<string[]>([])

    /**
     * Updates the list of projects with new data.
     * @param {projectsExploreType[]} newProjects - The new list of projects.
     */
    const updateProjects = (newProjects: projectsExploreType[]) => {
      projects.value = newProjects;
    }

    /**
     * Fetches the list of projects based on the current search term.
     * Includes error handling in case the request fails.
     */
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

    /**
     * Fetches tags and project types for filtering projects.
     * This is called during component setup.
     */
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

    // Trigger the fetch for projects and project variables
    const inputHandler = () => {
      fetchProjects();
    };

    // Fetch initial data for project types and tags
    getProjectVar();
    // Fetch projects initially
    fetchProjects();
    return { router, projects, inputHandler, toSearch, projectTypes, tags, updateProjects };
  },
  methods: {
    /**
     * Toggles the visibility of the project creation form.
     * @param {number} number - The state to set for the form (1 = active, 0 = inactive).
     */
    toggleCreate(number: number) {
      this.isActive = number;
    },
    /**
     * Navigates to the user's profile page.
     */
    goProfile() {
      this.router.push('/profile')
    },
  }
}
</script>