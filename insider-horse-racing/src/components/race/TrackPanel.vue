<script setup>
import { computed, ref, watch } from "vue";
import HorseIcon from "../../assets/icon-horse.svg";

const props = defineProps({
  roundLabel: { type: String, default: "–" },
  round: { type: Object, default: null },
  positions: { type: Array, default: () => [] },

  status: { type: String, default: "idle" },
  roundTransition: {
    type: Object,
    default: () => ({ active: false, fromRound: null, toRound: null }),
  },
});

const lanes = computed(() => {
  const horses = props.round?.horses ?? [];
  return horses.map((h) => {
    const p = (props.positions ?? []).find((pp) => pp.horseId === h.id);
    const x = typeof p?.x === "number" ? Math.max(0, Math.min(100, p.x)) : 0;

    return {
      id: h.id,
      name: h.name,
      color: h.color,
      x,
    };
  });
});

const showOverlay = computed(() => {
  return props.status === "betweenRounds" || !!props.roundTransition?.active;
});

const freezeMotion = ref(false);

watch(showOverlay, (now, prev) => {
  if (prev === true && now === false) {
    freezeMotion.value = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        freezeMotion.value = false;
      });
    });
  }
});

const overlayTitle = computed(() => {
  const to = props.roundTransition?.toRound;
  if (typeof to === "number") return `Round ${to} starting...`;
  return "Next round starting...";
});

const overlaySub = computed(() => {
  const from = props.roundTransition?.fromRound;
  const to = props.roundTransition?.toRound;
  if (typeof from === "number" && typeof to === "number") {
    return `From Round ${from} → Round ${to}`;
  }
  return "Preparing track...";
});
</script>

<template>
  <section
    class="track"
    :class="{
      'is-transitioning': showOverlay,
      'is-freeze': freezeMotion,
    }"
  >
    <div class="panel-head">
      <h2>Track</h2>
      <span class="track-meta">Round: {{ roundLabel }}</span>
    </div>

    <div class="track-box">
      <div v-if="showOverlay" class="roundOverlay">
        <div class="roundOverlayCard">
          <div class="roundOverlayTitle">{{ overlayTitle }}</div>
          <div class="roundOverlaySub">{{ overlaySub }}</div>
        </div>
      </div>

      <div v-if="!round" class="track-empty">Generate Program to start.</div>

      <div v-else class="track-inner">
        <div class="finish-line"></div>

        <div v-for="lane in lanes" :key="lane.id" class="lane">
          <div class="lane-left">
            <span
              class="lane-dot"
              :style="{ backgroundColor: lane.color }"
            ></span>
            <span class="lane-name">{{ lane.name }}</span>
          </div>

          <div class="lane-track">
            <img
              class="horse"
              :class="{
                'is-running': lane.x > 0 && lane.x < 100,
                'is-finished': lane.x >= 100,
              }"
              :src="HorseIcon"
              alt="horse"
              :style="{ left: `calc(${lane.x}% - 10px)` }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
