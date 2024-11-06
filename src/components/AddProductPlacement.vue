<template>
  <div :class="{'active': isActive === 1}" class="popup-background">
    <!-- Popup Section for Adding Product Placement -->
    <section class="popup-section pp">
      <!-- Title and Close Button -->
      <div class="space-apart-row">
        <h3 class="text-black">
          Add Product Placement
        </h3>
        <button @click="toggleActive(0)" class="clear">
          <ion-img src="/svg/exit.svg"/>
        </button>
      </div>

      <!-- Title Input Field with Error Handling -->
      <label class="text-red">
        {{titleError ? 'Title must contain three character' : 'Title'}}
      </label>
      <input v-model="selectedTitle" class="square" :class="{'error': titleError}" type="text"/>

      <!-- Product Category Dropdown with Error Handling -->
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

      <!-- Scene Description Field with Error Handling -->
      <label class="text-red">
        {{sceneError ? 'Description cannot be empty' : 'Description'}}
      </label>
      <textarea :class="{'error': sceneError}" v-model="selectedSceneDescription" placeholder="Write a description of your scene"/>

      <!-- Submit Button -->
      <button @click="checkToSubmit" class="red">
        Submit
      </button>
    </section>
  </div>
</template>

<script lang="ts">
/**
 * This component is used for adding a product placement. It contains inputs for
 * the title, category, and scene description of the placement. The component
 * validates the inputs and sends the data to the server to add the new product
 * placement to the project.
 *
 * Example usage:
 * <AddProductPlacement
 *    :isActive="activeState"
 *    :toggleActive="togglePopupState"
 *    :categories="categoriesList"
 *    :updatePP="updateProductPlacements"
 *    :itemId="projectId"
 *    :goProfile="goToUserProfile" />
 */

import axios from 'axios';
import {url, user_code} from "@/base_information";
import {IonImg} from "@ionic/vue";

export default {
  components: {
    IonImg
  },
  data() {
    return {
      // Whether the categories dropdown is open
      openCategories: false,

      // Currently selected product category
      selectedCategory: 'none',

      // Whether there's an error with the product category
      categoryError: false,

      // Title of the product placement
      selectedTitle: '',

      // Whether there's an error with the title
      titleError: false,

      // Description of the product placement scene
      selectedSceneDescription: '',

      // Whether there's an error with the scene description
      sceneError: false
    }
  },
  props: {
    // Whether the component is active (1 if active)
    isActive: {
      type: Number,
      required: true,
    },

    // Function to toggle the active state of the component
    toggleActive: {
      type: Function,
      required: true,
    },

    // Array of categories available for selection
    categories: {
      type: Array as () => string[],
      required: true,
    },

    // Function to update the list of product placements
    updatePP: {
      type: Function,
      required: true,
    },

    // ID of project associated with the product placement
    itemId: {
      type: String,
      required: true
    },

    // Function to navigate to the profile page
    goProfile: {
      type: Function,
      required: true,
    }
  },
  methods: {
    /**
     * Toggles the visibility of the categories dropdown.
     */
    toggleCategories() {
      this.openCategories = !this.openCategories;
    },

    /**
     * Selects a product category from the dropdown.
     * @param {string} cat - The selected category.
     */
    selectCategory(cat:string) {
      this.selectedCategory = cat;
      this.openCategories = false;
    },

    /**
     * Validates the input fields and submits the product placement if valid.
     */
    checkToSubmit() {
      this.titleError = false;
      this.categoryError = false;
      this.sceneError = false;
      // Check if title is valid
      if (this.selectedTitle == null || this.selectedTitle.trim().length < 3) {
        this.titleError = true;
      }
      // Check if a valid category is selected
      if (this.selectedCategory == 'none' || !this.categories.includes(this.selectedCategory)) {
        this.categoryError = true;
      }
      // Check if scene description is provided
      if (this.selectedSceneDescription == null || this.selectedSceneDescription.trim().length < 1) {
        this.sceneError = true;
      }
      // If all fields are valid, submit the data
      if (!this.sceneError && !this.titleError && !this.categoryError) {
        this.addProductPlacement();
      }
    },

    /**
     * Sends a request to add a new product placement.
     * On success, updates the product placements and closes the popup.
     */
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
          // If the response is a valid array of product placements, update the list
          if (Array.isArray(product_placements)) {
            this.updatePP(product_placements)
            this.toggleActive(2);
            this.selectedTitle = '';
            this.selectedSceneDescription = '';
            this.selectedCategory = 'none';
          } else {
            console.log("error in data response")
            this.goProfile() // Go to profile if there's an issue
          }
        } else {
          // Handle validation errors from the response
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

  /**
   * Filters the categories to exclude the currently selected category.
   * @returns {string[]} List of categories that are not the selected one.
   */
  computed: {
    updatedCategories() {
      return this.categories.filter(cat => !cat.toLowerCase().includes(this.selectedCategory.toLowerCase()));
    }
  }
}
</script>