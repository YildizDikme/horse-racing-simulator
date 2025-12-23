export default () => ({
  horses: [],
  program: [],
  results: [],
  status: "idle", 
  currentRoundIndex: -1,

  positions: [],
  tickMs: 60,

  roundTransition: {
    active: false,
    fromRound: null,
    toRound: null,
  },
});
