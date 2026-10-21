<template>
  <ion-page>
    <ion-content class="app-content" :fullscreen="true">
      <ion-grid class="app-shell">
        <ion-row>
          <ion-col>
            <ion-card class="app-brand" style="box-shadow:none;background:transparent">
              <ion-icon :icon="personAddOutline" />
              <ion-title>Crie sua conta</ion-title>
              <ion-text>Seus dados, com segurança.</ion-text>
            </ion-card>

            <ion-card class="app-card" style="margin:0">
              <ion-text class="app-heading">Cadastro</ion-text>
              <ion-text class="app-description">
                Preencha os campos abaixo para começar.
              </ion-text>

              <ion-item class="app-field" lines="none">
                <ion-icon :icon="personOutline" slot="start" />
                <ion-input
                  v-model="nome"
                  label="Nome completo"
                  label-placement="stacked"
                  placeholder="Seu nome"
                  autocomplete="name"
                />
              </ion-item>

              <ion-item class="app-field" lines="none">
                <ion-icon :icon="mailOutline" slot="start" />
                <ion-input
                  v-model="email"
                  type="email"
                  label="E-mail"
                  label-placement="stacked"
                  placeholder="seu@email.com"
                  autocomplete="email"
                />
              </ion-item>

              <ion-item class="app-field" lines="none">
                <ion-icon :icon="lockClosedOutline" slot="start" />
                <ion-input
                  v-model="senha"
                  type="password"
                  label="Senha"
                  label-placement="stacked"
                  placeholder="Mínimo de 6 caracteres"
                  autocomplete="new-password"
                />
              </ion-item>

              <ion-item class="app-field" lines="none">
                <ion-icon :icon="shieldCheckmarkOutline" slot="start" />
                <ion-input
                  v-model="confirmarSenha"
                  type="password"
                  label="Confirmar senha"
                  label-placement="stacked"
                  placeholder="Digite a senha novamente"
                  autocomplete="new-password"
                />
              </ion-item>

              <ion-text v-if="mensagem" :class="sucesso ? 'app-success' : 'app-error'">
                {{ mensagem }}
              </ion-text>

              <ion-button
                class="app-button"
                expand="block"
                :disabled="carregando"
                @click="cadastrar"
              >
                {{ carregando ? 'Criando conta...' : 'Criar minha conta' }}
              </ion-button>

              <ion-text class="app-link" @click="router.push('/login')">
                Já possui uma conta? <strong>Entrar</strong>
              </ion-text>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage, IonContent, IonGrid, IonRow, IonCol,
  IonCard, IonTitle, IonText, IonIcon, IonItem,
  IonInput, IonButton,
} from "@ionic/vue";
import {
  personAddOutline, personOutline, mailOutline,
  lockClosedOutline, shieldCheckmarkOutline,
} from "ionicons/icons";
import { cadastrarUsuario } from "@/services/supabaseService";

const router = useRouter();

const nome = ref("");
const email = ref("");
const senha = ref("");
const confirmarSenha = ref("");
const mensagem = ref("");
const sucesso = ref(false);
const carregando = ref(false);

async function cadastrar() {
  mensagem.value = "";
  sucesso.value = false;

  if (!nome.value.trim() || !email.value.trim() || !senha.value) {
    mensagem.value = "Preencha todos os campos.";
    return;
  }

  if (senha.value.length < 6) {
    mensagem.value = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  if (senha.value !== confirmarSenha.value) {
    mensagem.value = "As senhas não coincidem.";
    return;
  }

  carregando.value = true;

  try {
    const resultado = await cadastrarUsuario(
      nome.value,
      email.value,
      senha.value,
    );

    if (!resultado.session) {
      mensagem.value =
        "Conta criada! Verifique seu e-mail para confirmar o cadastro.";
      sucesso.value = true;
      return;
    }

    await router.replace("/tabs/inicio");
  } catch (error) {
    mensagem.value =
      error instanceof Error ? error.message : "Não foi possível criar a conta.";
  } finally {
    carregando.value = false;
  }
}
</script>