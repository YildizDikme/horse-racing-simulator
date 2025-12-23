<script setup>
defineProps({
  program: { type: Array, default: () => [] },
});
</script>

<template>
  <div>
    <div class="panel-head">
      <h2>Program</h2>
      <span class="meta" v-if="program.length">{{ program.length }}/6</span>
    </div>

    <div class="box box--miniTable">
      <table class="miniTable">
        <thead>
          <tr>
            <th style="width: 70px">Round</th>
            <th style="width: 90px">Distance</th>
            <th>Horses</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="program.length === 0">
            <td colspan="3" class="empty">
              Program will appear after Generate.
            </td>
          </tr>

          <tr v-for="r in program" :key="r.id">
            <td>{{ r.round }}</td>
            <td>{{ r.distance }}m</td>
            <td class="horsesCell">
              <span v-for="h in r.horses" :key="h.id" class="chip">
                <span
                  class="chipDot"
                  :style="{ backgroundColor: h.color }"
                ></span>
                {{ h.name }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
