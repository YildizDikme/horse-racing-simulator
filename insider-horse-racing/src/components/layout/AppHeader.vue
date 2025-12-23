<script setup>
import HorseIcon from "../../assets/icon-horse.svg";

defineProps({
  horsesCount: { type: Number, default: 0 },
  status: { type: String, default: "idle" },
  programCount: { type: Number, default: 0 },
  isStartDisabled: { type: Boolean, default: true },
});

const emit = defineEmits(["generate", "startPause"]);
</script>

<template>
  <header class="header">
    <div class="title">
      <div class="titleRow">
        <img :src="HorseIcon" alt="Horse" class="logo" />
        <h1>Horse Racing</h1>
      </div>

      <p class="subtitle">
        Generate program, start races, watch results.
        <span v-if="horsesCount" class="badge">{{ horsesCount }}/20</span>
        <span v-if="status !== 'idle'" class="badge badge-soft">{{
          status
        }}</span>
        <span v-if="programCount" class="badge badge-soft"
          >{{ programCount }}/6 rounds</span
        >
      </p>
    </div>

    <div class="actions">
      <button type="button" class="btn" @click="emit('generate')">
        Generate Program
      </button>

      <button
        type="button"
        class="btn btn-primary"
        :disabled="isStartDisabled"
        @click="emit('startPause')"
      >
        Start / Pause
      </button>
    </div>
  </header>
</template>
