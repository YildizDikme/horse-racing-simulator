export default {
  horsesCount(state) {
    return state.horses.length;
  },
  programCount(state) {
    return state.program.length;
  },
  currentRound(state) {
    if (state.currentRoundIndex < 0) return null;
    return state.program[state.currentRoundIndex] || null;
  },
};
