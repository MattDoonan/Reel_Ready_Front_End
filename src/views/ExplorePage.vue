<template>
  <ion-page>
    <ion-content>
      <main>
        <section class="explore-items">
          <div class="explore-search">
            <div class="input-search">
              <ion-img alt="search icon" src="/svg/search-icon.svg"/>
              <input type="text"/>
            </div>
            <div class="left-row">
              <div class="dropdown">
                <button @click="togglePC" class="left-row">
                  Product Category
                  <ion-img alt="arrow down" src="/svg/down-arrow.svg"/>
                </button>
              </div>
              <div class="dropdown">
                <button @click="toggleRestrict" class="left-row">
                  Restrictions
                  <ion-img alt="arrow down" src="/svg/down-arrow.svg"/>
                </button>
              </div>
            </div>
          </div>
          <div class="grid">
            <list-item :id="item.id.toString()" :image="item.files" :heading="item.title" link-heading="ExploreItem" :sub-heading="item.brand_name" :key="index" v-for="(item, index) in products"/>
          </div>
        </section>
      </main>
    </ion-content>
    <app-nav/>
  </ion-page>
</template>

<script lang="ts">

import {ref} from "vue";
import {url} from "@/base_information";

import {IonPage, IonContent, IonImg, IonNav} from '@ionic/vue';
import {useRouter} from "vue-router";
import AppNav from "@/components/AppNav.vue";
import ListItem from "@/components/ListItem.vue";
import axios from 'axios';

export default {
  data() {
    return {
      pcActive: false,
      restrictActive: false,
      itemsLoaded: 10,
    }
  },
  components: {
    ListItem,
    AppNav,
    IonPage,
    IonContent,
    IonImg,
  },
  setup() {
    const router = useRouter();
    const filters = ref([]);
    const products = ref([])
    const fetchFilters = async () => {
      try {
        const response = await axios.get(url + 'explore-filters');
        filters.value = response.data
      } catch (error) {
        console.error('Error fetching filters: ', error);
      }
    }
    const fetchProducts = async (toLoad:number) => {
      try {
        const response = await axios.get(url + `get_products/${toLoad}`);
        products.value = response.data
      } catch (error) {
        console.error('Error fetching filters: ', error);
      }
    }
    fetchFilters();
    fetchProducts(10);
    return { router, products, filters };
  },
  methods: {
    togglePC() {
      this.pcActive = !this.pcActive;
    },
    toggleRestrict() {
      this.restrictActive = !this.restrictActive;
    }
  }
}
</script>