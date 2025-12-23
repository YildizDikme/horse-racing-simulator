<script setup>
defineProps({
  horses: { type: Array, default: () => [] },
});
</script>

<template>
  <section class="panel">
    <div class="panel-head">
      <h2>Horse List (1–20)</h2>
    </div>

    <div class="box box--table">
      <table class="table">
        <thead>
          <tr>
            <th style="width: 44px">#</th>
            <th>Name</th>
            <th style="width: 110px">Condition</th>
            <th style="width: 90px">Color</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="horses.length === 0">
            <td colspan="4" class="empty">
              Click “Generate Program” to create horses.
            </td>
          </tr>

          <tr v-for="(h, idx) in horses" :key="h.id">
            <td>{{ idx + 1 }}</td>

            <td class="name">
              <span class="dot" :style="{ backgroundColor: h.color }"></span>
              <span>{{ h.name }}</span>
            </td>

            <td>
              <span class="cond">{{ h.condition }}</span>
            </td>

            <td>
              <span class="pill">{{ h.color }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
