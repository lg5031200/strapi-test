<template>
  <div class="order">
    <button
      style="margin-bottom: 50px"
      @click="orderDialog = true"
      v-show="!order"
    >
      按我新增訂單
    </button>
    <div class="drink" v-if="order">
      <h3>飲料店：{{ order.restaurant.name }}</h3>
      <div v-for="product in products" :key="product.id">
        <div style="margin-top:20px">品名：{{ product.name }}</div>
        <div>價格：{{ product.price }} 元</div>
        冰塊：<select v-model="product.ice">
          <option v-for="ice in iceTypes" :key="ice">{{ ice }}</option>
        </select>
        <br />
        甜度：<select v-model="product.suger">
          <option v-for="suger in sugerTypes" :key="suger">{{ suger }}</option>
        </select>
        分
        <br />
        數量：<select v-model="product.quantity">
          <option v-for="index in 10" :key="index">{{ index }}</option>
        </select>
        杯
      </div>
      <br />
      <button :disabled="disabledSend" @click="send">送出</button>
    </div>

    <order-dialog
      :dialog="orderDialog"
      @close-dialog="closeDialog"
    ></order-dialog>
  </div>
</template>

<script>
import OrderDialog from "@/components/OrderDialog";
import { CREATE_DRINK } from "@/constants/mutate";
import { PRODUCTS, ORDER } from "../constants/query";

export default {
  name: "CreateOrder",
  components: {
    "order-dialog": OrderDialog
  },
  data() {
    return {
      iceTypes: ["正常", "少冰", "微冰", "去冰", "常溫", "溫熱"],
      sugerTypes: [0, 1, 3, 5, 8, 10],
      order: null,
      orderDialog: false
    };
  },
  computed: {
    disabledSend() {
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
            order: localStorage.getItem("order-id"),
            product: product.id,
            suger: Number(product.suger),
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
              localStorage.removeItem("order-id");

              this.$router.push({ path: "/about" });
            });
        }
      }
    },
    async closeDialog() {
      this.order = await this.getOrder();
      this.orderDialog = false;
    },
    async getOrder() {
      if (!localStorage.getItem("order-id")) return;
      const result = await this.$apollo.query({
        query: ORDER,
        variables: {
          id: localStorage.getItem("order-id")
        }
      });
      return result.data.order;
    }
  },
  async mounted() {
    this.order = await this.getOrder();
  },
  apollo: {
    products: {
      query: PRODUCTS,
      // fetchPolicy: "no-cache",
      variables() {
        return {
          where: {
            restaurant: {
              name: this.order ? this.order.restaurant.name : null
            }
          }
        };
      },
      result({data}) {
        console.log(data)
      }
    }
  }
};
</script>

<style scoped>
select {
  width: 50px;
}
.drink {
  display: flex;
  flex-direction: column;
  padding: 10px 300px;
  text-align: left;
}
</style>
