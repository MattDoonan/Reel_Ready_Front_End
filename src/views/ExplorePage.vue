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
            <list-item :id="item.id" :image="item.image" :heading="item.name" link-heading="ExploreItem" :sub-heading="item.brand" :key="index" v-for="(item, index) in products"/>
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
    const products = [{name: 'Coke can', image: '/test/coke.png', brand: 'Coca-Cola', id: '123'}, {name: 'Coke can', image: '/test/coke.png', brand: 'Coca-Cola', id: '123'}, {name: 'Coke can', image: '/test/coke.png', brand: 'Coca-Cola', id: '123'}, {name: 'Coke can', image: '/test/coke.png', brand: 'Coca-Cola', id: '123'}, {name: 'Coke can', image: '/test/coke.png', brand: 'Coca-Cola', id: '123'}, {name: 'Coke can', image: '/test/coke.png', brand: 'Coca-Cola', id: '123'}, {name: 'Coke can', image: '/test/coke.png', brand: 'Coca-Cola', id: '123'}]
    return { router, products };
  },
  data() {
    return {
      pcActive: false,
      restrictActive: false,
    }
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