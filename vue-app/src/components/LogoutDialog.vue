<template>
  <v-dialog v-model="dialog" max-width="480px" max-height="640px" persistent>
    <v-card>
      <v-toolbar color="indigo" dark>
        <v-toolbar-title>登出</v-toolbar-title>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="submit">
        <v-card-text>
          確定要登出嗎？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="indigo" dark @click="$emit('close-dialog', false)"
            >取消</v-btn
          >
          <v-btn color="indigo" dark type="submit">確定</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { LOGIN } from "../constants/mutate";
import { onLogin } from "../vue-apollo";

export default {
  name: "Login",
  props: ["dialog"],
  data() {
    return {
      username: "",
      email: "",
      password: "",
      show1: false,
      show2: true,
      show3: false,
      show4: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        emailMatch: () => "The email and password you entered don't match"
      }
    };
  },
  methods: {
    async submit() {
      localStorage.removeItem("apollo-token");
      this.$emit("close-dialog", true);
    }
  }
};
</script>
