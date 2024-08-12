<template>
  <ion-page>
    <ion-content>
      <main>
        <section v-if="item" class="img-container project center-row">
          <ion-img alt="main image" :src="item.image"/>
        </section>
        <section v-if="item" class="project-content center-top-col">
          <div class="left-col item-title">
            <h1 class="text-black">
              {{item.title}}
            </h1>
            <h4 class="text-dark-grey">
              {{item.type}}
            </h4>
            <div class="left-row container">
              <article class="restrictions" :key="index" v-for="(text, index) in item.restrictions">
                <p>
                  {{ text }}
                </p>
              </article>
            </div>
          </div>
          <div class="left-col description">
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
            <product-placement :name="product.name" :description="product.description" :desired-item="product.desiredItem" :requests="product.requests" :key="index" v-for="(product, index) in item.productPlacements"/>
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
    const item = {
      image: '/test/joker.png',
      title: 'Joker: Folie à Deux',
      type: 'Movie',
      description: 'After murdering Murray Franklin live on television, Arthur Fleck is incarcerated in Arkham State Hospital, where he meets Harleen Quinzel. The two fall madly in love and experience musical madness through their shared delusions, while Fleck\'s followers start a movement to free him from Arkham, ultimately giving rise to the Clown Prince of Crime\'s criminal empire.',
      restrictions: ['R16', 'Thriller', 'Violent', 'Romance'],
      productPlacements: [
          {
            name: 'Joker and Harley Quinn Dance Scene',
            desiredItem: 'Chair',
            description: 'Amid the chaos of a riot in Gotham Central, The Joker and Harley Quinn dance together, their movements both graceful and manic, creating a surreal and unsettling contrast to the surrounding mayhem.',
            requests: [
              {image: '/test/chair.png', name: 'Brown living room chair', brand: 'Europlan', status: 'Pending'},
              {image: '/test/coke.png', name: 'Coke can', brand: 'Coco-Cola', status: 'Accepted'},
            ]
          },
          {
            name: 'Joker and Harley Quinn Dance Scene',
            desiredItem: 'Chair',
            description: 'Amid the chaos of a riot in Gotham Central, The Joker and Harley Quinn dance together, their movements both graceful and manic, creating a surreal and unsettling contrast to the surrounding mayhem.',
            requests: [
              {image: '/test/chair.png', name: 'Brown living room chair', brand: 'Europlan', status: 'Requested'},
              {image: '/test/coke.png', name: 'Coke can', brand: 'Coco-Cola', status: 'Declined'},
            ]
          },
      ],
    }
    if (item == null) {
      router.push('/explore');
    }
    return { router, item };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    filteredImages() {
      const list = this.item.images.slice(0, 3)
      list.splice(this.imgIndex, this.imgIndex + 1)
      return list;
    }
  },
  methods: {
    togglePP() {
      this.ppActive = !this.ppActive;
    },
  }
}
</script>