<template>
  <v-container class="d-flex flex-wrap">
    <v-card
      v-if="me && orders.length !== 0 && order.drinks.length !== 0"
      v-for="order in orders"
      :key="order.id"
      class="mx-3 my-3"
      width="300"
      :class="{ 'done-job': order.status === 'done' }"
    >
      <v-card-title>{{ order.restaurant.name }}</v-card-title>

      <v-card-text>
        <div v-for="drink in order.drinks" :key="drink.id">
          <p>品名：{{ drink.product.name }}</p>
          <p>價格：{{ drink.product.price }} 元</p>
          <p>甜度：{{ drink.suger }}</p>
          <p>冰塊：{{ drink.ice }}</p>
          <p>數量：{{ drink.quantity }} 杯</p>
          <p>顧客：{{ order.user.username }} </p>
        </div>
        <v-select
          v-model="order.status"
          v-if="me.role.type === 'authenticated'"
          @change="updateOrder(order)"
          :items="statusTypes"
          dense
          outlined
          label="狀態"
          item-value="value"
          item-text="name"
        >
        </v-select>
        <div v-else>
          <p>
            狀態：{{ statusObject[order.status][0] }}
            <v-icon color="indigo">{{ statusObject[order.status][1] }}</v-icon>
          </p>
        </div>
      </v-card-text>
    </v-card>
    <div v-else>
      目前尚無訂單
    </div>
    <div v-if="!me">
      您沒有檢視訂單的權限，請先登入！
    </div>
  </v-container>
</template>

<script>
import { ORDERS, ME } from "@/constants/query";
import { UPDATE_ORDER } from "@/constants/mutate";

export default {
  name: "About",
  props: {
    msg: String
  },
  data() {
    return {
      statusObject: {
        init: ["接收中", "mdi-head-question"],
        prepare: ["準備中", "mdi-handball"],
        delivering: ["外送中", "mdi-motorbike"],
        done: ["已送達", "mdi-hand-okay"]
      },
      statusTypes: [
        {
          name: "接收中",
          value: "init"
        },
        {
          name: "準備中",
          value: "prepare"
        },
        {
          name: "外送中",
          value: "delivering"
        },
        {
          name: "已送達",
          value: "done"
        }
      ]
    };
  },
  watch: {
    $route(data) {
      if (data.name === "Order") {
        this.$apollo.queries.orders.refetch();
      }
    },
    me(data) {
      this.$apollo.queries.orders.refetch();
    }
  },
  methods: {
    async updateOrder(order) {
      const input = {
        where: {
          id: order.id
        },
        data: {
          status: order.status
        }
      };
      await this.$apollo.mutate({
        mutation: UPDATE_ORDER,
        variables: {
          input
        }
      });
    }
  },
  apollo: {
    orders: {
      query: ORDERS,
      fetchPolicy: "network-only",
      variables() {
        const params = {
          where: {
            user: {
              id: this.me ? this.me.id : null
            },
            status_ne: 'done'
          },
          sort: "restaurant"
        };
        if (this.me && this.me.role.type === "authenticated") {
          delete params.where;
        }
        return params;
      },
      skip() {
        return !localStorage.getItem("apollo-token");
      }
    },
    me: {
      query: ME,
      skip() {
        return !localStorage.getItem("apollo-token");
      },
      result({ data }) {
        return data.me;
      }
    }
  }
};
</script>

<style lang="scss">
.done-job {
  background-color: #ECEFF1 !important;
}
</style>
