<script setup>
import { ref, watch, nextTick, computed } from "vue";

const props = defineProps({
  results: { type: Array, default: () => [] },
  status: { type: String, default: "idle" },
  roundTransition: {
    type: Object,
    default: () => ({ active: false, fromRound: null, toRound: null }),
  },
});

const resultsBoxRef = ref(null);

const lastHeadRef = ref(null);

const showOverlay = computed(() => {
  return props.status === "betweenRounds" || !!props.roundTransition?.active;
});

const overlayText = computed(() => {
  const to = props.roundTransition?.toRound;
  if (typeof to === "number") return `Round ${to} loading...`;
  return "Loading next round...";
});

function setLastHeadRef(el, idx) {
  if (idx === props.results.length - 1) lastHeadRef.value = el;
}

watch(
  () => props.results.length,
  async (len, prevLen) => {
    if (len <= 1) return;

    await nextTick();

    const box = resultsBoxRef.value;
    const head = lastHeadRef.value;
    if (!box || !head) return;

    const boxRect = box.getBoundingClientRect();
    const headRect = head.getBoundingClientRect();

    const relativeTop = headRect.top - boxRect.top;

    const offset = 10;

    box.scrollTo({
      top: box.scrollTop + relativeTop - offset,
      behavior: "smooth",
    });
  }
);
</script>

<template>
  <div>
    <div class="panel-head">
      <h2>Results</h2>
      <span class="meta" v-if="results.length">{{ results.length }}</span>
    </div>

    <div v-if="!results.length" class="box">Results will be here</div>

    <div
      v-else
      class="resultsBox"
      ref="resultsBoxRef"
      style="position: relative; scroll-behavior: smooth"
    >
      <div v-if="showOverlay" class="resultsOverlay">
        <div class="resultsOverlayPill">{{ overlayText }}</div>
      </div>

      <div v-for="(r, idx) in results" :key="r.round" class="resultCard">
        <div class="resultHead" :ref="(el) => setLastHeadRef(el, idx)">
          <div class="resultTitle">
            <strong>Round {{ r.round }}</strong>
            <span class="resultSub">— {{ r.distance }}m</span>
          </div>
          <span class="badge badge-soft">{{ r.ranking?.length ?? 0 }}</span>
        </div>

        <table class="miniTable">
          <thead>
            <tr>
              <th style="width: 72px">Pos</th>
              <th>Name</th>
              <th style="width: 92px">Cond.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in r.ranking" :key="row.horseId">
              <td>
                <span class="pill"
                  ><strong>#{{ row.position }}</strong></span
                >
              </td>
              <td>
                <div class="name">
                  <span
                    class="dot"
                    :style="{ backgroundColor: row.color }"
                  ></span>
                  <span>{{ row.name }}</span>
                </div>
              </td>
              <td>
                <span class="pill"
                  ><span class="cond">{{ row.condition }}</span></span
                >
              </td>
            </tr>
          </tbody>
        </table>

        <div class="divider"></div>
      </div>
    </div>
  </div>
</template>
