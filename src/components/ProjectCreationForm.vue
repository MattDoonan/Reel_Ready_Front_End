<template>
  <!-- Popup for creating a new project -->
  <div :class="{'active': isActive === 1}" class="popup-background">
    <section class="popup-section create-project">
      <div class="space-apart-row">
        <h3 class="text-black">
          Requests
        </h3>
        <button @click="toggleActive(0)" class="clear">
          <ion-img alt="exit" src="/svg/exit.svg"/>
        </button>
      </div>
      <!-- Form to upload an image, title, select project type and tags, and enter a description -->
      <div class="form-grid">
        <div class="left-col">
          <label class="text-red">
            {{imageError ? 'Invalid image format or size' : 'Upload an image'}}
          </label>
          <button :class="{'error': imageError}" class="upload-img-container" @click="uploadImage">
            <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" style="display:none;" />
            <ion-img :src="image !== '' ? image : '/svg/plus.svg'" :style="image === '' ? { 'object-fit': 'none' } : {}" />
          </button>
        </div>
        <!-- Project title, type, tags, and description sections -->
        <div class="left-col">
          <label class="text-red">
            {{titleError ? 'Title must contain three character' : 'Title'}}
          </label>
          <input v-model="selectedTitle" class="square mb" :class="{'error': titleError}" type="text"/>
          <label class="text-red">
            {{projectTypeError ? 'Select a project type' : 'Project type'}}
          </label>
          <div :class="{'error': projectTypeError}" class="dropdown-square mb">
            <button :class="{'active' : typeActive}" @click="toggleProjectType">
              {{ selectedProjectType == 'none' ? 'Select a project type' : selectedProjectType }}
              <ion-img :style="{ transform: typeActive ? 'rotate(180deg)' : 'none' }" src="/svg/down-arrow-red.svg"/>
            </button>
            <div v-if="typeActive">
              <button @click="selectProjectType(pt)" class="clear" :key='index' v-for="(pt, index) in projectType">
                {{pt}}
              </button>
            </div>
          </div>
          <label class="text-red">
            {{projectTagError ? 'Select a tag' : 'Project tags'}}
          </label>
          <div @focusin="inputActive" @focusout="inputClose" :class="{'error': projectTagError}" class="dropdown-square">
            <input v-model="tagSearch" class="square" :class="{'active' : tagsActive}" type="text"/>
            <div @mouseover="handleMouseOver" @mouseout="handleMouseOut" v-if="tagsActive">
              <button @click="selectTag(pt)" class="clear" :key='index' v-for="(pt, index) in updatedTags">
                {{pt}}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Selected tags display -->
      <div v-if="selectedTags.length > 0" class="left-row container">
        <button @click="removeTag(text)" class="tags left-row" :key="index" v-for="(text, index) in selectedTags">
          {{ text }}
          <ion-img src="/svg/exit.svg" alt="exit"/>
        </button>
      </div>
      <!-- Description input field -->
      <label class="text-red">
        {{descriptionError ? 'Description cannot be empty' : 'Description'}}
      </label>
      <textarea :class="{'error': descriptionError}" v-model="selectedDescription" placeholder="Add description of the project"/>
      <!-- Submit button -->
      <button @click="checkToSubmit" class="red">
        Submit
      </button>
    </section>
  </div>
</template>

<script lang="ts">

import {IonImg} from "@ionic/vue";
import axios from "axios";
import {url, user_code} from "@/base_information";

export default {
  components: {
    IonImg
  },
  data() {
    return {
      // Determines if tag dropdown is active
      tagsActive: false,
      // Determines if type dropdown is active
      typeActive: false,
      // Value for if there is an image error
      imageError: false,
      // Value for if there is a title error
      titleError: false,
      // Value for if there is a project type error
      projectTypeError: false,
      // Value for if there is a project tag error
      projectTagError: false,
      // Value for if there is a description error
      descriptionError: false,
      // Inputted title
      selectedTitle: '',
      // Selected project type
      selectedProjectType: 'none',
      // Inputted tag search
      tagSearch: '',
      // List of selected tags
      selectedTags: [],
      // Uploaded image base64 code
      image: '',
      // Inputted description
      selectedDescription: '',
      // Mouse over type dropdown
      isMouseOver: false,
    }
  },
  props: {
    /**
     * Determines if the popup is active.
     * @type {number}
     */
    isActive: {
      type: Number,
      required: true,
    },
    /**
     * Function to toggle the active state.
     * @type {Function}
     */
    toggleActive: {
      type: Function,
      required: true,
    },
    /**
     * Array of project types available for selection.
     * @type {Array<string>}
     */
    projectType: {
      type: Array as () => string[],
      required: true,
    },
    /**
     * Array of available tags for selection.
     * @type {Array<string>}
     */
    tags: {
      type: Array as () => string[],
      required: true,
    },
    /**
     * Function to update the list of projects.
     * @type {Function}
     */
    updateProjects: {
      type: Function,
      required: true,
    },
    /**
     * Function to navigate to the profile page.
     * @type {Function}
     */
    goProfile: {
      type: Function,
      required: true,
    }
  },
  methods: {
    /**
     * Toggles the visibility of the project type dropdown.
     */
    toggleProjectType() {
      this.typeActive = !this.typeActive;
      this.tagsActive = false;
    },

    /**
     * Selects a project type from the dropdown.
     * @param {string} pt - The selected project type.
     */
    selectProjectType(pt:string) {
      this.typeActive = false
      this.selectedProjectType = pt;
    },

    /**
     * Selects a tag and adds it to the list of selected tags.
     * @param {string} tag - The tag to be selected.
     */
    selectTag(tag:string) {
      this.selectedTags.push(tag);
      this.tagsActive = false
      this.tagSearch = ''
    },

    /**
     * Removes a tag from the list of selected tags.
     * @param {string} tagToRemove - The tag to be removed.
     */
    removeTag(tagToRemove:string) {
      this.selectedTags = this.selectedTags.filter(tag => tag !== tagToRemove);
    },

    /**
     * Triggers the file input for image upload.
     */
    uploadImage() {
      this.$refs.fileInput.click();
    },

    /**
     * Handles the change in the file input and processes the image file.
     * @param {Event} event - The change event triggered by the file input.
     */
    onFileChange(event) {
      this.imageError = false;
      const file = event.target.files[0];
      if (file.type.startsWith('image/') && file.size < 1024 * 1024) {
        this.processToBase64(file).then(base64 => {
          this.image = String(base64)
        }).catch(error => {
          this.image = '';
          this.imageError = true;
        });
      } else {
        this.image = '';
        this.imageError = true;
      }
    },

    /**
     * Converts a file to a Base64 string.
     * @param {File} file - The file to be converted.
     * @returns {Promise<string>} A promise that resolves with the Base64 encoded string.
     */
    processToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    },

    /**
     * Activates the tags search input dropdown.
     */
    inputActive() {
      this.tagsActive = true;
    },

    /**
     * Closes the tags search dropdown unless the mouse is over it.
     */
    inputClose() {
      if (!this.isMouseOver)
      this.tagsActive = false
    },

    /**
     * Handles mouse over event for the tags dropdown.
     */
    handleMouseOver() {
      this.isMouseOver = true;
    },

    /**
     * Handles mouse out event for the tags dropdown.
     */
    handleMouseOut() {
      this.isMouseOver = false;
    },

    /**
     * Checks if the form is valid and submits the project data.
     */
    checkToSubmit() {
      this.titleError = false;
      this.projectTypeError = false;
      this.projectTagError = false;
      this.descriptionError = false;
      if (this.selectedTitle == null || this.selectedTitle.trim().length < 3) {
        this.titleError = true;
      }
      if (this.selectedDescription == null || this.selectedDescription.trim().length < 1) {
        this.descriptionError = true;
      }
      if (this.selectedProjectType === 'none' || !this.projectType.includes(this.selectedProjectType)) {
        this.projectTypeError = true;
      }
      if (this.image === '') {
        this.imageError = true;
      }
      for (let tag of this.selectedTags) {
        if (!this.tags.includes(tag)) {
          this.projectTagError = true
        }
      }
      if (!this.titleError && !this.imageError && !this.descriptionError && !this.projectTypeError && !this.projectTagError) {
        this.addProject()
      }
    },

    /**
     * Adds a new project by making an API call to the server.
     */
    async addProject() {
      try {
        const response = await axios.post(url + `add_project/${user_code}`, {
          image: this.image,
          name: this.selectedTitle,
          description: this.selectedDescription,
          type: this.selectedProjectType,
          tags: this.selectedTags
        });
        console.log(response.status)
        if (response.status === 201) {
          const projects = response.data;
          if (Array.isArray(projects)) {
            this.updateProjects(projects)
            this.toggleActive(2);
            this.selectedTitle = '';
            this.selectedDescription = '';
            this.selectedProjectType = 'none';
            this.selectedTags = [];
            this.image = "";
          } else {
            console.log("error in data response")
            this.goProfile()
          }
        } else {
          if (Array.isArray(response.data)) {
            for (const error of response.data) {
              if (error === 'format') {
                this.goProfile()
              } else if (error === 'image') {
                this.imageError = true
              } else if (error === 'name') {
                this.titleError = true
              } else if (error === 'description') {
                this.descriptionError = true
              } else if (error === 'type') {
                this.projectTypeError = true
              } else if (error === 'tags') {
                this.projectTagError = true
              }
            }
          } else {
            console.log("error in data response")
            this.goProfile()
          }
        }
      } catch (error) {
        console.error('Error adding Project:', error);
      }
    }
  },
  computed: {
    /**
     * Filters tags based on search input and excludes selected tags.
     * @returns {Array<string>} The filtered tags.
     */
    updatedTags() {
      return this.tags.filter(
          tag => tag.toLowerCase().includes(this.tagSearch.toLowerCase()) &&
              !this.selectedTags.map(selectedTag => selectedTag.toLowerCase()).includes(tag.toLowerCase())
      );
    }
  }
}

</script>