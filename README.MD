<h1 align="center">
  <br>
  <!-- Substitua pelo logo do projeto se tiver -->
  📱 App Fatec Eventos
  <br>
</h1>

<p align="center">
  <strong>Sistema de Gerenciamento de Eventos — Fatec Itu "Dom Amaury Castanho"</strong>
</p>

<p align="center">
  <img alt="React Native" src="https://img.shields.io/badge/React_Native-0.81-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img alt="Expo" src="https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img alt="Android" src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white"/>
  <img alt="iOS" src="https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white"/>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-como-rodar">Como Rodar</a> •
  <a href="#-build-de-produção">Build</a> •
  <a href="#-créditos">Créditos</a>
</p>

---

## 📌 Sobre o Projeto

Este aplicativo é o **Trabalho de Graduação (TG)** desenvolvido para a **Faculdade de Tecnologia de Itu — Dom Amaury Castanho (Fatec Itu)** e representa o front-end mobile de um ecossistema completo (Web + Mobile) de gerenciamento de eventos acadêmicos.

O objetivo é modernizar e digitalizar o ciclo completo dos eventos da instituição: da **divulgação e inscrição** até a **validação de presença** no dia do evento. Alunos podem realizar check-in de forma prática via **GPS** ou **Palavra Secreta**, eliminando listas físicas de chamada. Professores e administradores têm controle total sobre criação, gestão e relatórios de eventos diretamente pelo celular.

> ✨ **Destaque:** Este é o único ecossistema (Web + Mobile) desenvolvido exclusivamente por alunos que está implementado e **em uso oficial** pela faculdade, atendendo a toda a comunidade acadêmica.

---

## ✅ Funcionalidades

### 👨‍🎓 Perfil: Aluno
- Visualizar feed de eventos disponíveis
- Inscrever-se e cancelar inscrição em eventos
- Consultar detalhes completos do evento (data, local, categoria, vagas)
- Realizar **check-in por GPS** (valida a presença pela localização geográfica)
- Realizar **check-in por Palavra Secreta** (código fornecido no dia do evento)
- Acompanhar histórico de inscrições e presenças
- Editar perfil e foto

### 👨‍🏫 Perfil: Professor
- Criar e gerenciar eventos (nome, descrição, data, local, vagas, categoria)
- Visualizar lista de participantes inscritos
- Realizar controle de presença manual (chamada)
- Consultar estatísticas de comparecimento

### 🔧 Perfil: Administrador
- Dashboard com visão geral do sistema
- Gerenciar **Categorias** de eventos
- Gerenciar **Cursos** da instituição
- Gerenciar **Usuários** (alunos e professores)
- Acesso total a todas as funcionalidades de professor

---

## 🖥 Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **React Native** | 0.81 | Framework principal para UI nativa cross-platform |
| **Expo** | ~54 | Toolchain de desenvolvimento, build e deploy |
| **TypeScript** | ~5.9 | Tipagem estática para código seguro e escalável |
| **React Navigation** | 6 | Navegação entre telas (Stack + Bottom Tabs) |
| **Axios** | ^1.14 | Cliente HTTP para comunicação com a API REST |
| **React Hook Form** | ^7.75 | Gerenciamento de estado e submissão de formulários |
| **Zod** | ^4.4 | Validação declarativa e tipada de dados |
| **Expo Location** | ~19 | Geolocalização via GPS para check-in |
| **Expo Camera** | ~17 | Acesso à câmera do dispositivo |
| **Expo Notifications** | ~0.32 | Push notifications |
| **Expo Secure Store** | ~15 | Armazenamento seguro do token JWT |
| **React Native Maps** | 1.20 | Exibição de mapas interativos |
| **React Native Calendars** | ^1.1314 | Componente de calendário para seleção de datas |

---

## 🏗 Arquitetura

Todo o código-fonte está concentrado na pasta `./src`, organizada de forma modular e escalável:

```
src/
├── assets/             # Recursos visuais estáticos (ícones, logos, splash)
├── components/         # Componentes reutilizáveis de UI
│   ├── CustomAlert.tsx     → Alertas de sucesso, erro e aviso
│   ├── EventCard.tsx       → Card de resumo de evento
│   ├── FeedbackModal.tsx   → Modal de feedback interativo
│   ├── ParticipantRow.tsx  → Item de lista de participantes
│   └── ProgressBar.tsx     → Barra de progresso visual
├── config/             # Configurações de ambiente (URL base da API)
├── factory/            # Instância configurada do Axios (interceptors JWT)
├── navigation/         # Definição de rotas e navegadores
│   ├── AppNavigator.tsx        → Stack Navigator principal
│   ├── TabNavigator.tsx        → Abas do perfil Professor/Admin
│   ├── AlunoTabNavigator.tsx   → Abas do perfil Aluno
│   └── types.ts                → Tipagem das rotas e parâmetros
├── screens/            # Telas separadas por perfil de acesso
│   ├── Auth/           → Login e Cadastro
│   ├── Aluno/          → Home, Inscrições, Detalhes do Evento, Check-in (GPS)
│   ├── Professor/      → Home, Criar Evento, Lista de Chamada, Admin (Dashboard, Categorias, Cursos, Usuários)
│   └── Shared/         → Telas compartilhadas (Detalhes, Perfil, Configurações, Editar Perfil)
├── services/           # Camada de acesso à API REST (por domínio)
│   ├── authService.ts
│   ├── categoryService.ts
│   ├── courseService.ts
│   ├── eventService.ts
│   ├── participantService.ts
│   └── userService.ts
├── styles/
│   └── colors.ts       → Paleta de cores oficial da Fatec
├── utils/
│   ├── badWords.ts     → Filtro de linguagem inapropriada em formulários
│   └── tokenSave.ts    → Persistência segura do token JWT
└── validations/
    └── schemas.ts      → Schemas Zod: validação de RA (13 dígitos), e-mail @fatec.sp.gov.br, etc.
```

**Na raiz do projeto** estão os arquivos de configuração do Expo: `App.js` (entry point), `app.config.js` (configurações da aplicação) e `eas.json` (perfis de build para produção).

---

## ❔ Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Git](https://git-scm.com/)
- Aplicativo **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- A **API back-end** em execução (veja o repositório do back-end nos [Créditos](#-créditos))

### Passo a Passo

**1. Clone o repositório:**
```bash
git clone https://github.com/SEU_USUARIO/app-eventos-fatec.git
cd app-eventos-fatec
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui
```
> Obtenha sua chave no [Google Cloud Console](https://console.cloud.google.com/). É necessário habilitar as seguintes APIs no projeto:
> - **Maps SDK for Android**
> - **Maps SDK for iOS**
>
> A mesma chave é utilizada para ambas as plataformas e é referenciada automaticamente pelo `app.config.js`.

**4. Inicie o servidor de desenvolvimento:**
```bash
npx expo start
```

Um QR Code será exibido no terminal. Abra o **Expo Go** no seu celular e escaneie o código para carregar o aplicativo em tempo real.

> **Dica:** Use `npx expo start --android` ou `--ios` para abrir diretamente em um emulador.

> **Permissões exigidas pelo app:** `ACCESS_FINE_LOCATION` e `ACCESS_COARSE_LOCATION` (Android). O sistema solicitará essas permissões automaticamente ao usuário no primeiro uso do check-in por GPS.

---

## 🚀 Build de Produção

O processo de build é gerenciado pelo **EAS (Expo Application Services)**.

**Pré-requisito:** Ter o EAS CLI instalado e estar autenticado:
```bash
npm install -g eas-cli
eas login
```

**Gerar APK para Android (preview):**
```bash
eas build -p android --profile preview
```

**Gerar AAB para publicação na Play Store:**
```bash
eas build -p android --profile production
```

O build é executado na nuvem. Ao finalizar, um link de download será disponibilizado no terminal e no dashboard do [Expo](https://expo.dev).

---

## ❤️ Créditos

Este projeto foi desenvolvido como **Trabalho de Graduação** na **Faculdade de Tecnologia de Itu — Dom Amaury Castanho**.

| Contribuição | Responsável |
|---|---|
| 📱 **App Mobile (este repositório)** | José Lucas Martins Gomes |
| 🌐 **API Back-end & Plataforma Web** | Guilherme Francisco Pereira |

- **Fatec Itu:** Por adotar o sistema em seu ambiente acadêmico. [Site Oficial](https://fatecitu.cps.sp.gov.br)
