<template>
  <div>
    <v-container class="d-flex flex-wrap">
      <v-card
        v-for="product in products"
        :key="product.id"
        v-if="order && me"
        class="mx-3 my-3 drink"
        width="300"
        height="300"
      >
        <v-card-title>{{ product.name }}</v-card-title>
        <v-card-text>
          <p>價格：{{ product.price }} 元</p>
          <v-select
            v-model="product.suger"
            :items="sugerTypes"
            dense
            outlined
            label="選擇甜度"
          >
          </v-select>
          <v-select
            v-model="product.ice"
            :items="iceTypes"
            dense
            outlined
            label="選擇冰塊"
          >
          </v-select>
          <v-text-field
            v-model="product.quantity"
            dense
            outlined
            min="1"
            type="number"
            label="選擇數量"
          >
          </v-text-field>
        </v-card-text>
      </v-card>
      <div v-if="!me">
        您沒有建立訂單的權限，請先登入！
      </div>
    </v-container>
    <br />
    <div class="order-send mr-6" v-if="order && me">
      <v-btn
        :disabled="disabledSend"
        @click="send"
        color="indigo"
        style="color: #fff"
        >送出</v-btn
      >
    </div>
  </div>
</template>

<script>
import { CREATE_DRINK } from "@/constants/mutate";
import { PRODUCTS, ME, ORDERS } from "../constants/query";

export default {
  name: "CreateOrder",
  props: ["createdOrder"],
  data() {
    return {
      iceTypes: ["正常", "少冰", "微冰", "去冰", "常溫", "溫熱"],
      sugerTypes: ["正常", "少糖", "半糖", "微糖", "無糖"],
      order: null
    };
  },
  watch: {
    async createdOrder() {
      await this.$apollo.queries.products.refetch();
      await this.$apollo.queries.orders.refetch();
    }
  },
  computed: {
    disabledSend() {
      if (!this.products) return true;
      const checkHasType = product =>
        product.ice && product.quantity && product.suger;
      return !this.products.some(checkHasType);
    }
  },
  methods: {
    async send() {
      for (const product of this.products) {
        const input = {
          data: {
            order: this.order.id,
            product: product.id,
            suger: product.suger,
            ice: product.ice,
            quantity: Number(product.quantity)
          }
        };
        const checkHasType = product =>
          product.ice && product.quantity && product.suger;
        if (checkHasType(product)) {
          this.$apollo
            .mutate({
              mutation: CREATE_DRINK,
              variables: {
                input
              }
            })
            .then(response => {
              this.$router.push({ path: "/order" }, () => {});
            });
        }
      }
    }
  },
  apollo: {
    products: {
      query: PRODUCTS,
      variables() {
        return {
          where: {
            restaurant: {
              name: this.order ? this.order.restaurant.name : null
            }
          }
        };
      }
    },
    me: {
      query: ME,
      skip() {
        return !localStorage.getItem("apollo-token");
      },
      result({ data }) {
        this.user = data.me;
        return data.me;
      }
    },
    orders: {
      query: ORDERS,
      variables() {
        return {
          where: {
            user: {
              id: this.me ? this.me.id : null
            },
            status: "init"
          },
          sort: "created_at:desc"
        };
      },
      result({ data }) {
        if (data.orders[0] && data.orders[0].drinks.length !== 0) return;
        this.order = data.orders[0];
      }
    }
  }
};
</script>

<style lang="scss">
.order-send {
  display: flex;
  justify-content: flex-end;
}
</style>
