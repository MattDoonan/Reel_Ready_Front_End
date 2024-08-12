<template>
  <div :class="{'active': isActive}" class="popup-background">
    <section class="popup-section pp">
      <div class="space-apart-row">
        <h3 class="text-black">
          Add Product Placement
        </h3>
        <button @click="toggleActive" class="clear">
          <ion-img src="/svg/exit.svg"/>
        </button>
      </div>
      <label class="text-red">
        Title
      </label>
      <input class="square" type="text"/>
      <label class="text-red">
        Product Category
      </label>
      <div class="dropdown-square">
        <button>
          Category
          <ion-img src="/svg/down-arrow-red.svg"/>
        </button>
      </div>
      <label class="text-red">
        Description
      </label>
      <textarea placeholder="Add a note (optional)"/>
      <button class="red">
        Submit
      </button>
    </section>
  </div>
</template>

<script lang="ts">

export default {
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    toggleActive: {
      type: Function,
      required: true,
    },
  }
}

</script>