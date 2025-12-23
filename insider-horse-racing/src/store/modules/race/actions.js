
const HORSE_NAMES = [
  "Ada Lovelace",
  "Grace Hopper",
  "Margaret Hamilton",
  "Katherine Johnson",
  "Hedy Lamarr",
  "Radia Perlman",
  "Barbara Liskov",
  "Mary Jackson",
  "Dorothy Vaughan",
  "Joan Clarke",
  "Alan Turing",
  "Edsger Dijkstra",
  "Donald Knuth",
  "Ken Thompson",
  "Dennis Ritchie",
  "Linus Torvalds",
  "Guido van Rossum",
  "Brendan Eich",
  "Tim Berners-Lee",
  "James Gosling",
];

const HORSE_COLORS = [
  "#E74C3C",
  "#3498DB",
  "#F1C40F",
  "#2ECC71",
  "#9B59B6",
  "#E67E22",
  "#1ABC9C",
  "#34495E",
  "#D35400",
  "#16A085",
  "#8E44AD",
  "#2C3E50",
  "#27AE60",
  "#C0392B",
  "#2980B9",
  "#F39C12",
  "#7F8C8D",
  "#00B894",
  "#6C5CE7",
  "#FD79A8",
];

const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200];


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}


function buildHorses() {
  const names = shuffle(HORSE_NAMES);
  const colors = shuffle(HORSE_COLORS);

  return Array.from({ length: 20 }).map((_, i) => ({
    id: `horse_${i + 1}`,
    name: names[i],
    color: colors[i],
    condition: randomInt(1, 100),
  }));
}

function pickRandomHorses(horses, count = 10) {
  return shuffle(horses).slice(0, count);
}

function buildProgram(horses) {
  return ROUND_DISTANCES.map((distance, index) => {
    const selected = pickRandomHorses(horses, 10);
    return {
      id: `round_${index + 1}`,
      round: index + 1,
      distance,
      horses: selected,
    };
  });
}

function buildPositions(roundHorses) {
  return (roundHorses || []).map((h) => ({
    horseId: h.id,
    x: 0,
    speed: randomFloat(0.8, 1.7),
    finished: false,
  }));
}

function sortByFinishOrder(positions) {
  return [...positions].sort((a, b) => b.x - a.x);
}


export default {
  generateProgram({ commit }) {
    const horses = buildHorses();
    const program = buildProgram(horses);

    commit("SET_HORSES", horses);
    commit("SET_PROGRAM", program);
    commit("SET_RESULTS", []);
    commit("SET_POSITIONS", []);
    commit("SET_CURRENT_ROUND", -1);
    commit("SET_STATUS", "generated");

    commit("SET_ROUND_TRANSITION", {
      active: false,
      fromRound: null,
      toRound: null,
    });
  },

  startOrPause({ state, commit, dispatch }) {
    if (!state.program || state.program.length === 0) return;

    if (state.status === "running") {
      commit("SET_STATUS", "paused");
      return;
    }

    if (state.status === "paused") {
      commit("SET_STATUS", "running");
      dispatch("tick");
      return;
    }

    if (state.status === "betweenRounds") return;

    if (
      state.status === "generated" ||
      state.status === "idle" ||
      state.status === "finished"
    ) {
      commit("SET_RESULTS", []);
      commit("SET_CURRENT_ROUND", 0);

      const round = state.program[0];
      commit("SET_POSITIONS", buildPositions(round.horses));

      commit("SET_ROUND_TRANSITION", {
        active: false,
        fromRound: null,
        toRound: null,
      });

      commit("SET_STATUS", "running");
      dispatch("tick");
    }
  },

  tick({ state, commit, dispatch }) {
    if (state.status !== "running") return;

    const FINISH_X = 100;

    const tickMs = typeof state.tickMs === "number" ? state.tickMs : 90;

    const next = (state.positions || []).map((p) => {
      if (p.finished) return p;

      const wobble = randomFloat(-0.15, 0.15);
      const x = Math.max(0, p.x + p.speed + wobble);

      if (x >= FINISH_X) {
        return { ...p, x: FINISH_X, finished: true };
      }

      return { ...p, x };
    });

    commit("SET_POSITIONS", next);

    const allFinished = next.length > 0 && next.every((p) => p.finished);

    if (allFinished) {
      dispatch("finishRound");
      return;
    }

    setTimeout(() => dispatch("tick"), tickMs);
  },

  finishRound({ state, commit, dispatch }) {
    const round = state.program?.[state.currentRoundIndex];
    if (!round) {
      commit("SET_STATUS", "generated");
      commit("SET_ROUND_TRANSITION", {
        active: false,
        fromRound: null,
        toRound: null,
      });
      return;
    }

    const order = sortByFinishOrder(state.positions || []);
    const roundResult = {
      round: round.round,
      distance: round.distance,
      ranking: order.map((p, idx) => {
        const horse = round.horses.find((h) => h.id === p.horseId);
        return {
          position: idx + 1,
          horseId: p.horseId,
          name: horse?.name ?? "Unknown",
          color: horse?.color ?? "#000",
          condition: horse?.condition ?? 0,
        };
      }),
    };

    commit("SET_RESULTS", [...(state.results || []), roundResult]);

    const isLast = state.currentRoundIndex >= state.program.length - 1;
    if (isLast) {
      commit("SET_STATUS", "finished");
      commit("SET_ROUND_TRANSITION", {
        active: false,
        fromRound: null,
        toRound: null,
      });
      return;
    }

    const nextIndex = state.currentRoundIndex + 1;

    commit("SET_STATUS", "betweenRounds");
    commit("SET_ROUND_TRANSITION", {
      active: true,
      fromRound: round.round,
      toRound: nextIndex + 1,
    });

    setTimeout(() => {
      commit("SET_CURRENT_ROUND", nextIndex);

      const nextRound = state.program[nextIndex];
      commit("SET_POSITIONS", buildPositions(nextRound.horses));

      commit("SET_ROUND_TRANSITION", {
        active: false,
        fromRound: null,
        toRound: null,
      });

      commit("SET_STATUS", "running");
      dispatch("tick");
    }, 450);
  },

  resetAll({ commit }) {
    commit("RESET");
  },
};
