<template>
  <dialog :open="dialog">
    選擇餐廳：
    <select v-model="restaurantId">
      <option :value="res.id" v-for="res in restaurants" :key="res.id">{{
        res.name
      }}</option>
    </select>
    <br />
    <button style="margin-top: 20px" @click="createOrder" :disabled="!restaurantId">送出</button>
  </dialog>
</template>

<script>
import { RESTAURANTS } from "@/constants/query";
import { CREATE_ORDER } from "@/constants/mutate";

export default {
  name: "OrderDialog",
  props: ["dialog"],
  data() {
    return {
      status: "init",
      restaurantId: null
    };
  },
  methods: {
    async createOrder() {
      const input = {
        data: {
          status: this.status,
          restaurant: this.restaurantId
        }
      };
      const result = await this.$apollo
        .mutate({
          mutation: CREATE_ORDER,
          variables: {
            input
          }
        })
        .then(response => {
          localStorage.setItem("order-id", response.data.createOrder.order.id);
          this.$emit("close-dialog", response.data.createOrder.order);
        });
    }
  },
  apollo: {
    restaurants: {
      query: RESTAURANTS
    }
  }
};
</script>
