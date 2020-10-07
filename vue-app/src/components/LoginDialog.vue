<template>
  <v-dialog v-model="dialog" max-width="480px" max-height="640px" persistent>
    <v-card>
      <v-toolbar color="indigo" dark>
        <v-toolbar-title>登入</v-toolbar-title>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="submit">
        <v-card-text>
          <v-text-field
            v-model="email"
            label="Email address"
            :suffix="defaultGmail"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            label="Password"
            hint="At least 8 characters"
            @click:append="show1 = !show1"
          ></v-text-field>
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
      defaultGmail: "@gmail.com",
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
      const input = {
        identifier: this.email + this.defaultGmail,
        password: this.password
      };
      const result = await this.$apollo
        .mutate({
          mutation: LOGIN,
          variables: {
            input
          }
        })
        .then(response => {
          if (response.data.login) {
            onLogin(
              this.$apollo.provider.defaultClient,
              response.data.login.jwt
            );
            this.$emit("close-dialog", { loginData: response.data.login });
          }
        });
    }
  }
};
</script>
