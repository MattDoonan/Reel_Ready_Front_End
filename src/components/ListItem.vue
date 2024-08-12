<template>
  <router-link class="left-col listItem" :to="{name: linkHeading, params: {id: id}}">
    <div class="img-container-list">
      <ion-img :alt="'image ' + id" :src="image"/>
    </div>
    <h3>
      {{heading}}
    </h3>
    <h4>
      {{subHeading}}
    </h4>
  </router-link>
</template>

<script lang="ts">


import {IonImg} from "@ionic/vue";

export default {
  props: {
    id: {
      require: true,
      type: String,
    },
    linkHeading: {
      require: true,
      type: String,
    },
    image: {
      require: true,
      type: String,
    },
    heading: {
      require: true,
      type: String,
    },
    subHeading: {
      require: true,
      type: String,
    },
  },
  components: {IonImg},
}
</script>
