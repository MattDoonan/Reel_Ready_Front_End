<template>
  <div :class="{'active': isActive}" class="popup-background">
    <section class="popup-section create-project">
      <div class="space-apart-row">
        <h3 class="text-black">
          Requests
        </h3>
        <button @click="toggleActive()" class="clear">
          <ion-img alt="exit" src="/svg/exit.svg"/>
        </button>
      </div>
      <div class="form-grid">
        <div class="left-col">
          <label class="text-red">
            {{imageError ? 'Invalid image format' : 'Upload an image'}}
          </label>
          <button class="upload-img-container" @click="uploadImage">
            <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" style="display:none;" />
            <ion-img :src="image !== '' ? image : '/svg/plus.svg'" :style="image === '' ? { 'object-fit': 'none' } : {}" />
          </button>
        </div>
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
      <div class="left-row container">
        <button @click="removeTag(text)" class="tags left-row" :key="index" v-for="(text, index) in selectedTags">
          {{ text }}
          <ion-img src="/svg/exit.svg" alt="exit"/>
        </button>
      </div>
      <label class="text-red">
        {{descriptionError ? 'Description cannot be empty' : 'Description'}}
      </label>
      <textarea :class="{'error': descriptionError}" v-model="selectedDescription" placeholder="Add a note"/>
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
      tagsActive: false,
      typeActive: false,
      imageError: false,
      titleError: false,
      projectTypeError: false,
      projectTagError: false,
      descriptionError: false,
      selectedTitle: '',
      selectedProjectType: 'none',
      tagSearch: '',
      selectedTags: [],
      image: '',
      selectedDescription: '',
      isMouseOver: false,
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
    projectType: {
      type: Array as () => string[],
      required: true,
    },
    tags: {
      type: Array as () => string[],
      required: true,
    },
    updateProjects: {
      type: Function,
      required: true,
    },
    goProfile: {
      type: Function,
      required: true,
    }
  },
  methods: {
    toggleProjectType() {
      this.typeActive = !this.typeActive;
      this.tagsActive = false;
    },
    selectProjectType(pt:string) {
      this.typeActive = false
      this.selectedProjectType = pt;
    },
    selectTag(tag:string) {
      this.selectedTags.push(tag);
      this.tagsActive = false
      this.tagSearch = ''
    },
    removeTag(tagToRemove:string) {
      this.selectedTags = this.selectedTags.filter(tag => tag !== tagToRemove);
    },
    uploadImage() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      this.imageError = false;
      const file = event.target.files[0];
      if (file.type.startsWith('image/')) {
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
    processToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    },
    inputActive() {
      this.tagsActive = true;
    },
    inputClose() {
      if (!this.isMouseOver)
      this.tagsActive = false
    },
    handleMouseOver() {
      this.isMouseOver = true;
    },
    handleMouseOut() {
      this.isMouseOver = false;
    },
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
      for (let tag of this.selectedTags) {
        if (!this.tags.includes(tag)) {
          this.projectTagError = true
        }
      }
      if (!this.titleError && !this.imageError && !this.descriptionError && !this.projectTypeError && !this.projectTagError) {
        this.addProject()
      }
    },
    async addProject() {
      try {
        const response = await axios.post(url + `add_project/${user_code}`, {
          image: this.image,
          name: this.selectedTitle,
          description: this.selectedDescription,
          type: this.selectedProjectType,
          tags: this.selectedTags
        });
        if (response.status === 201) {
          const projects = response.data;
          if (Array.isArray(projects)) {
            this.updateProjects(projects)
            this.toggleActive();
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
    updatedTags() {
      return this.tags.filter(
          tag => tag.toLowerCase().includes(this.tagSearch.toLowerCase()) &&
              !this.selectedTags.map(selectedTag => selectedTag.toLowerCase()).includes(tag.toLowerCase())
      );
    }
  }
}

</script>