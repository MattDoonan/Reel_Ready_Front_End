<template>
  <div :class="{'active': isActive}" class="popup-background">
    <section class="popup-section pp">
      <div class="space-apart-row">
        <h3 class="text-black">
          Add Product Placement
        </h3>
        <button @click="toggleActive()" class="clear">
          <ion-img src="/svg/exit.svg"/>
        </button>
      </div>
      <label class="text-red">
        {{titleError ? 'Title must contain three character' : 'Title'}}
      </label>
      <input v-model="selectedTitle" class="square" :class="{'error': titleError}" type="text"/>
      <label class="text-red">
        {{categoryError ? 'Select a product category' : 'Product Category'}}
      </label>
      <div :class="{'error': categoryError}" class="dropdown-square">
        <button :class="{'active' : openCategories}" @click="toggleCategories">
          {{ selectedCategory == 'none' ? 'Select a category' : selectedCategory }}
          <ion-img :style="{ transform: openCategories ? 'rotate(180deg)' : 'none' }" src="/svg/down-arrow-red.svg"/>
        </button>
        <div v-if="openCategories">
          <button @click="selectCategory(cat)" class="clear" :key='index' v-for="(cat, index) in updatedCategories">
            {{cat}}
          </button>
        </div>
      </div>
      <label class="text-red">
        {{sceneError ? 'Description cannot be empty' : 'Description'}}
      </label>
      <textarea :class="{'error': sceneError}" v-model="selectedSceneDescription" placeholder="Add a note"/>
      <button @click="checkToSubmit" class="red">
        Submit
      </button>
    </section>
  </div>
</template>

<script lang="ts">

import axios from 'axios';
import {url, user_code} from "@/base_information";
import {IonImg} from "@ionic/vue";

export default {
  components: {
    IonImg
  },
  data() {
    return {
      openCategories: false,
      selectedCategory: 'none',
      categoryError: false,
      selectedTitle: '',
      titleError: false,
      selectedSceneDescription: '',
      sceneError: false
    }
  },
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    toggleActive: {
      type: Function,
      required: true,
    },
    categories: {
      type: Array as () => string[],
      required: true,
    },
    updatePP: {
      type: Function,
      required: true,
    },
    itemId: {
      type: String,
      required: true
    },
    goProfile: {
      type: Function,
      required: true,
    }
  },
  methods: {
    toggleCategories() {
      this.openCategories = !this.openCategories;
    },
    selectCategory(cat:string) {
      this.selectedCategory = cat;
      this.openCategories = false;
    },
    checkToSubmit() {
      this.titleError = false;
      this.categoryError = false;
      this.sceneError = false;
      if (this.selectedTitle == null || this.selectedTitle.trim().length < 3) {
        this.titleError = true;
      }
      if (this.selectedCategory == 'none' || !this.categories.includes(this.selectedCategory)) {
        this.categoryError = true;
      }
      if (this.selectedSceneDescription == null || this.selectedSceneDescription.trim().length < 1) {
        this.sceneError = true;
      }
      if (!this.sceneError && !this.titleError && !this.categoryError) {
        this.addProductPlacement();
      }
    },
    async addProductPlacement() {
      try {
        const response = await axios.post(url + `add_product_placement/${user_code}`, {
          project_id: this.itemId,
          scene_description: this.selectedSceneDescription,
          title: this.selectedTitle,
          product_category: this.selectedCategory
        });
        if (response.status === 201) {
          const product_placements = response.data;
          if (Array.isArray(product_placements)) {
            this.updatePP(product_placements)
            this.toggleActive();
            this.selectedTitle = '';
            this.selectedSceneDescription = '';
            this.selectedCategory = 'none';
          } else {
            console.log("error in data response")
            this.goProfile()
          }
        } else {
          if (Array.isArray(response.data)) {
            for (const error of response.data) {
              if (error === 'format') {
                this.goProfile()
              } else if (error === 'scene_description') {
                this.sceneError = true
              } else if (error === 'title') {
                this.titleError = true
              } else if (error === 'filter') {
                this.categoryError = true
              }
            }
          } else {
            console.log("error in data response")
            this.goProfile()
          }
        }
      } catch (error) {
        console.error('Error adding product placement:', error);
      }
    }
  },
  computed: {
    updatedCategories() {
      return this.categories.filter(cat => !cat.toLowerCase().includes(this.selectedCategory.toLowerCase()));
    }
  }
}

</script>