<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="inicio" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Início</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="perfil" href="/tabs/perfil">
          <ion-icon :icon="personCircleOutline" />
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonTabs, IonRouterOutlet, IonTabBar,
  IonTabButton, IonIcon, IonLabel,
} from "@ionic/vue";
import { homeOutline, personCircleOutline } from "ionicons/icons";
</script>