export default {
  SET_HORSES(state, horses) {
    state.horses = horses;
  },
  SET_PROGRAM(state, program) {
    state.program = program;
  },
  SET_RESULTS(state, results) {
    state.results = results;
  },
  SET_STATUS(state, status) {
    state.status = status;
  },
  SET_CURRENT_ROUND(state, idx) {
    state.currentRoundIndex = idx;
  },

  SET_POSITIONS(state, positions) {
    state.positions = positions;
  },
  UPDATE_POSITION(state, { horseId, x }) {
    const item = state.positions.find((p) => p.horseId === horseId);
    if (item) item.x = x;
  },

  SET_ROUND_TRANSITION(state, payload) {
    state.roundTransition = payload;
  },

  RESET(state) {
    state.horses = [];
    state.program = [];
    state.results = [];
    state.status = "idle";
    state.currentRoundIndex = -1;
    state.positions = [];

    state.roundTransition = { active: false, fromRound: null, toRound: null };
  },
};
