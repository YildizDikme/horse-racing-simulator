import { describe, it, expect, vi } from "vitest";
import actions from "../../src/store/modules/race/actions";

function makeProgram() {
  return [
    {
      id: "round_1",
      round: 1,
      distance: 1200,
      horses: [
        { id: "horse_1", name: "Ada", color: "#111", condition: 50 },
        { id: "horse_2", name: "Grace", color: "#222", condition: 60 },
      ],
    },
  ];
}

function createMockContext(overrides = {}) {
  const base = {
    state: {
      status: "idle",
      horses: [],
      program: [],
      results: [],
      positions: [],
      currentRoundIndex: -1,
      tickMs: 90,
      roundTransition: { active: false, fromRound: null, toRound: null },
    },
    getters: {},
    commit: vi.fn(),
    dispatch: vi.fn(),
  };

  return {
    ...base,
    ...overrides,
    state: { ...base.state, ...(overrides.state || {}) },
    getters: { ...base.getters, ...(overrides.getters || {}) },
  };
}

describe("race actions", () => {
  it("generateProgram should create horses and program", async () => {
    const ctx = createMockContext();

    await actions.generateProgram(ctx);

    expect(ctx.commit).toHaveBeenCalled();
    expect(ctx.commit).toHaveBeenCalledWith("SET_STATUS", "generated");
    expect(ctx.commit).toHaveBeenCalledWith("SET_HORSES", expect.any(Array));
    expect(ctx.commit).toHaveBeenCalledWith("SET_PROGRAM", expect.any(Array));
  });

  it("startOrPause: idle -> running (and dispatch tick)", async () => {
    const ctx = createMockContext({
      state: {
        status: "idle",
        program: makeProgram(), 
      },
    });

    await actions.startOrPause(ctx);

    expect(ctx.commit).toHaveBeenCalledWith("SET_CURRENT_ROUND", 0);
    expect(ctx.commit).toHaveBeenCalledWith("SET_STATUS", "running");

    expect(ctx.dispatch).toHaveBeenCalledWith("tick");
  });

  it("startOrPause: running -> paused", async () => {
    const ctx = createMockContext({
      state: {
        status: "running",
        program: makeProgram(), 
      },
    });

    await actions.startOrPause(ctx);

    expect(ctx.commit).toHaveBeenCalledWith("SET_STATUS", "paused");
    expect(ctx.dispatch).not.toHaveBeenCalledWith("tick");
  });

  it("startOrPause: paused -> running (and dispatch tick)", async () => {
    const ctx = createMockContext({
      state: {
        status: "paused",
        program: makeProgram(), 
      },
    });

    await actions.startOrPause(ctx);

    expect(ctx.commit).toHaveBeenCalledWith("SET_STATUS", "running");
    expect(ctx.dispatch).toHaveBeenCalledWith("tick");
  });

  it("DEBUG startOrPause: prints commit/dispatch calls (with program)", async () => {
    const ctx = createMockContext({
      state: { status: "idle", program: makeProgram() },
    });

    await actions.startOrPause(ctx);

    console.log("commit calls:", ctx.commit.mock.calls);
    console.log("dispatch calls:", ctx.dispatch.mock.calls);

    expect(true).toBe(true);
  });
});
