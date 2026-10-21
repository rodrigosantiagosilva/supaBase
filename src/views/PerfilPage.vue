
<template>
  <ion-page>
    <ion-header class="app-toolbar">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/inicio" text="Voltar" />
        </ion-buttons>

        <ion-title>Meu perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="app-content">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="8" size-lg="6">
            <ion-card class="app-card">
              <ion-card-content>
                <ion-avatar class="profile-avatar">
                  <ion-img
                    v-if="fotoUrl"
                    :src="fotoUrl"
                    alt="Foto do perfil"
                  />
                  <ion-icon
                    v-else
                    :icon="personCircleOutline"
                  />
                </ion-avatar>

                <ion-button
                  expand="block"
                  fill="outline"
                  class="photo-button"
                  :disabled="carregandoFoto"
                  @click="selecionarFoto"
                >
                  <ion-icon :icon="cameraOutline" slot="start" />
                  <ion-spinner v-if="carregandoFoto" name="crescent" />
                  <ion-text v-else>Alterar foto</ion-text>
                </ion-button>

                <ion-text color="medium">
                  <ion-label class="photo-hint">
                    Tire uma foto com a câmera ou escolha uma imagem da galeria.
                    Formatos aceitos: JPG, PNG ou WEBP, até 5 MB.
                  </ion-label>
                </ion-text>

                <ion-list lines="none">
                  <ion-item class="app-field">
                    <ion-icon :icon="personOutline" slot="start" />
                    <ion-input
                      v-model="nome"
                      label="Nome"
                      label-placement="stacked"
                      placeholder="Seu nome"
                      autocomplete="name"
                      required
                    />
                  </ion-item>

                  <ion-item class="app-field">
                    <ion-icon :icon="atOutline" slot="start" />
                    <ion-input
                      v-model="nickname"
                      label="Nickname"
                      label-placement="stacked"
                      placeholder="Como deseja ser chamado?"
                    />
                  </ion-item>
                </ion-list>

                <ion-text v-if="erro" color="danger">
                  <ion-item lines="none" class="message-item">
                    <ion-icon :icon="alertCircleOutline" slot="start" />
                    <ion-label class="ion-text-wrap">
                      {{ erro }}
                    </ion-label>
                  </ion-item>
                </ion-text>

                <ion-text v-if="sucesso" color="success">
                  <ion-item lines="none" class="message-item">
                    <ion-icon :icon="checkmarkCircleOutline" slot="start" />
                    <ion-label class="ion-text-wrap">
                      {{ sucesso }}
                    </ion-label>
                  </ion-item>
                </ion-text>

                <ion-button
                  expand="block"
                  class="app-button"
                  :disabled="carregando"
                  @click="salvarPerfil"
                >
                  <ion-spinner v-if="carregando" name="crescent" />
                  <ion-text v-else>Salvar alterações</ion-text>
                </ion-button>

                <ion-button
                  expand="block"
                  fill="outline"
                  color="danger"
                  class="logout-button"
                  @click="mostrarConfirmacao = true"
                >
                  <ion-icon :icon="logOutOutline" slot="start" />
                  Sair da conta
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-alert
        :is-open="mostrarEscolhaFoto"
        header="Alterar foto"
        message="Como você deseja escolher sua foto de perfil?"
        :buttons="botoesEscolhaFoto"
        @didDismiss="aoFecharEscolhaFoto"
      />

      <ion-alert
        :is-open="mostrarConfirmacao"
        header="Sair da conta"
        message="Deseja realmente sair da sua conta?"
        :buttons="botoesConfirmacao"
        @didDismiss="mostrarConfirmacao = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import {
  Camera,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonImg,
  IonIcon,
  IonButton,
  IonText,
  IonLabel,
  IonList,
  IonItem,
  IonInput,
  IonSpinner,
  IonAlert,
} from "@ionic/vue";

import {
  personCircleOutline,
  cameraOutline,
  personOutline,
  atOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  logOutOutline,
} from "ionicons/icons";

import {
  buscarPerfil,
  atualizarPerfil,
  enviarFotoPerfil,
  obterUrlFoto,
  sairDaConta,
} from "@/services/supabaseService";

const router = useRouter();

const nome = ref("");
const nickname = ref("");
const fotoUrl = ref("");
const caminhoFoto = ref<string | null>(null);

const carregando = ref(false);
const carregandoFoto = ref(false);
const erro = ref("");
const sucesso = ref("");

const mostrarConfirmacao = ref(false);
const mostrarEscolhaFoto = ref(false);

let resolverOrigemFoto:
  | ((origem: CameraSource | null) => void)
  | null = null;

const botoesEscolhaFoto = [
  {
    text: "Tirar foto",
    handler: () => {
      finalizarEscolhaFoto(CameraSource.Camera);
    },
  },
  {
    text: "Escolher da galeria",
    handler: () => {
      finalizarEscolhaFoto(CameraSource.Photos);
    },
  },
  {
    text: "Cancelar",
    role: "cancel",
    handler: () => {
      finalizarEscolhaFoto(null);
    },
  },
];

const botoesConfirmacao = [
  {
    text: "Cancelar",
    role: "cancel",
  },
  {
    text: "Sair",
    role: "destructive",
    handler: async () => {
      await sair();
    },
  },
];

onMounted(async () => {
  await carregarPerfil();
});

async function carregarPerfil() {
  erro.value = "";

  try {
    const perfil = await buscarPerfil();

    nome.value = perfil.nome ?? "";
    nickname.value = perfil.nickname ?? "";
    caminhoFoto.value = perfil.avatar_path ?? null;

    if (caminhoFoto.value) {
      fotoUrl.value = await obterUrlFoto(caminhoFoto.value);
    } else {
      fotoUrl.value = "";
    }
  } catch (error: unknown) {
    erro.value =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar seu perfil.";
  }
}

function escolherOrigemFoto(): Promise<CameraSource | null> {
  return new Promise((resolve) => {
    resolverOrigemFoto = resolve;
    mostrarEscolhaFoto.value = true;
  });
}

function finalizarEscolhaFoto(origem: CameraSource | null) {
  mostrarEscolhaFoto.value = false;

  if (resolverOrigemFoto) {
    const resolver = resolverOrigemFoto;
    resolverOrigemFoto = null;
    resolver(origem);
  }
}

function aoFecharEscolhaFoto() {
  mostrarEscolhaFoto.value = false;

  if (resolverOrigemFoto) {
    const resolver = resolverOrigemFoto;
    resolverOrigemFoto = null;
    resolver(null);
  }
}

async function selecionarFoto() {
  erro.value = "";
  sucesso.value = "";

  const origem = await escolherOrigemFoto();

  if (origem === null) {
    return;
  }

  carregandoFoto.value = true;

  try {
    const foto = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: origem,
    });

    if (!foto.webPath) {
      throw new Error("Não foi possível acessar a imagem selecionada.");
    }

    const resposta = await fetch(foto.webPath);
    const blob = await resposta.blob();

    const mime = blob.type || "image/jpeg";

    if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) {
      throw new Error("Escolha uma imagem JPG, PNG ou WEBP.");
    }

    if (blob.size > 5 * 1024 * 1024) {
      throw new Error("A imagem deve ter no máximo 5 MB.");
    }

    const extensao =
      mime === "image/png"
        ? "png"
        : mime === "image/webp"
          ? "webp"
          : "jpg";

    const arquivo = new File(
      [blob],
      `avatar.${extensao}`,
      { type: mime },
    );

    // O serviço envia a imagem e atualiza avatar_path.
    const caminho = await enviarFotoPerfil(arquivo);

    caminhoFoto.value = caminho;
    fotoUrl.value = await obterUrlFoto(caminho);

    sucesso.value = "Foto de perfil atualizada!";
  } catch (error: unknown) {
    const mensagem = error instanceof Error ? error.message : "";

    if (
      mensagem.toLowerCase().includes("cancel")
    ) {
      return;
    }

    erro.value =
      mensagem || "Não foi possível acessar a câmera ou a galeria.";
  } finally {
    carregandoFoto.value = false;
  }
}

async function salvarPerfil() {
  erro.value = "";
  sucesso.value = "";

  if (!nome.value.trim()) {
    erro.value = "O nome não pode ficar vazio.";
    return;
  }

  carregando.value = true;

  try {
    await atualizarPerfil(
      nome.value,
      nickname.value,
    );

    sucesso.value = "Perfil atualizado com sucesso!";
  } catch (error: unknown) {
    erro.value =
      error instanceof Error
        ? error.message
        : "Não foi possível salvar as alterações.";
  } finally {
    carregando.value = false;
  }
}

async function sair() {
  erro.value = "";

  try {
    await sairDaConta();
    await router.replace("/login");
  } catch (error: unknown) {
    erro.value =
      error instanceof Error
        ? error.message
        : "Não foi possível sair da conta.";
  }
}
</script>

<style scoped>
.app-card {
  margin: 18px 12px;
  border-radius: 24px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  margin: 20px auto 14px;
  background: #eaf1fa;
  color: var(--ion-color-primary);
}

.profile-avatar ion-icon {
  width: 100%;
  height: 100%;
}

.photo-button {
  margin: 12px auto;
  max-width: 240px;
  text-transform: none;
}

.photo-hint {
  display: block;
  margin: 12px 8px 22px;
  text-align: center;
  font-size: 13px;
  line-height: 1.5;
}

.app-field {
  margin: 12px 0;
  --border-radius: 14px;
  --background: #f1f5fb;
  --padding-start: 12px;
}

.app-button,
.logout-button {
  margin-top: 18px;
  min-height: 48px;
  font-weight: 700;
  text-transform: none;
}

.message-item {
  --background: transparent;
  font-size: 14px;
}
</style>
