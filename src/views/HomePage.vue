<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="app-toolbar">
        <ion-title>Início</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="app-content">
      <ion-grid class="app-shell">
        <ion-row>
          <ion-col>
            <ion-card class="app-card" style="margin:0">
              <ion-icon
                :icon="shieldCheckmarkOutline"
                style="font-size:42px;color:#315b96"
              />
              <ion-text class="app-heading">
                Olá, {{ nome || 'bem-vindo(a)' }}!
              </ion-text>
              <ion-text class="app-description">
                Que bom ter você por aqui. Acesse seu perfil para visualizar
                e atualizar seus dados.
              </ion-text>

              <ion-button
                class="app-button"
                expand="block"
                @click="router.push('/tabs/perfil')"
              >
                <ion-icon :icon="personCircleOutline" slot="start" />
                Meu perfil
              </ion-button>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonCard, IonText, IonIcon, IonButton,
} from "@ionic/vue";
import { shieldCheckmarkOutline, personCircleOutline } from "ionicons/icons";
import { buscarPerfil } from "@/services/supabaseService";

const router = useRouter();
const nome = ref("");

onMounted(async () => {
  try {
    const perfil = await buscarPerfil();
    nome.value = perfil.nome;
  } catch {
    // A página continua utilizável se não for possível carregar o nome.
  }
});
</script>