<template>
  <ion-page>
    <ion-content>
      <main>
        <section v-if="item" class="img-container project center-row">
          <ion-img alt="main image" :src="imageSrc"/>
        </section>
        <section v-if="item" class="project-content center-top-col">
          <div class="left-col item-title">
            <h1 class="text-black">
              {{item.name}}
            </h1>
            <h4 class="text-dark-grey">
              {{item.type}}
            </h4>
            <div class="left-row container">
              <article class="restrictions" :key="index" v-for="(text, index) in item.tags">
                <p>
                  {{ text }}
                </p>
              </article>
            </div>
          </div>
          <div class="left-col description" v-if="item.description">
            <h4 class="text-red">
              Description
            </h4>
            <p class="text-black description-text">
              {{item.description}}
            </p>
          </div>
          <div class="product-placements">
            <div class="space-apart-row">
              <h2 class="text-red">
                Product Placement Posts
              </h2>
              <div class="dropdown">
                <button @click="togglePP" class="left-row">
                  Add a product placement
                  <ion-img alt="plus" src="/svg/plus.svg"/>
                </button>
              </div>
            </div>
            <product-placement :name="pp.title" :description="pp.scene_description" :desired-item="pp.product_category" :requests="pp.product_requests" :key="index" v-for="(pp, index) in productPlacements"/>
          </div>
        </section>
        <AddProductPlacement :toggle-active="togglePP" :is-active="ppActive"/>
      </main>
    </ion-content>
    <app-nav/>
  </ion-page>
</template>

<script lang="ts">

import {IonPage, IonContent, IonImg} from '@ionic/vue';
import {useRouter} from "vue-router";
import AppNav from "@/components/AppNav.vue";
import ProductPlacement from "@/components/ProductPlacement.vue";
import AddProductPlacement from "@/components/AddProductPlacement.vue";
import {ref} from "vue";
import axios from 'axios';
import {url, user_code} from "@/base_information";
export default {
  data() {
    return {
      imgIndex: 0,
      ppActive: false,
    }
  },
  components: {
    AddProductPlacement,
    ProductPlacement,
    IonImg,
    AppNav,
    IonPage,
    IonContent
  },
  setup() {
    const router = useRouter();
    const item = ref([])
    const productPlacements = ref([])
    const getProduct = async () => {
      try {
        const response = await axios.get(url + `get_project/${router.currentRoute.value.params.id}/${user_code}`);
        const { project, product_placements } = response.data;
        if (!project) {
          await router.push('/explore');
        }
        item.value = project;
        console.log(product_placements);
        productPlacements.value = product_placements;
      } catch (error) {
        console.error('Error fetching filters: ', error);
        await router.push('/profile');
      }
    }
    getProduct();

    return { router, item, productPlacements };
  },
  computed: {
    imageSrc(): string {
      return `data:image/png;base64,${this.item.image}`;
    }
  },
  methods: {
    togglePP() {
      this.ppActive = !this.ppActive;
    },
  }
}
</script>