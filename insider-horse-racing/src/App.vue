<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

import AppHeader from "./components/layout/AppHeader.vue";
import HorseListPanel from "./components/race/HorseListPanel.vue";
import TrackPanel from "./components/race/TrackPanel.vue";
import ProgramPanel from "./components/race/ProgramPanel.vue";
import ResultsPanel from "./components/race/ResultsPanel.vue";

const store = useStore();

const horses = computed(() => store.state.race.horses);
const program = computed(() => store.state.race.program);
const results = computed(() => store.state.race.results);

const positions = computed(() => store.state.race.positions);

const horsesCount = computed(() => store.getters["race/horsesCount"]);
const status = computed(() => store.state.race.status);

const currentRound = computed(() => store.getters["race/currentRound"]);
const currentRoundLabel = computed(() => {
  if (!currentRound.value) return "–";
  return `${currentRound.value.round} (${currentRound.value.distance}m)`;
});

function handleGenerate() {
  store.dispatch("race/generateProgram");
}

function handleStartPause() {
  store.dispatch("race/startOrPause");
}
</script>

<template>
  <div class="app">
    <AppHeader
      :horsesCount="horsesCount"
      :status="status"
      :programCount="program.length"
      :isStartDisabled="program.length === 0"
      @generate="handleGenerate"
      @startPause="handleStartPause"
    />

    <main class="layout">
      <HorseListPanel :horses="horses" />
      <TrackPanel
        :roundLabel="currentRoundLabel"
        :round="currentRound"
        :positions="positions"
        :status="status"
        :roundTransition="store.state.race.roundTransition"
      />
      <section class="panel">
        <ProgramPanel :program="program" />
        <div class="divider"></div>
        <ResultsPanel
          :results="results"
          :status="status"
          :roundTransition="store.state.race.roundTransition"
        />
      </section>
    </main>
  </div>
</template>
