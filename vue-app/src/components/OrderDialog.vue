<template>
  <v-dialog v-model="dialog" max-width="480px" max-height="640px" persistent>
    <v-card>
      <v-toolbar color="indigo" dark>
        <v-toolbar-title>新增訂單</v-toolbar-title>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="submit">
        <v-card-text>
          <v-select
            :items="restaurants"
            label="選擇飲料店"
            v-model="restaurantId"
            item-value="id"
            item-text="name"
            outlined
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="indigo"
            dark
            @click="
              () => {
                $emit('close-dialog', false);
                restaurantId = null;
              }
            "
            >取消</v-btn
          >
          <v-btn @click="createOrder" :disabled="!restaurantId">送出</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { RESTAURANTS, ME } from "@/constants/query";
import { CREATE_ORDER } from "@/constants/mutate";

export default {
  name: "OrderDialog",
  props: ["dialog", "userData", "me"],
  data() {
    return {
      status: "init",
      restaurantId: null
    };
  },
  methods: {
    async createOrder() {
      console.log(this.userData)
      const input = {
        data: {
          status: this.status,
          restaurant: this.restaurantId,
          user: this.me
            ? this.me.id
            : this.userData
            ? this.userData.loginData.user.id
            : null
        }
      };
      console.log(input);
      const result = await this.$apollo
        .mutate({
          mutation: CREATE_ORDER,
          variables: {
            input
          }
        })
        .then(response => {
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
