<template>
  <div class="order">
    <div v-if="orders && orders.length === 0">目前尚無訂單</div>
    <div v-for="order in orders" :key="order.id">
      <div class="drink">
        <h3>飲料店：{{ order.restaurant.name }}</h3>
        <div v-for="drink in order.drinks" :key="drink.id">
          <p>品名：{{ drink.product.name }}</p>
          <p>價格：{{ drink.product.price }} 元</p>
          <p>甜度：{{ drink.suger }} 分糖</p>
          <p>冰塊：{{ drink.ice }}</p>
          <p>數量：{{ drink.quantity }} 杯</p>
        </div>
        <b v-if="user.role.type === 'authenticated'" style="color: red"
          >狀態：
          <select v-model="order.status" @change="updateOrder(order)">
            <option
              :value="statusObj.value"
              v-for="statusObj in statusTypes"
              :key="statusObj.value"
              >{{ statusObj.name }}</option
            >
          </select></b
        >
        <b v-if="user.role.type === 'public'" style="color: red">狀態：{{ status[order.status] }}</b>
      </div>
    </div>
  </div>
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
      status: {
        'init': '訂單接收中',
        'prepare': '訂單準備中',
        'delivering': '外送中',
        'done': '訂單已完成'
      },
      statusTypes: [
        {
          name: "訂單接收中",
          value: "init"
        },
        {
          name: "訂單準備中",
          value: "prepare"
        },
        {
          name: "外送中",
          value: "delivering"
        },
        {
          name: "訂單已完成",
          value: "done"
        }
      ],
      user: null
    };
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
      fetchPolicy: "network-only"
    },
    me: {
      query: ME,
      skip() {
        return !localStorage.getItem("apollo-token") && !this.$route.query.id;
      },
      result({ data }) {
        this.user = data.me;
      }
    }
  }
};
</script>

<style scoped>
.drink {
  display: flex;
  flex-direction: column;
  padding: 10px 300px;
  text-align: left;
}
</style>
